/*
 * Project: Milestone 1
 * File Name: IOhandler.js
 * Description: Collection of functions for files input/output related operations
 *
 * Created Date: 02/11/23
 * Author: Angus Ng
 *
 */

const AdmZip = require("adm-zip"),
  fs = require("fs").promises,
  { createReadStream, createWriteStream } = require("fs"),
  { pipeline } = require("stream/promises")
  PNG = require("pngjs").PNG,
  path = require("path"),
  { Worker, workerData } = require("node:worker_threads");

/**
 * Description: decompress file from given pathIn, write to given pathOut
 *
 * @param {string} pathIn
 * @param {string} pathOut
 * @return {promise}
 */
const unzip = (pathIn, pathOut) => {
  return new Promise((resolve, reject) => {
  new AdmZip(pathIn)
  .extractAllToAsync(pathOut, true, null, (err) => {
    if (err) {
      reject(err);
    } else {
      console.log("The extraction is complete.");
      resolve();
    }})
  })
};

/**
 * Description: read all the png files from given directory and return Promise containing array of each png file path
 *
 * @param {string} path
 * @return {promise}
 */
const readDir = (dir) => {
 return fs.readdir(dir,{withFileTypes: true})
 .then((files) => filterPNGs(files))
 .then((pngs) => toPathsArr(pngs))
 .catch((err) => console.log(err));
};

/**
 * Description: Read in png file by given pathIn,
 * convert to grayscale and write to given pathOut
 *
 * @param {string} filePath
 * @param {string} pathProcessed
 * @return {promise}
 */
const grayScale = (pathIn, pathOut) => {
    const fileName = path.basename(pathIn);
    const destPath = path.join(pathOut, fileName)
    return new Promise ((resolve, reject) => {
    makeOutputFolder(pathOut)
    .then(() => { pipeline(createReadStream(pathIn),
      new PNG()
        .on("parsed", function () {
        applyFilterCalc(this.data, "grayscale")
        .then((data) => {this.data = data, 
          this.pack()})
        .catch((err) => reject(err))
      }), 
      createWriteStream(destPath)),
      resolve(),
      (err) => {
        reject(err)
      }})
    .catch((err) => reject(err))
  })
};

const sepia = (pathIn, pathOut) => {
  const fileName = path.basename(pathIn);
  const destPath = path.join(pathOut, fileName)
  return new Promise ((resolve, reject) => {
  makeOutputFolder(pathOut)
  .then(() => { pipeline(createReadStream(pathIn),
    new PNG()
      .on("parsed", function () {
      applyFilterCalc(this.data, "sepia")
      .then((data) => {this.data = data, 
        this.pack()})
      .catch((err) => reject(err))
    }), 
    createWriteStream(destPath)),
    resolve(),
    (err) => {
      reject(err)
    }})
  .catch((err) => reject(err))
})
};

const filterPNGs = (arrOfFiles) => {
  const newArr = [];
  for (let index = 0; index < arrOfFiles.length; index++) {
    let currentFileName = arrOfFiles[index]["name"];
    let currentFilePath = path.join(arrOfFiles[index]["path"],currentFileName);
    if (path.extname(currentFilePath) === (".png")){ 
      newArr.push(arrOfFiles[index]);  
    }
  }
  return newArr;
}

const toPathsArr = (arrOfPNGs) => {
  const pathArr = [];
  for (let index = 0; index < arrOfPNGs.length; index++) {
    pathArr.push(path.join(arrOfPNGs[index]["path"], arrOfPNGs[index]["name"]))
  }
  return pathArr;
}

const applyFilterCalc = (pixels, filter) => { //takes arr of img pixels, filter is a string: "grayscale" or "sepia"
  return new Promise ((resolve, reject) => {
  const worker = new Worker("./worker-thread.js", {workerData: {pixels, filter}})
  worker.on("message", (newP) => resolve(newP))
  worker.on("error", (err) => reject(err))
})
}

const makeOutputFolder = (path) => {
  return fs.mkdir(path, {recursive: true})
  .catch((err) => console.log(err))
}

module.exports = {
  unzip,
  readDir,
  grayScale,
  sepia
};

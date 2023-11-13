const path = require("path");
/*
 * Project: Milestone 1
 * File Name: main.js
 * Description: Unzips and applies filters to png images using functions from the IOhandler.js
 *
 * Created Date: 02/11/23
 * Author: Angus Ng
 *
 */

const IOhandler = require("./IOhandler");
const zipFilePath = path.join(__dirname, "myfile.zip");
const pathUnzipped = path.join(__dirname, "unzipped");
const pathProcessed = path.join(__dirname, "grayscaled");
const pathProcessed2 = path.join(__dirname, "sepia");

IOhandler.unzip(zipFilePath, pathUnzipped)
.then(() => IOhandler.readDir(pathUnzipped))
.then((pathArr) => Promise.all([IOhandler.grayScale(pathArr[0], pathProcessed), 
                                IOhandler.grayScale(pathArr[1], pathProcessed), 
                                IOhandler.grayScale(pathArr[2], pathProcessed),
                                IOhandler.sepia(pathArr[0], pathProcessed2), 
                                IOhandler.sepia(pathArr[1], pathProcessed2), 
                                IOhandler.sepia(pathArr[2], pathProcessed2)]).then(() => console.log("All images had sepia and grayscale applied")))
.catch((err) => console.log(err))
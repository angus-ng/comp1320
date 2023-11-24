const dbPath = "../database/data.json"
const path = require("path");
const fs = require("fs").promises;
const qs = require("querystring");
const { parse } = require("url");

async function readDatabase () {
    const database = await fs.readFile(dbPath, "utf-8");
    return JSON.parse(database);
}

async function uploadImage (currentUser, imageName) {
    const newDatabase = await readDatabase();
    const currentUserIndex = findUserIndex(currentUser, newDatabase);

    newDatabase[currentUserIndex].photos.push(imageName);
    newDatabase[currentUserIndex].stats.posts += 1;
    
    await fs.writeFile(dbPath, JSON.stringify(newDatabase, null, 2));
}

const parseQS = (url) => {
    return qs.parse(url.split("?")[1]);
} 

const findUserIndex = (currentUser, dbArray) => {
    return dbArray.findIndex((userObj) => (userObj.username === currentUser));
}

const imgSrc = (username, imageName, mode=1) => {
    if (mode) {
        const imgPath = path.join("photos", username, imageName);
        return new URL(`file:///${imgPath}`).href.substring(7); //html file paths for loading images
    } else {
        return path.join(__dirname, "..", "src", "photos", username, imageName); //upload path for images
    }
}

const getExt = (url) => {
    return path.extname(url).toLowerCase();
}

const routeHelper = (url, method) => {
    if (url.includes("/images?") && method === "POST") { 
        return "/images";
      } else {
        const urlExt = getExt(url);
        if ((urlExt === ".png" || urlExt === ".jpeg") && method === "GET") {
          return "/photos";
        }
        const { pathname } = parse(url, true);
        return pathname;
      }
}
module.exports = {readDatabase, uploadImage, parseQS, imgSrc, findUserIndex, getExt, routeHelper};
const dbPath = "../database/data.json"
const fs = require("fs").promises;

async function readDatabase () {
    const database = await fs.readFile(dbPath, "utf-8");
    return JSON.parse(database);
}

async function uploadImage (currentUser, imageName) {
    const newDatabase = await readDatabase();
    let currentUserIndex = newDatabase.findIndex((element) => (element.username === currentUser));

    newDatabase[currentUserIndex].photos.push(imageName);
    newDatabase[currentUserIndex].stats.posts += 1;
    
    await fs.writeFile(dbPath, JSON.stringify(newDatabase, null, 2))
}

const MIME = { jpeg : {'Content-Type': 'image/jpeg'},
                png : {'Content-Type': 'image/png'},
                txt : {'Content-Type': 'text/plain'}};


module.exports = {readDatabase, uploadImage, MIME};
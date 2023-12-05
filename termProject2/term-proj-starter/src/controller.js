const { DEFAULT_HEADER } = require("./util/util");
const qs = require("querystring");
const { createReadStream } = require("fs");
const { formidable } = require("formidable");
const helper = require("../scripts/helper.js");
const { MIME } = require("../scripts/MIME.js");
const ejs = require("ejs");

const controller = {
  getHomePage: async (request, response) => {
    try {
    const userArray = await helper.readDatabase();
    const data = {userArr : userArray,
                fn : helper.imgSrc};
      await ejs.renderFile((__dirname + "/views/home.ejs") , {filename: "home.ejs", data}, (err, result) =>{
      response.writeHead(200, {'Content-Type': 'text/html'})
      return response.end(result)
      });
    } catch (err) {
    console.error(err); 
    response.writeHead(err.httpCode || 404, {'Content-Type': MIME.txt})
    return response.end(String(err))
    }
  },
  sendFormData: (request, response) => {
    var body = "";

    request.on("data", function (data) {
      body += data;
    });

    request.on("end", function () {
      var post = qs.parse(body);
      console.log(post);
    });
  },

  getFeed: async (request, response) => {
    try {
    let currentUser = helper.parseQS(request.url).username;
    const userArray = await helper.readDatabase();
    currentUser = userArray[helper.findUserIndex(currentUser, userArray)];
    const data = {user : currentUser,
                fn : helper.imgSrc};
    await ejs.renderFile((__dirname + "/views/feed.ejs") , {filename: "feed.ejs", data}, (err, result) =>{
      response.writeHead(200, {'Content-Type': 'text/html'})
      return response.end(result);
      });
    } catch (err) {
        console.error(err);
        response.writeHead(err.httpCode || 404, {'Content-Type': MIME.txt})
        return response.end(String(err))
    }
  },

  uploadImages: async (request, response) => {
    const currentUser = helper.parseQS(request.url).username;
    let fileName = "";
    const form = formidable({});
    let fields;
    let files;
    try {
        form.on("fileBegin", (name, file) => {
            file.filepath = helper.imgSrc(currentUser, file.originalFilename, 0);
            fileName = file.originalFilename;
        })
        form.on("end", (name, file) => {
            helper.uploadImage(currentUser, fileName);
            response.writeHead(303, { 'Location': '/' });
            return response.end();
        })
        [fields, files] = await form.parse(request);
    } catch (err) {
        console.error(err);
        response.writeHead(err.httpCode || 400, { 'Content-Type': MIME.txt });
        return response.end(String(err));
    }
  },

  getPhoto: async (request, response) => {
    const imgExt = helper.getExt(request.url);
    const headerType = {};
    if(imgExt === ".jpeg"){
        headerType["Content-Type"] = MIME.jpeg;
    } else if (imgExt === ".png"){
        headerType["Content-Type"] = MIME.png;
    }
    response.writeHead(200, headerType)
    const readImage = await createReadStream(__dirname + request.url).pipe(response);
    readImage.on("error", (err) => console.log(err));
    readImage.on("end", () => response.end());
    return;
  }
};

module.exports = controller;
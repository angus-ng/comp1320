const { DEFAULT_HEADER } = require("./util/util");
const qs = require("querystring");
const { createReadStream } = require("fs");
const { formidable } = require("formidable");
const helper = require("../scripts/helper.js");
const { MIME } = require("../scripts/MIME.js");
const path = require("path");

const controller = {
  getHomePage: async (request, response) => {
    const userArray = await helper.readDatabase();
    //console.log(userArray);
    let userCards = "";
    userArray.forEach((userObj) => {
    const pfpSrc = helper.imgSrc(userObj.username, userObj.profile);
    userCards = userCards + `<div class="user-card">
                    <div class="profile-picture-container">
                        <img src="${pfpSrc}">
                    </div>
                    <div class="button-container">
                        <div class="uploadButton">
                            <form id="upload${userObj.username}" action="/images?username=${userObj.username}" enctype="multipart/form-data" method="POST">
                                <input type="file" id="hiddenButton${userObj.username}" name="uploadedImage" accept="image/png" onChange="document.getElementById('upload${userObj.username}').submit();" style="display:none;"/>
                                <button type="button" onclick="document.getElementById('hiddenButton${userObj.username}').click();">Upload</button>

                            </form>
                        </div>
                        <div class="profileButton">
                            <form action="/feed" method="GET">
                                <button type="submit" name="username" value="${userObj.username}">${userObj.username}</button>
                            </form>
                        </div>
                    </div>
                </div>`})
    //console.log(userArray);
    return response.end(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Home</title>
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Montserrat&display=swap" rel="stylesheet">
        <style>
            :root{
                --main-text-color:#fffaff;
                --main-bg-color:#0B132B;
                --main-primary-color:#82D9D0;
                --main-secondary-color:#314172;
                --main-accent-color:#C382F2;
            }
            body{
                background-color:var(--main-bg-color);
                color:var(--main-text-color);
                font-family: 'Montserrat', Arial, Helvetica, sans-serif;
            }
    
            .userbase-container{
                display:flex;
                flex-wrap:wrap;
                align-content:space-around;
                gap: 1rem 1rem;
            }
            .user-card{
                display:grid;
                min-width:21rem;
                min-height:11rem;
                background: linear-gradient(-20deg, var(--main-accent-color), var(--main-primary-color));
                border-radius: 8px;
                grid-template-columns:repeat(2, 50%);
            }
            .button-container{
                background-color: #31417280;
                display:grid;
                grid-template-columns:100%;
                min-width:100%;
                min-height:100%;
                grid-column-start:2;
                grid-column-end:3;
                align-content:center;
                align-items:center;
                justify-items:center;
                row-gap:15%;
            }
            .profile-picture-container{
                min-width:100%;
                min-height:100%;
                display:grid;
                grid-column-start:1;
                grid-column-end:2;
                align-items:center;
                justify-items:center;
            }
            .profile-picture-container img{
                width:152px;
                height:152px;
                border-radius: 50%;
                align-self:center;
            }
            .uploadButton button{
                text-align:center;
                color:var(--main-bg-color);
                background-color:var(--main-primary-color);
                border: none;
                box-shadow: 2px -2px 6px rgba(196, 237, 233, 0.5), -2px 2px 6px rgba(79, 201, 189, 0.5);
                width:6rem;
                height:2rem;
                border-radius:4px;
            }
            .uploadButton button:hover{
                background-color:#5cccc1;
                border:none;
            }
            .profileButton button{
                text-align:center;
                color:var(--main-bg-color);
                background-color:var(--main-accent-color);
                border: none;
                box-shadow: 2px -2px 6px rgba(222, 186, 247, 0.5), -2px 2px 6px #9b2fe980;
                width:6rem;
                height:2rem;
                border-radius:4px;
            }
            .profileButton button:hover{
                color:var(--main-bg-color);
                background: rgb(173, 84, 237);
                border:none;
            }
        </style>
    </head>
    <body>
        <head>
            <h1>Users</h1>
        </head>
        <main>
            <section class="userbase-container">
                ${userCards}
            </section>
        </main>
        <footer>
        </footer>
    </body>
    </html>`);
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
    // console.log(request.url); try: http://localhost:3000/feed?username=john123
    //console.log("IM HERE" + request.url);
    let currentUser = helper.parseQS(request.url).username;
    console.log(currentUser);

    const userArray = await helper.readDatabase();
    currentUser = userArray[helper.findUserIndex(currentUser, userArray)];

    console.log(currentUser);
    const pfpSrc = helper.imgSrc(currentUser.username, currentUser.profile);
   
    let imgGallery = "";
    currentUser.photos.forEach((photo) => {
        const userImageSrc = helper.imgSrc(currentUser.username, photo);
        imgGallery = imgGallery + `<div class="gallery-item" tabindex="0">
        <img src="${userImageSrc}" class="gallery-image" alt="">
        <div class="gallery-item-info">
            <ul>
                <li class="gallery-item-likes"><span class="visually-hidden">Likes:</span><i class="fas fa-heart" aria-hidden="true"></i> ${Math.floor(Math.random()*101)}</li>
                <li class="gallery-item-comments"><span class="visually-hidden">Comments:</span><i class="fas fa-comment" aria-hidden="true"></i> ${Math.floor(Math.random()*101)}</li>
            </ul>

        </div>

    </div>
        `
    })
    response.write(`
    <html>
    <head>
    <meta name="viewport" content="width=device-width, initial-scale=1"><link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Open+Sans:300,400,600"><link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.2.0/css/all.css">
    <style>

    /* Base Styles */

    :root {
        font-size: 10px;
    }

    *,
    *::before,
    *::after {
        box-sizing: border-box;
    }

    body {
        font-family: "Open Sans", Arial, sans-serif;
        min-height: 100vh;
        background-color: #fafafa;
        color: #262626;
        padding-bottom: 3rem;
    }

    img {
        display: block;
    }

    .container {
        max-width: 93.5rem;
        margin: 0 auto;
        padding: 0 2rem;
    }

    .btn {
        display: inline-block;
        font: inherit;
        background: none;
        border: none;
        color: inherit;
        padding: 0;
        cursor: pointer;
    }

    .btn:focus {
        outline: 0.5rem auto #4d90fe;
    }

    .visually-hidden {
        position: absolute !important;
        height: 1px;
        width: 1px;
        overflow: hidden;
        clip: rect(1px, 1px, 1px, 1px);
    }

    /* Profile Section */

    .profile {
        padding: 5rem 0;
    }

    .profile::after {
        content: "";
        display: block;
        clear: both;
    }

    .profile-image {
        float: left;
        width: calc(33.333% - 1rem);
        display: flex;
        justify-content: center;
        align-items: center;
        margin-right: 3rem;
    }

    .profile-image img {
        border-radius: 50%;
    }

    .profile-user-settings,
    .profile-stats,
    .profile-bio {
        float: left;
        width: calc(66.666% - 2rem);
    }

    .profile-user-settings {
        margin-top: 1.1rem;
    }

    .profile-user-name {
        display: inline-block;
        font-size: 3.2rem;
        font-weight: 300;
    }

    .profile-edit-btn {
        font-size: 1.4rem;
        line-height: 1.8;
        border: 0.1rem solid #dbdbdb;
        border-radius: 0.3rem;
        padding: 0 2.4rem;
        margin-left: 2rem;
    }

    .profile-settings-btn {
        font-size: 2rem;
        margin-left: 1rem;
    }

    .profile-stats {
        margin-top: 2.3rem;
    }

    .profile-stats li {
        display: inline-block;
        font-size: 1.6rem;
        line-height: 1.5;
        margin-right: 4rem;
        cursor: pointer;
    }

    .profile-stats li:last-of-type {
        margin-right: 0;
    }

    .profile-bio {
        font-size: 1.6rem;
        font-weight: 400;
        line-height: 1.5;
        margin-top: 2.3rem;
    }

    .profile-real-name,
    .profile-stat-count,
    .profile-edit-btn {
        font-weight: 600;
    }

    /* Gallery Section */

    .gallery {
        display: flex;
        flex-wrap: wrap;
        margin: -1rem -1rem;
        padding-bottom: 3rem;
    }

    .gallery-item {
        position: relative;
        flex: 1 0 22rem;
        margin: 1rem;
        color: #fff;
        cursor: pointer;
    }

    .gallery-item:hover .gallery-item-info,
    .gallery-item:focus .gallery-item-info {
        display: flex;
        justify-content: center;
        align-items: center;
        position: absolute;
        top: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.3);
    }

    .gallery-item-info {
        display: none;
    }

    .gallery-item-info li {
        display: inline-block;
        font-size: 1.7rem;
        font-weight: 600;
    }

    .gallery-item-likes {
        margin-right: 2.2rem;
    }

    .gallery-item-type {
        position: absolute;
        top: 1rem;
        right: 1rem;
        font-size: 2.5rem;
        text-shadow: 0.2rem 0.2rem 0.2rem rgba(0, 0, 0, 0.1);
    }

    .fa-clone,
    .fa-comment {
        transform: rotateY(180deg);
    }

    .gallery-image {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    /* Loader */

    .loader {
        width: 5rem;
        height: 5rem;
        border: 0.6rem solid #999;
        border-bottom-color: transparent;
        border-radius: 50%;
        margin: 0 auto;
        animation: loader 500ms linear infinite;
    }

    /* Media Query */

    @media screen and (max-width: 40rem) {
        .profile {
            display: flex;
            flex-wrap: wrap;
            padding: 4rem 0;
        }

        .profile::after {
            display: none;
        }

        .profile-image,
        .profile-user-settings,
        .profile-bio,
        .profile-stats {
            float: none;
            width: auto;
        }

        .profile-image img {
            width: 7.7rem;
        }

        .profile-user-settings {
            flex-basis: calc(100% - 10.7rem);
            display: flex;
            flex-wrap: wrap;
            margin-top: 1rem;
        }

        .profile-user-name {
            font-size: 2.2rem;
        }

        .profile-edit-btn {
            order: 1;
            padding: 0;
            text-align: center;
            margin-top: 1rem;
        }

        .profile-edit-btn {
            margin-left: 0;
        }

        .profile-bio {
            font-size: 1.4rem;
            margin-top: 1.5rem;
        }

        .profile-edit-btn,
        .profile-bio,
        .profile-stats {
            flex-basis: 100%;
        }

        .profile-stats {
            order: 1;
            margin-top: 1.5rem;
        }

        .profile-stats ul {
            display: flex;
            text-align: center;
            padding: 1.2rem 0;
            border-top: 0.1rem solid #dadada;
            border-bottom: 0.1rem solid #dadada;
        }

        .profile-stats li {
            font-size: 1.4rem;
            flex: 1;
            margin: 0;
        }

        .profile-stat-count {
            display: block;
        }
    }

    /* Spinner Animation */

    @keyframes loader {
        to {
            transform: rotate(360deg);
        }
    }

    @supports (display: grid) {
        .profile {
            display: grid;
            grid-template-columns: 1fr 2fr;
            grid-template-rows: repeat(3, auto);
            grid-column-gap: 3rem;
            align-items: center;
        }

        .profile-image {
            grid-row: 1 / -1;
        }
        .profile-image img{
            width:152px;
            height:152px;
        }

        .gallery {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(22rem, 1fr));
            grid-gap: 2rem;
        }

        .profile-image,
        .profile-user-settings,
        .profile-stats,
        .profile-bio,
        .gallery-item,
        .gallery {
            width: auto;
            margin: 0;
        }

        @media (max-width: 40rem) {
            .profile {
                grid-template-columns: auto 1fr;
                grid-row-gap: 1.5rem;
            }

            .profile-image {
                grid-row: 1 / 2;
            }

            .profile-user-settings {
                display: grid;
                grid-template-columns: auto 1fr;
                grid-gap: 1rem;
            }

            .profile-edit-btn,
            .profile-stats,
            .profile-bio {
                grid-column: 1 / -1;
            }

            .profile-user-settings,
            .profile-edit-btn,
            .profile-settings-btn,
            .profile-bio,
            .profile-stats {
                margin: 0;
            }
        }
    }
    </style>

    </head>
    <body>
    <header>

	<div class="container">

		<div class="profile">

			<div class="profile-image">

				<img src="${pfpSrc}" alt="">

			</div>

			<div class="profile-user-settings">

				<h1 class="profile-user-name">${currentUser.username}</h1>

				<button class="btn profile-edit-btn">Edit Profile</button>

				<button class="btn profile-settings-btn" aria-label="profile settings"><i class="fas fa-cog" aria-hidden="true"></i></button>

			</div>

			<div class="profile-stats">

				<ul>
					<li><span class="profile-stat-count">${currentUser.stats.posts}</span> posts</li>
					<li><span class="profile-stat-count">${currentUser.stats.followers}</span> followers</li>
					<li><span class="profile-stat-count">${currentUser.stats.following}</span> following</li>
				</ul>

			</div>

			<div class="profile-bio">

				<p><span class="profile-real-name">${currentUser.username}</span> ${currentUser.description}</p>

			</div>

		</div>
		<!-- End of profile section -->

	</div>
	<!-- End of container -->

</header>

<main>

	<div class="container">

		<div class="gallery">
        ${imgGallery}
		</div>
		<!-- End of gallery -->

		<div class="loader"></div>

	</div>
	<!-- End of container -->

</main>
</body>
</html>
    `);
    response.end();
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
        })
        [fields, files] = await form.parse(request);
    } catch (err) {
        console.error(err);
        response.writeHead(err.httpCode || 400, { 'Content-Type': MIME.txt });
        return response.end(String(err));
    }
    response.writeHead(303, { 'Location': '/' });
    return response.end();
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
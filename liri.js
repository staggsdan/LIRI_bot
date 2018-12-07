require("dotenv").config();

var spotify = require('node-spotify-api');
var axios = require("axios");
var moment = require("moment")

var keys = require("./keys");

var userTerm = process.argv[2];

switch (userTerm) {
    case "concert-this":
        console.log("concert")
        break;
    case "spotify-this-song":
        console.log("spotify")
        break;
    case "movie-this":
        console.log("movie")
        break;
    case "do-what-it-says":
        console.log("whatever")
        break;
    default:
        console.log("please enter a command")
        break;
}


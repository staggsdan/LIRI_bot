require("dotenv").config();

var spotify = require('node-spotify-api');
var axios = require("axios");
var moment = require("moment")

var keys = require("./keys");
// vars to hold the API keys (is this redundant with the vars on lines 3 - 5?)
var bandsKey = process.env.BANDS_API_KEY;
var songKey = process.env.SPOTIFY_SECRET;
var movieKey = process.env.OMDB_API_KEY;


var userCommand = process.argv[2];

// class demonstration of 'switch'
switch (userCommand) {
    case "concert-this":
        console.log("concert");
        concertSearch();
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

// bandsintown search functionality
// dev note - be sure to change artistName to an argv input later
var artistName = "radiohead";

function concertSearch() {
    var queryURL = "https://rest.bandsintown.com/artists/" + artistName + "/events?app_id=" + bandsKey;
    axios.get(queryURL)
    .then(function (response) {
        var humanTime = 
        console.log("See them on " + response.data[0].datetime);
        console.log(" at "+ response.data[0].venue.name + " in " + response.data[0].venue.city +", "+ response.data[0].venue.region);
    })
    
}

// spotify search functionality
// function spotifySearch(){
    
// }



// movie search functionality
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
var userTermEntered = process.argv[3];

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
        console.log("movie");
        movieSearch();
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


function concertSearch() {
    var userTerm = userTermEntered.replace(/\s/g, "+");
    var queryURL = "https://rest.bandsintown.com/artists/" + userTerm + "/events?app_id=" + bandsKey;
    console.log(userTerm);
    
    axios.get(queryURL)
    .then(function (response) {
        var humanTime = moment(response.data[0].datetime).format('LL');
        
        console.log("See them on " + humanTime + " at "+ response.data[0].venue.name + " in " + response.data[0].venue.city +", "+ response.data[0].venue.region);

        console.log("See them on " + humanTime + " at "+ response.data[1].venue.name + " in " + response.data[1].venue.city +", "+ response.data[1].venue.region);

        for (let i = 1; i < 4; i++) {
            console.log("Or see them on " + humanTime + " at "+ response.data[i].venue.name + " in " + response.data[i].venue.city +", "+ response.data[i].venue.region);
        }
    })
    
};

// spotify search functionality
// function spotifySearch(){
    
// }



// movie search functionality
function movieSearch(){
    var userTerm = "goodfellas";
    queryURL = "http://www.omdbapi.com/?t=" + userTerm + "&y=&plot=short&apikey=" + movieKey;
    console.log(queryURL)

    axios.get(queryURL)
    .then(function (response) {
        console.log(response.data.Title);
        
    })
}

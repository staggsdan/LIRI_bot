require("dotenv").config();

var Spotify = require('node-spotify-api');
var axios = require("axios");
var moment = require("moment");
var inquirer = require("inquirer");

var keys = require("./keys");
// vars to hold the API keys (is this redundant with the vars on lines 3 - 5?)
var bandsKey = process.env.BANDS_API_KEY;
var movieKey = process.env.OMDB_API_KEY;
var spotify = new Spotify({
    id: process.env.SPOTIFY_ID,
    secret: process.env.SPOTIFY_SECRET
  });


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
        songSearch();
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

// spotify search functionality via npmjs.com
function songSearch(){
    var userTerm = "";
    
    spotify.search({ type: 'track', query: 'All the Small Things', limit: 5 }, function(err, data) {
        if (err) {
          return console.log('Error occurred: ' + err);
        }
       
      console.log(data); 
      });
}

// movie search functionality
// before submission: make userterm variable, add more return fields. add default return for no entry.
function movieSearch(){
    var userTerm = "goodfellas";
    queryURL = "http://www.omdbapi.com/?t=" + userTerm + "&y=&plot=short&apikey=" + movieKey;
    console.log(queryURL)

    axios.get(queryURL)
    .then(function (response) {
        console.log(response.data.Title);
        
    })
}

// ask a TA how to make search response reactive to object position instead of direct quotes. tried a few approaches, couldn't get it.
function primaryFunction() {
    inquirer.prompt([
        {
            type: "list",
            message: "What do you want to search for?",
            choices: ["Check for a concert", "Look up a song", "Look up a movie", "Random function: pending."],
            name: "searchlist",
        }
    ]).then(function(response){
        if (response.searchlist === "Check for a concert") {
            console.log("concert search works");
        } else if (response.searchlist === "Look up a song") {
            console.log("spotify search works");
        } else if (response.searchlist === "Look up a movie"){
            console.log("movie search works")
        } else if (response.searchlist === "Random function: pending."){
            console.log("this function is pending");
            
        }
    })
}
primaryFunction();
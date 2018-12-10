require("dotenv").config();

var Spotify = require('node-spotify-api');
var axios = require("axios");
var moment = require("moment");
var inquirer = require("inquirer");

var keys = require("./keys");
// vars to hold the API keys (do I have redundant BIT and OMDB key passing? couldn't get it to work without these.)
var bandsKey = keys.bands;
var movieKey = process.env.OMDB_API_KEY
var spotify = new Spotify(keys.spotify);


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
    // var userTerm = userTermEntered.replace(/\s/g, "+");
    var userTerm = "";
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
function movieSearch(){
    
    inquirer.prompt([
        {
        name: "moviesearch",
        message: "What movie do you want to look up?"
        }
    ]) .then (function(response){
        var userTerm = response.moviesearch;
        if (userTerm === "") {
            var queryURL = "http://www.omdbapi.com/?t=Mr.%20Nobody&apikey=" + movieKey;

            axios.get(queryURL)
            .then (function(response){
                console.log("I have it on good authority you should check out this flick");
                console.log(`Title: ${response.data.Title}, Released: ${response.data.Year}, IMDB Rating: ${response.data.Ratings[0].Value}, Rotten Tomatoes Rating: ${response.data.Ratings[1].Value}, Produced in: ${response.data.Country}, Release language: ${response.data.Language}, Basic plot: ${response.data.Plot}, Starring: ${response.data.Actors}`);
                newSearch()
            })
        } else {
            var queryURL = "http://www.omdbapi.com/?t=" + userTerm + "&apikey=" + movieKey;

            axios.get(queryURL)
            .then (function(response) {
                console.log(`Title: ${response.data.Title}, Released: ${response.data.Year}, IMDB Rating: ${response.data.Ratings[0].Value}, Rotten Tomatoes Rating: ${response.data.Ratings[1].Value}, Produced in: ${response.data.Country}, Release language: ${response.data.Language}, Basic plot: ${response.data.Plot}, Starring: ${response.data.Actors}`);
                newSearch();
            })
            
        }
    })
}

// ask a TA how to make search response reactive to object position instead of direct quotes. tried a few approaches, couldn't get it.
function primaryFunction() {
    inquirer.prompt([
        {
            type: "list",
            message: "What do you want to search for?",
            choices: ["Check for a concert", "Look up a song", "Look up a movie", "Random function: pending.", "Exit program"],
            name: "searchlist",
        }
    ]).then(function(response){
        if (response.searchlist === "Check for a concert") {
            console.log("concert search works");
            concertSearch();
        } else if (response.searchlist === "Look up a song") {
            console.log("spotify search works");
            songSearch();
        } else if (response.searchlist === "Look up a movie"){
            console.log("movie search works");
            movieSearch();
        } else if (response.searchlist === "Random function: pending."){
            console.log("this function is pending");
        } else if (response.searchlist === "Exit program") {
            console.log("Come back any time.");
            
        }
    })
}

function newSearch(){
    inquirer.prompt([
        {
            type: "confirm",
            message: "Run another search?",
            name: "newSearch"
        }
    ]).then (function (result){
        if (result.newSearch === true) {
            primaryFunction();
        } else {
            console.log("Come back any time");
            
        }
    })
}
primaryFunction();
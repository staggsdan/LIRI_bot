require("dotenv").config();

var Spotify = require('node-spotify-api');
var axios = require("axios");
var moment = require("moment");
var inquirer = require("inquirer");
var fs = require("fs");

var keys = require("./keys");
// vars to hold the API keys (do I have redundant BIT and OMDB key passing? couldn't get it to work without these.)
var bandsKey = process.env.BANDS_API_KEY;
var movieKey = process.env.OMDB_API_KEY;
var spotify = new Spotify(keys.spotify);

// bandsintown search functionality
// dev note - how do I write a console.log to tell the user there are no results?
function concertSearch() {
    inquirer.prompt([
        {
            name: "concertsearch",
            message: "What performer's concerts do you want to look up?"
        }
    ]).then (function (response){
        var userTerm = response.concertsearch;
        var queryURL = "https://rest.bandsintown.com/artists/" + userTerm + "/events?app_id=" + bandsKey;

        if (userTerm === "") {
            console.log("Try searching a musical performer next time.");
            newSearch();
        }

        else {axios.get(queryURL)
        .then(function (response){
            
            for (let i = 0; i < response.data.length; i++) {
                var humanTime = moment(response.data[i].datetime).format('L')
                console.log(`See this artist at ${response.data[i].venue.name} in ${response.data[i].venue.city}, ${response.data[i].venue.region}, on ` + humanTime);
            }
            newSearch();
        })}
    }
    )
}

// spotify search functionality via npmjs.com

function songSearch(){
    inquirer.prompt([
        {
            name: "search",
            message: "What song do you want to look up?"
        }
    ]).then(function (response) {
        var userTerm = response.search;

        if (userTerm === "") {
            spotify.search({ type: 'track', query: "The+Sign+Ace+of+Base", limit: 1 })
            .then(function (response) {
                console.log("You may enjoy this one.");
                console.log(`Artist: ${response.tracks.items[0].artists[0].name}`);
                console.log(`Song name: ${response.tracks.items[0].name}`);
                console.log(`Preview link: ${response.tracks.items[0].preview_url}`);
                console.log(`Album name: ${response.tracks.items[0].album.name}`);    
                
            })
            newSearch();
            // console.log("Try searching a song next time.");
            // newSearch();
        }

        else {spotify.search({ type: 'track', query: userTerm, limit: 8 })
            .then(function (response) {
                console.log(`Artist: ${response.tracks.items[0].artists[0].name}`);
                console.log(`Song name: ${response.tracks.items[0].name}`);
                console.log(`Preview link: ${response.tracks.items[0].preview_url}`);
                console.log(`Album name: ${response.tracks.items[0].album.name}`);    
                newSearch();
            })}
    })
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
                console.log(`Title: ${response.data.Title}`); 
                console.log(`Released: ${response.data.Year}`);
                console.log(`IMDB Rating: ${response.data.Ratings[0].Value}`);
                console.log(`Rotten Tomatoes Rating: ${response.data.Ratings[1].Value}`);
                console.log(`Produced in: ${response.data.Country}`);
                console.log(`Release language: ${response.data.Language}`);
                console.log(`Basic plot: ${response.data.Plot}`);
                console.log(`Starring: ${response.data.Actors}`);
                newSearch();
            })
        } else {
            var queryURL = "http://www.omdbapi.com/?t=" + userTerm + "&apikey=" + movieKey;

            axios.get(queryURL)
            .then (function(response) {
                console.log(`Title: ${response.data.Title}`); 
                console.log(`Released: ${response.data.Year}`);
                console.log(`IMDB Rating: ${response.data.Ratings[0].Value}`);
                console.log(`Rotten Tomatoes Rating: ${response.data.Ratings[1].Value}`);
                console.log(`Produced in: ${response.data.Country}`);
                console.log(`Release language: ${response.data.Language}`);
                console.log(`Basic plot: ${response.data.Plot}`);
                console.log(`Starring: ${response.data.Actors}`);
                newSearch();
            })
            
        }
    })
}

// This works and I feel like it shouldn't?
function fileSystem(){
    fs.readFile("random.txt", "utf8", function (error, data) {
        if (error) {
            return console.log(error);
        }
        var fileSystemSong = data
        spotify.search({ type: 'track', query: fileSystemSong, limit: 5 })
            .then(function (response) {
                console.log(`Artist: ${response.tracks.items[0].artists[0].name}`);
                console.log(`Song name: ${response.tracks.items[0].name}`); 
                console.log(`Preview: ${response.tracks.items[0].preview_url}`); 
                console.log(`Album name: ${response.tracks.items[0].album.name}`);
                newSearch();
            })
        })
    }
                    
// ask a TA how to make search response reactive to object position instead of direct quotes. tried a few approaches, couldn't get it.
function primaryFunction() {
    inquirer.prompt([
        {
            type: "list",
            message: "What do you want to search for?",
            choices: ["Check for a concert", "Look up a song", "Look up a movie", "Do What It Says (tm)", "Exit program"],
            name: "searchlist",
        }
    ]).then(function(response){
        if (response.searchlist === "Check for a concert") {
            concertSearch();
        } else if (response.searchlist === "Look up a song") {
            songSearch();
        } else if (response.searchlist === "Look up a movie"){
            movieSearch();
        } else if (response.searchlist === "Do What It Says (tm)"){
            fileSystem();            
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
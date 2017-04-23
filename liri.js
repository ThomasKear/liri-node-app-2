// I built different console.log catergories to focus the information being relayed
var spotDebug = false;
var twittDebug = false;
var movieDebug = false;
// vars for twitter API
var Twitter = require('twitter');
var twittKeys = require("./keys.js");
var client = new Twitter(twittKeys.twitterKeys);
var params = { q: 'kearnage1975', count: 20 };
// var for spotify API
var spotify = require('spotify');
// var for function request for the OMDB API
var request = require('request');
// vars for reading users 
var liriCommand = process.argv[2];
var nodeArg = process.argv;
var searchTitle = "";
// loppoing through to ensure we capture the entire entry field
for (var i = 3; i < nodeArg.length; i++) {
    if (i > 3 && i < nodeArg.length) {
        searchTitle = searchTitle + "+" + nodeArg[i];
    } else {
        searchTitle += nodeArg[i];
    }
}

console.log("searchTitle: " +  searchTitle);

// this dicates what function goes to what command the user entered
switch (liriCommand) {
    case "my-tweets":
        myTweets();
        break;

    case "spotifiy-this-song":
        myPlayList();
        break;

    case "movie-this":
        myMovie();
        break;

    case "do-what-it-says":
        randomPick();
        break;
}

// This is the my-tweets responce function
function myTweets() {
    client.get('search/tweets', params, gotData);

    function gotData(error, data, response) {
        var tweets = data.statuses;
        for (var i = 0; i < tweets.length; i++) {
            if (error) {
                twittPrint(error);
            } else {
                console.log(tweets[i].created_at);
                console.log(tweets[i].text);
            }
        }
    }
}


function myPlayList() {
    if (!searchTitle) {
        searchTitle = 'The Sign by Ace of Base';
    }

    spotify.search({ type: 'track', query: searchTitle }, function(err, data) {
        if (err) {
            spotPrint('Error occurred: ' + err);
            return;
        }
        // spotPrint(data);
        // Handle Data
        var albumTrack = data.tracks.items;
        // spotPrint('albumTrack: ' + albumTrack)
        for (i = 0; i < albumTrack.length; i++) {
            console.log("Artist: " + albumTrack[i].artists[i].name);
            console.log("Album Title: " + albumTrack[i].album.name);
            console.log("Spotify Link: " + albumTrack[i].preview_url);
            console.log("Track Title: " + albumTrack[i].name);

        }
    });

};


function myMovie() {

    if (!searchTitle) {
        searchTitle = 'Mr. Nobody';
    }

    var omdbUrl = "http://www.omdbapi.com/?t=" + searchTitle + "&y=&plot=short&r=json";

    moviePrint(omdbUrl);

    var rotTomaUrl = "https://www.rottentomatoes.com/m/" + searchTitle;

    request(omdbUrl, function(error, response, body) {

        // If the request is successful
        if (!error && response.statusCode === 200) {

            // Parse the body of the site and recover just the imdbRating
            // (Note: The syntax below for parsing isn't obvious. Just spend a few moments dissecting it).
            console.log("Movie Title: " + JSON.parse(body).Title);
            console.log("Release Year: " + JSON.parse(body).Year);
            console.log("IMDB Rating: " + JSON.parse(body).imdbRating);
            console.log("Country Movie Was Produced: " + JSON.parse(body).Country);
            console.log("Movie Language: " + JSON.parse(body).Language);
            console.log("Movie Plot: " + JSON.parse(body).Plot);
            console.log("Movie Actor: " + JSON.parse(body).Actors);
            console.log("Rotten Tomatoes URL: " + rotTomaUrl);
        }

    });
}


// debugPrint only prints when var globaDebug * is set to true. Useful for printing backend logic information when debugging. @param {string} the message you wish to print
function twittPrint(msg) {
    if (twittDebug == true) {
        console.log(msg)
    }
}

function spotPrint(msg) {
    if (spotDebug == true) {
        console.log(msg)
    }
}

function moviePrint(msg) {
    if (movieDebug == true) {
        console.log(msg)
    }
}

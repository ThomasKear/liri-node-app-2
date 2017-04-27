// I built different console.log catergories to focus the information being relayed
var spotDebug = 1;
var twittDebug = 1;
var movieDebug = 1;
var randomDebug = 1;
var generalDebug = 1;
var answersDebug = 0;

// vars for twitter API
var Twitter = require('twitter');
var twittKeys = require("./keys.js");
var client = new Twitter(twittKeys.twitterKeys);
var params = { q: 'kearnage1975', count: 20 };

// var for spotify API
var spotify = require('spotify');

// var for function request for the OMDB API
var request = require('request');

// vars for reading users command
var liriCommand = process.argv[2];

// var for reading the user's entire command line for later use
var nodeArg = process.argv;

// this var is to log the user's commands in log.txt
var logUserEntry = "";

// this var is required to read/write from other files
var fs = require("fs");

// This is the title 
var searchTitle = "";

// looping through to ensure we capture the users title search even if it is a multi-word search
for (var i = 3; i < nodeArg.length; i++) {
    if (i > 3 && i < nodeArg.length) {
        searchTitle = searchTitle + "+" + nodeArg[i];
    } else {
        searchTitle += nodeArg[i];
    }
}

// looping through to capture the user's commands to log 
for (var j = 2; j < nodeArg.length; j++) {
    if (j > 2 && j < nodeArg.length) {
        logUserEntry = logUserEntry + "+" + nodeArg[i];
    } else {
        logUserEntry += nodeArg[j];
    }
}

// this is to read the user's commands and log them to the log.txt page
fs.appendFile('log.txt', logUserEntry, function(err) {
    if (err) {
        generalPrint(err)
    } else {
        generalPrint(logUserEntry)
    }
});

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

// This is the my-tweets response function
function myTweets() {
    client.get('search/tweets', params, gotData);

    function gotData(error, data, response) {
        var tweets = data.statuses;
        for (var i = 0; i < tweets.length; i++) {
            if (error) {
                twittPrint(error);
            } else {
                answersPrint(tweets[i].created_at);
                answersPrint(tweets[i].text);
            }
        }
    }
}

// This is the spotify-this--song response function
function myPlayList() {
    // if the user chooses nothing, then Ace of Base is chosen
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
        for (var i = 0; i < albumTrack.length; i++) {
            answersPrint("Artist: " + albumTrack[i].artists[0].name);
            answersPrint("Album Title: " + albumTrack[i].album.name);
            answersPrint("Spotify Link: " + albumTrack[i].preview_url);
            answersPrint("Track Title: " + albumTrack[i].name);

        }
    });
}

// this is the movie-this response function
function myMovie() {

    // if a movie title isn't called upon, "Mr. Nobody" is called upon
    if (!searchTitle) {
        searchTitle = 'Mr. Nobody';
    }

    var omdbUrl = "http://www.omdbapi.com/?t=" + searchTitle + "&y=&plot=short&r=json$tomatoes=true";

    moviePrint(omdbUrl);

    var rotTomaUrl = "https://www.rottentomatoes.com/m/" + searchTitle;

    request(omdbUrl, function(error, response, body) {

        // If the request is successful
        if (!error && response.statusCode === 200) {

            // Parse the body of the site and recover just the imdbRating
            answersPrint("Movie Title: " + JSON.parse(body).Title);
            answersPrint("Release Year: " + JSON.parse(body).Year);
            answersPrint("IMDB Rating: " + JSON.parse(body).imdbRating);
            answersPrint("Country Movie Was Produced: " + JSON.parse(body).Country);
            answersPrint("Movie Language: " + JSON.parse(body).Language);
            answersPrint("Movie Plot: " + JSON.parse(body).Plot);
            answersPrint("Movie Actor: " + JSON.parse(body).Actors);
            answersPrint("Rotten Tomatoes URL: " + rotTomaUrl);
        }

    });
}

// this this is the do-what-it-says response function
function randomPick() {

    fs.readFile("random.txt", "utf8", function(error, data) {
        randomPrint(error);
        // We will then print the contents of data
        randomPrint(data);
        // Then split it by commas (to make it more readable)
        var dataArr = data.split(",");
        // We will then re-display the content as an array for later use.
        randomPrint(dataArr[1]);

        var randomTitle = dataArr[1];
        randomPrint(randomTitle);
        spotify.search({ type: 'track', query: randomTitle }, function(err, data) {
            if (err) {
                spotPrint('Error occurred: ' + err);
                return;
            }
            // Handle Data
            var albumTrack = data.tracks.items;
            // spotPrint('albumTrack: ' + albumTrack)
            for (i = 0; i < albumTrack.length; i++) {
                answersPrint("Artist: " + albumTrack[i].artists[0].name);
                answersPrint("Album Title: " + albumTrack[i].album.name);
                answersPrint("Spotify Link: " + albumTrack[i].preview_url);
                answersPrint("Track Title: " + albumTrack[i].name);

            }
        });
    })
}


// console.log("searchTitle: " +  searchTitle);

// debugPrint only prints when var globaDebug * is set to 0. Useful for printing backend logic information when debugging. @param {string} the message you wish to print
function twittPrint(msg) {
    if (!twittDebug) {
        console.log(msg)
    }
}

function spotPrint(msg) {
    if (!spotDebug) {
        console.log(msg)
    }
}

function moviePrint(msg) {
    if (!movieDebug) {
        console.log(msg)
    }
}

function randomPrint(msg) {
    if (!randomDebug) {
        console.log(msg)
    }
}

function generalPrint(msg) {
    if (!generalDebug) {
        console.log(msg)
    }
}

function answersPrint(msg) {
    if (!answersDebug) {
        console.log(msg)
    }
}

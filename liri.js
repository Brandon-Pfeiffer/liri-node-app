var fs = require("fs");
var spot = require("node-spotify-api");
var twitter = require("twitter");
var keys = require("./keys.js");
var request = require("request");
var input = process.argv.splice(2);

function check() {
		switch (input[0]){
		
		case "my-tweets":
			getTwitter(input[1]);
			break;
		
		case "spotify-this-song":
			if (input[1]){
				getSpotify(input[1]);
			} else {
				getSpotify("Ace of Base - The Sign");
			}
			break;

		case "movie-this":	
			if (input[1]){
				getMovie(input[1]);
			} else {
				getMovie("Mr. Nobody");
			}
			break;

		case "do-what-it-says":
			doIt();
			break;

		default:
	    console.log("LIRI doesn't recognize that command");
	}
}

check();


function getTwitter() {



	var client = new twitter({
    consumer_key: keys.twitterKeys.consumer_key,
    consumer_secret: keys.twitterKeys.consumer_secret,
    access_token_key: keys.twitterKeys.client_key,
    access_token_secret: keys.twitterKeys.client_secret   
  	});

	var twitterID = "BrandonPfeiffe4";
	var twitterCount = 20;
	var params = {screen_name: twitterID};


	client.get('statuses/user_timeline', params, 	 
		function(error, data, response){
		    if(error) {
		      throw error;
		    }
		    
		    for (var i = 0; i < data.length; i++){
		    	var myTweets = 
		        "@" + data[i].user.screen_name + ": " + 
		        data[i].text + "\n" + 
		        data[i].created_at + "\n" + 
		        "--------------\n";
		      	console.log(myTweets);
		      	logIt(myTweets);
		    }   
	});
}


function getSpotify(query){

	var spotify = new spot({
		id: keys.spotifyKeys.client_key,
		secret: keys.spotifyKeys.client_secret
	});

	spotify.search({ type:'track', query: query}, function(error, data) {
	    if (error) {
	        throw error
	    }
	    var spotInfo = data.tracks.items[0];
	    var results = 
	      "Artist: " + spotInfo.artists[0].name + "\n" +
	      "Track Name: " + spotInfo.name + "\n" +
	      "Album: " + spotInfo.album.name + "\n" +
	      "Preview Link: " +  spotInfo.preview_url + "\n";
	    console.log(results);
	    logIt(results);
	});
}


function getMovie(input){
	
	var queryURL = "http://www.omdbapi.com/?apikey=40e9cece&t=" + input 

	request(queryURL, function(err, response, body) {
				if (err) {
					console.log(err);
				} else {

			var rotTomato = JSON.parse(body).Ratings[1] === undefined ? rotTomato = "N/A" : rotTomato = JSON.parse(body).Ratings[1].Value;
			var results = 		
					"Title: " + JSON.parse(body).Title + "\n" +
					"Year Released: " + JSON.parse(body).Year + "\n" +
					"IMDB Rating: " + JSON.parse(body).imdbRating + "\n" +
					"Rotten Tomatoes Rating: " + rotTomato + "\n" +
					"Country of Production: " + JSON.parse(body).Country + "\n" +
					"Language: " + JSON.parse(body).Language + "\n" +
					"Plot: " + JSON.parse(body).Plot + "\n" +
					"Actors: " + JSON.parse(body).Actors;

					console.log(results);
					logIt(results); 

				}
	});
}


function doIt(){
	fs.readFile("./random.txt", "utf8", function(error, data){
		if (error) {
	        throw error;
	    }
	    data = data.split(',');
	    input[0] = data[0];
	    input[1] = data[1];
	    check();
	});
}

function logIt(results) {
  fs.appendFile("./log.txt", results, (error) => {
    if(error) {
      throw error;
    }
  });
}

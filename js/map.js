
"use strict";

//OpenStreetMap tile server (no access token required)
//see http://wiki.openstreetmap.org/wiki/Tile_servers
//for more information and styles
var osmTiles = {
    url: "http://{s}.tile.osm.org/{z}/{x}/{y}.png",
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
};

//default zoom level (0-18 for street maps)
//other map styles may have different zoom ranges
var defaultZoom = 3;
var seattleCoords = [47.61, -122.33];

//create Leaflet map and add the OSM tile layer
var map = L.map("map").setView(seattleCoords, defaultZoom);
L.tileLayer(osmTiles.url, {
    attribution: osmTiles.attribution
}).addTo(map);


var twitterSearch = "https://faculty.washington.edu/joelross/search-tweets-proxy/?q=lgbt&count=100"

fetch(twitterSearch)    // fetch data from Twitter Search API
    .then(function(response) {
        return response.json();
    })
    .then(parseTweets)
    .catch(function(err) {
        //write the full error object to the console
        console.error(err);
        setTimeout(function() {
             alert(err.message);
        }, 3000);
    });

function parseTweets(JSobject){    // parse json object to tweet array
    var objectArray= [];
    JSobject.statuses.forEach(function(item){ //assign corresponding tweet attributes to tweet object array
        var tweet = {};
        tweet['created_at'] = item.created_at;
        tweet['text'] = item.text;
        tweet['user'] = {};
        tweet['user']['screen_name'] = item.user.screen_name;
        tweet['user']['location'] = item.user.location;
        tweet['retweet_count'] = item.retweet_count;
        objectArray.push(tweet);
    });
    toMap(objectArray);
    return objectArray;
};


function toMap(TweetArray) {
    TweetArray.forEach(function(tweet) {
        if (tweet.user.location.length > 0) {
            var googleURL = "https://maps.googleapis.com/maps/api/geocode/json?address="+tweet.user.location+"&key=AIzaSyAvVzuUOD3iumJ723Ro0qd0w10qmEtQT5Q";
            fetch(googleURL)     // fetch geo-coordinates data from Google GeoCode API

            .then(function(response) {
                return response.json();
             })
            .then(function(json) {   // add location, username and time to the json file
                json.loc = tweet.user.location;
                json.username = tweet.user.screen_name;
                json.time = tweet.created_at;
                json.text = tweet.text;
                return json;
            })
            .then(addMarker)
            .catch(function(err) {
                //write the full error object to the console
                console.error(err);
                setTimeout(function() {
                    alert(err.message);
                }, 3000);
            });
        }
    });
}

function addMarker(data) {  // add marker on the map according to the coordinates data
    var location = data.loc;
    var username = data.username;
    var text = data.text;
    var time = moment(data.time).fromNow();
    data.results.forEach(function(item) {
        var lat = item.geometry.location.lat;
        var lng = item.geometry.location.lng;
        var popupContent = username + ' said: ' + '<br />' + text + '<br />Location: ' + location + '<br />Time: '+time;
        L.marker([lat,lng]).bindPopup(popupContent).openPopup().addTo(map);
    });
}



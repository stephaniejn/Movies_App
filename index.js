var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var request = require('request');

app.use(bodyParser.urlencoded({extended: false}))

app.use(express.static(__dirname + '/public'));

app.set('view engine', 'ejs');

// Home Page
app.get("/movies/home", function(req,res){
	res.render('movies/home');
})

app.get("/movies/search", function(req, res)
	{
	// Request info
var searchTerm = req.query.title
  request("http://www.omdbapi.com/?s=" + searchTerm, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var stuff = JSON.parse(body);
      console.log(stuff["Search"])
      res.render("movies/search", stuff)
    } else {
      res.render("errorPage")
      console.log("ERRR000R");
    }
});
})

app.get("/movies/:imdb", function(req, res){
	var id = req.params.imdb
	request("http://www.omdbapi.com/?i=" + id +"&tomatoes=true&", function (error, response, body) {
    if (!error && response.statusCode == 200) {
    	var results = JSON.parse(body);
      console.log(results)
      res.render("movies/id", results)
    } else {
      res.render("errorPage")
      console.log("ERRR000R");
    }
});
})

app.listen(3000);
var methodOverride = require('method-override')
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var request = require('request');
var db = require('./models');

// override with POST having ?_method=DELETE
app.use(methodOverride('_method'))

app.use(bodyParser.urlencoded({extended: false}))

app.use(express.static(__dirname + '/public'));

app.set('view engine', 'ejs');

// Root Page
app.get("/", function(req,res){
  res.render('movies/root');
})

// Request info
app.get("/movies/search", function(req, res)
	{
var searchTerm = req.query.title
  request("http://www.omdbapi.com/?s=" + searchTerm, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var stuff = JSON.parse(body);
      // console.log(stuff["Search"])
      res.render("movies/search", stuff)
    } else {
      res.render("errorPage")
      // console.log("ERRR000R");
    }
});
})


// Ajax - Add Info to Watch List
app.post("/movies/:id", function(req,res){
  db.Watch.findOrCreate({where: req.body})
  .then(function(data) {
    res.send({item: data});
});
});

// Spread
// spread(function(data,created) {
//     res.send({wasCreated:created,item:data});
// });
// });

// Go to thanks page & Add info to Watch List - Previous Way
// app.post("/save", function(req,res){
//   db.Watch.findOrCreate({where: { title: req.body.title, year: req.body.year, imdb_code: req.body.imdb_code }})
//   .then(function(Watch) {
//     res.render('movies/thanks');
// });
// });

// Go to watch list page
app.get("/movies/watchlist", function(req,res){
var data= db.Watch.findAll({order: 'id ASC'}).then(function(data){ 
  // res.send(data)

  res.render('movies/watchlist', {"movies": data});
})
})

// Delete using method_override
// app.post("/movies/watchlist", function(req,res){
//   // res.send(req.body);
//   db.Watch.find({ where: {imdb_code: req.body.imdb_code}})
//   .then(function(Watch){
//   Watch.destroy().success(function() {res.redirect('/movies/watchlist')})
// })
// })

// Delete using Ajax
app.delete("/movies/watchlist/:id", function(req,res){
  db.Watch.destroy({where: {id: req.params.id}})
  .then(function(deleteCount){
    res.send({deleted: deleteCount})
  })

})

// IMDB Info
app.get("/movies/:imdb", function(req, res){
	var id = req.params.imdb
	request("http://www.omdbapi.com/?i=" + id +"&tomatoes=true&", function (error, response, body) {
    if (!error && response.statusCode == 200) {
    	var results = JSON.parse(body);
      // console.log(results)
      res.render("movies/id", results)
    } else {
      res.render("errorPage")
      // console.log("ERRR000R");
    }
});
})

app.listen(process.env.PORT || 3000);
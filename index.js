var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var request = require('request');
var db = require('./models');
var session = require('express-session');
var bcrypt = require('bcrypt');
var flash = require('connect-flash');
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(__dirname + '/public'));
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true
}));
app.use(flash());

// Alerts - set up for each page (need partial alerts ejs file)
app.get('*', function(req,res,next){
    var alerts = req.flash();
    res.locals.alerts = alerts
    next();
});

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
        
        if(stuff.Error){
          req.flash('danger','you fail at everything')
          res.redirect("/")
        } else{ 
          res.render("movies/search", stuff)
        }

      } else {
        res.render("errorPage")
      }
    });
  })


// Ajax - Add Info to Watch List
app.post("/movies/:id", function(req,res){
  db.watch.findOrCreate({where: req.body}).spread(function(data,created) {
    res.send({wasCreated:created,item:data});
}).catch(function(err){if(err) throw err;})
});

// Comments Page
app.get("/movies/watchlist/:id/comments",function(req,res){
var commentID = req.params.id
db.watch.find({where: {id: req.params.id}}).then(function(watchThing){
  // res.send(watchThing)
  db.comment.findAll({where:{watchId:commentID}}).then(function(returnMe){
  // res.send({returnMe:returnMe})
res.render("movies/comments", {commentID:commentID, returnMe:returnMe, watchThing:watchThing})
})
})
})



// Display comments
app.post("/movies/watchlist/:id/comments",function(req,res){
  db.watch.find({where: {id: req.params.id}}).then(function(newComment){
  newComment.createComment({text: req.body.text, watch_id:req.params.id})
  .then(function(theComment){
    req.flash('danger','Thanks for your comment!')
    res.redirect("comments")
  })
})
})

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
var data= db.watch.findAll({order: 'id ASC'}).then(function(data){ 

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
  db.watch.destroy({where: {id: req.params.id}})
  .then(function(deleteCount){
    res.send({deleted: deleteCount})
  })

})

// IMDB Info
// app.get("/movies/:imdb", function(req, res){
// 	var id = req.params.imdb
// 	request("http://www.omdbapi.com/?i=" + id +"&tomatoes=true&", function (error, response, body) {
//     if (!error && response.statusCode == 200) {
//     	var results = JSON.parse(body);
//       res.render("movies/id", results)
//     } else {
//       res.render("errorPage")
//     }
// });
// })

// Not Working - To disable Add to Watchlist Button
app.get("/movies/:imdb", function(req, res){
  var id = req.params.imdb
  request("http://www.omdbapi.com/?i=" + id +"&tomatoes=true&", function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var results = JSON.parse(body);
      // console.log(results);
      db.watch.count({where: {imdb_code:results.imdbID}}).then(function(foundItemCount){
        var wasFound= foundItemCount > 0;
        res.render("movies/id", {movieFound: wasFound, item: results})
    })
    } else {
      res.render("errorPage")
    }
});
})

app.listen(process.env.PORT || 3000);



var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
//var $ = require('jquery');
var getJSON = require('get-json');
var unirest = require('unirest');
//var bb = require('express-busboy');
const busboyBodyParser = require('busboy-body-parser');






// Our scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server
var axios = require("axios");
var cheerio = require("cheerio");

// Require all models
var db = require("./models");

var PORT = 3000;

// Initialize Express
var app = express();

// Configure middleware
// bb.extend(app, {
//     upload: true,
//     path: './uploads',
//     allowedPath: /./
// });
// Use morgan logger for logging requests
app.use(logger("dev"));
// Use body-parser for handling form submissions
app.use(busboyBodyParser({ limit: '5mb' }));
// Use express.static to serve the public folder as a static directory
app.use(express.static("public"));

// By default mongoose uses callbacks for async queries, we're setting it to use promises (.then syntax) instead
// Connect to the Mongo DB
mongoose.Promise = Promise;
mongoose.connect("mongodb://localhost/diykits", {
  useMongoClient: true
});

// Routes

// A GET route for scraping the echojs website
app.get("/boms", function(req, res) {
  db.Bom.find({})
    .then(function(boms) {
      // If we were able to successfully find Articles, send them back to the client
      res.json(boms);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
  // // First, we grab the body of the html with request
  // axios.get("http://www.echojs.com/").then(function(response) {
  //   // Then, we load that into cheerio and save it to $ for a shorthand selector
  //   var $ = cheerio.load(response.data);
  //
  //   // Now, we grab every h2 within an article tag, and do the following:
  //   $("article h2").each(function(i, element) {
  //     // Save an empty result object
  //     var result = {};
  //
  //     // Add the text and href of every link, and save them as properties of the result object
  //     result.title = $(this)
  //       .children("a")
  //       .text();
  //     result.link = $(this)
  //       .children("a")
  //       .attr("href");
  //
  //     // Create a new Article using the `result` object built from scraping
  //     db.Article.create(result)
  //       .then(function(dbArticle) {
  //         // View the added result in the console
  //         console.log(dbArticle);
  //       })
  //       .catch(function(err) {
  //         // If an error occurred, send it to the client
  //         return res.json(err);
  //       });
  //   });
  //
  //   // If we were able to successfully scrape and save an Article, send a message to the client
    // res.send("get boms");
  // });
});

// Route for getting all Articles from the db
app.get("/inventory", function(req, res) {
  // Grab the entire Inventory
  db.Inventory.find({})
    .then(function(dbComponents) {
      // If we were able to successfully find Articles, send them back to the client
      res.json(dbComponents);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

app.get("/octopart", function(req, res) {
    var url = 'http://octopart.com/api/v3/parts/match?';
    url += '&queries=[{"mpn":"1N4007"}]';
    url += '&apikey=d7585fa3';
    url += '&callback=?';

    unirest.get(url)
      .send()
      .end(response=> {
        if (response.ok) {
          console.log("Got a response: ", response.body)
        } else {
          console.log("Got an error: ", response.error)
        }
        res.send(response.body).pretty;
      });

    // $.getJSON(url, args, function(response){
    //     var queries = response['request']['queries'];
    //     $.each(queries, function(i, query) {
    //         // print query
    //         console.log(query);
    //
    //         // print corresponding result
    //         console.log(response['results'][i]);
    //     });
    //   res.json(response);
    // });
    // res.send(getJSON('http://api.listenparadise.org', function(error, response){
    //
    // //res.json(response);
    // console.log("ping");
    // }));

});
// Route for grabbing a specific Article by id, populate it with it's note
app.get("/bom/:id", function(req, res) {
  // // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
  // db.Article.findOne({ _id: req.params.id })
  //   // ..and populate all of the notes associated with it
  //   .populate("note")
  //   .then(function(dbArticle) {
  //     // If we were able to successfully find an Article with the given id, send it back to the client
  //     res.json(dbArticle);
  //   })
  //   .catch(function(err) {
  //     // If an error occurred, send it to the client
  //     res.json(err);
  //   });
});
app.post("/newbom/:id", function(req, res) {
  //console.log(req.params.file);

  console.log("files!!!! "+ req.files.file);
  db.Bom.create(req.body)
        .then(function(dbBom) {
          //dbBom.octopartBom.plugin(req.file);
        //x  bd.Bom.plugin();
          // View the added result in the console
          // db.Bom.findAndModify(
          //       {name: req.body.name}, // query
          //       //[['_id','asc']],  // sort order
          //       {$set: {octopartBom: req.file}}, // replacement, replaces only the field "hi"
          //       //{}, // options
          //       function(err, object) {
          //           if (err){
          //               console.warn(err.message);  // returns error if no matching object found
          //           }else{
          //               console.dir(object);
          //           }
          //       });
          console.log("pingning")

          //return db.Bom.findOneAndUpdate({ _id: req.params.id }, { octopartBom: req.files.file }, { new: true });
          console.log(dbBom);
          //console.log(dbBom);
        })
        .catch(function(err) {
          // If an error occurred, send it to the client
          return res.json(err);
        });

});
// Route for saving/updating an Article's associated Note
app.post("/addpart/:id", function(req, res) {
  // Create a new note and pass the req.body to the entry
  // db.Note.create(req.body)
  //   .then(function(dbNote) {
  //     // If a Note was created successfully, find one Article with an `_id` equal to `req.params.id`. Update the Article to be associated with the new Note
  //     // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
  //     // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
  //     return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
  //   })
  //   .then(function(dbArticle) {
  //     // If we were able to successfully update an Article, send it back to the client
  //     res.json(dbArticle);
  //   })
  //   .catch(function(err) {
  //     // If an error occurred, send it to the client
  //     res.json(err);
  //   });
});

// Start the server
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});

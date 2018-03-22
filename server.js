
var express = require("express");

var logger = require("morgan");
var mongoose = require("mongoose");
//var $ = require('jquery');
var getJSON = require('get-json');
var unirest = require('unirest');
//var bb = require('express-busboy');
// const busboy = require('busboy-body-parser');

var bodyParser = require("body-parser");
const csv=require('csvtojson');

//var cors  = require('cors');




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
const fileUpload = require('express-fileupload');
app.use(fileUpload());
//Configure middleware
// bb.extend(app, {
//     upload: true,
//     path: './uploads',
//     allowedPath: /./
// });
// Use morgan logger for logging requests
app.use(logger("dev"));
// Use body-parser for handling form submissions
//app.use(cors());
app.use(bodyParser());
//app.use(bodyParser.urlencoded({ extended: false }));
// var multer  = require('multer');
// var upload = multer({ dest: 'uploads/' });



// Use express.static to serve the public folder as a static directory
app.use(express.static("public"));

// By default mongoose uses callbacks for async queries, we're setting it to use promises (.then syntax) instead
// Connect to the Mongo DB
mongoose.Promise = Promise;
mongoose.connect("mongodb://localhost/diykits", {
  useMongoClient: true
});

// Routes
app.post("/newbom/:id", function(req, res) {
  //console.log(req.params.file);
  // if (!req.files)
  //   return res.status(400).send('No files were uploaded.');
  //console.log("files!!!! "+ req.files.file);
  var insert = {
    newbom: req.body.newbom,
    designer: req.body.designer,
    url: req.body.url,
    pcb: req.body.pcb,
    faceplate: req.body.faceplate,
    fileUpload: req.files.fileUpload,
  }
  db.Bom.create(insert)
        .then(function(dbBom) {
          console.log("pingning")

          // return db.Bom.findOneAndUpdate({ _id: req.params.id }, { octopartBom: req.files.fileUpload}, { new: true });
          console.log(dbBom);
          //console.log(dbBom);
        })
        .catch(function(err) {
          // If an error occurred, send it to the client
          console.log(err);
        });

});

app.post("/newbomTest", function(req, res) {
  //console.log(req.params.file);
  // if (!req.files)
  //   return res.status(400).send('No files were uploaded.');
  //console.log("files!!!! "+ req.files.file);
  db.Bom.create(req.body)
        .then(function(dbBom) {
          console.log("pingning")

          //return db.Bom.findOneAndUpdate({ _id: req.params.id }, { octopartBom: req.files.fileUpload }, { new: true });
          console.log(dbBom);
          //console.log(dbBom);
        })
        .catch(function(err) {
          // If an error occurred, send it to the client
          return res.json(err);
        });

});
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
    var url1 = 'http://octopart.com/api/v3/parts/match?';
    url1 += '&queries=[{"mpn":"SN74S74N"}]';
    url1 += '&apikey=d7585fa3';
    url1 += '&callback=?';
    //
    // unirest.get(url)
    //   .send()
    //   .end(response=> {
    //     if (response.ok) {
    //       console.log("Got a response: ", response.body)
    //     } else {
    //       console.log("Got an error: ", response.error)
    //     }
    //     var partRes = [];
    //     csv({noheader:false}).fromString(response.body)
    //        .on('csv',(csv)=>{
    //             partRes.push(csv);
    //          })
    //          .on('done',()=>{
    //              console.log(partRes);
    //              res.send(partRes);
    //          })
    //     // res.send();

    var queries = [
        {'mpn': '1N4007*', 'reference': 'line1'},
        // {'sku': '67K1122', 'reference': 'line2'},
        // {'mpn_or_sku': 'SN74S74N', 'reference': 'line3'},
        // {'mpn': 'SN74S74N', 'brand': 'Texas Instruments', 'reference': 'line4'}
    ];

    var args = {
        queries: JSON.stringify(queries)
    };

    var url = 'http://octopart.com/api/v3/parts/match?';
    url += '&queries='+JSON.stringify(queries);
    url += '&apikey=d7585fa3';
    url += '&callback=?';
    url += '&include[]=specs';

    unirest.get(url)
      .send()
      .end(response=> {
        if (response.ok) {
          console.log("Got a response: ", response.body)
          var b = response.body.slice(2, response.body.length-1);
          var resObj = JSON.parse(b);
          console.log(resObj);
          res.send(resObj);
        } else {
          console.log("Got an error: ", response.error)
        }
        // var partRes = [];
        // csv({noheader:false}).fromString(response.body)
        //    .on('json',(csv)=>{
        //         partRes.push(csv);
        //      })
        //      .on('done',()=>{
        //          console.log(partRes);
        //          res.send(partRes);
        //      })

    // $.getJSON(url, args, function(response){
    //     var queries = response['request']['queries'];
    //     $.each(queries, function(i, query) {
    //         // print query
    //         console.log(query);
    //
    //         // print corresponding result
    //         console.log(response['results'][i]);
    //     });


    });

});
// Route for grabbing a specific Article by id, populate it with it's note
app.get("/bom/:id", function(req, res) {
  // // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
  db.Bom.findOne({ _id: req.params.id })
  .then(function(dbFile){
   console.log(dbFile.fileUpload.data.buffer.toString());
   var bomArr = [];
   csv({noheader:false}).fromString(dbFile.fileUpload.data.buffer.toString())
      .on('json',(json)=>{
          bomArr.push(json);
        })
        .on('done',()=>{
            console.log(bomArr);
            res.send(bomArr);
        })
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

//Grab the articles as a json
$.getJSON("/boms", function(data) {
  // For each one
  for (var i = 0; i < data.length; i++) {
    // Display the apropos information on the page
    $("#boms").append("<p data-id='" + data[i]._id + "'>" + data[i].newbom + "</p>");
  }
});


// Whenever someone clicks a p tag
$(document).on("click", "p", function() {
  // Empty the notes from the note section
  //$("#notes").empty();
  // Save the id from the p tag
  var thisId = $(this).attr("data-id");

  // Now make an ajax call for the Article
  $.ajax({
    method: "GET",
    url: "/bom/" + thisId
  })
    // With that done, add the note information to the page
    .then(function(data) {
      console.log(data);
      // The title of the article
      // $("#notes").append("<h2>" + data.title + "</h2>");
      // // An input to enter a new title
      // $("#notes").append("<input id='titleinput' name='title' >");
      // // A textarea to add a new note body
      // $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
      // // A button to submit a new note, with the id of the article saved to it
      // $("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");

      // If there's a note in the article
      // if (data.notes) {
      //   // Place the title of the note in the title input
      //   $("#titleinput").val(data.notes.title);
      //   // Place the body of the note in the body textarea
      //   $("#bodyinput").val(data.notes.body);
      // }
    });
});

$( '#formId' ).submit( function( e ) {
  var formData  =  new FormData( this );
  var thisId = $("#bomTitle").val().trim();
  $.ajax( {
    url: '/newbom/'+thisId,
    type: 'POST',
    data: formData,
    processData: false,
    contentType: false
  } ).then( result => {console.log(result)});
  e.preventDefault();
} );
// When you click the savenote button
// $(document).on("click", "#submit", function() {
//   // Grab the id associated with the article from the submit button
//   var thisId = $("#bomTitle").val().trim();//$(this).attr("data-id");
//
//   $.ajax({
//     method: "POST",
//     url: "/newbom/"+thisId,
//     data:{
//       // Value taken from title input
//       name: thisId,
//       designer: $("#designerName").val().trim(),
//       url: $("#kitUrlLink").val().trim(),
//       pcb: $("#pcbUrlLink").val().trim(),
//       faceplate: $("#faceplateUrlLink").val().trim(),
//       // Value taken from note textarea
//     //  body: $("#bodyinput").val()
//     }
//   })
//     // With that done
//     .then(function(data) {
//       // Log the response
//       console.log(data);
//       // Empty the notes section
//       //$("#notes").empty();
//     });
// //
// //   // Also, remove the values entered in the input and textarea for note entry
// //   $("#newbom").val("");
// //   //$("#bodyinput").val("");
// });

var mongoose = require("mongoose");

// Save a reference to the Schema constructor
var Schema = mongoose.Schema;

// Using the Schema constructor, create a new NoteSchema object
// This is similar to a Sequelize model
var ComponentSchema = new Schema({
  // `title` is of type String
  Part: {
    type: String,
    enum: ['resistor', 'capacitor','transistor','diode','trimmer','socket','header','fuse','bead','misc'],
    required: true
  },
  Value: {
    type: String,
    required:false
  },
  Mfr: {
    type: String
  },
  MfrNum: {
    type: String
  },
  Octapart: {
    type: Boolean,
    required: true
  },
  OctapartURI: {
    type: String,
    required: false
  },
  OctapartObj: {
    type: Object
  }

});

// This creates our model from the above schema, using mongoose's model method
var Component = mongoose.model("Component", ComponentSchema);

// Export the Note model
module.exports = Component;

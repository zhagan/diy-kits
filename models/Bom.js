var mongoose = require("mongoose");

// Save a reference to the Schema constructor
var Schema = mongoose.Schema;

var BOMSchema = new Schema({
  // `title` is of type String
  name: String,
  designer: String,
  url: String,
  pcb: String,
  faceplate: String,
  // `body` is of type String
  components: {
    type: Schema.Types.ObjectId,
    ref: "Component"
  }
  //throughHole: Boolean

});

// This creates our model from the above schema, using mongoose's model method
var Bom = mongoose.model("Bom", BOMSchema);

// Export the Note model
module.exports = Bom;

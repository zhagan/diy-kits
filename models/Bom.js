var mongoose = require("mongoose");
var filePluginLib = require('mongoose-file');
var filePlugin = filePluginLib.filePlugin;
// var make_upload_to_model = filePluginLib.make_upload_to_model;
// var path = require("path");
//
// var uploads_base = path.join(__dirname, "uploads");
// var uploads = path.join(uploads_base, "u");

// Save a reference to the Schema constructor
var Schema = mongoose.Schema;

var BOMSchema = new Schema({
  // `title` is of type String
  newbom: String,
  designer: String,
  kitUrl: String,
  pcbUrl: String,
  faceplateUrl: String,
  fileUpload: Object,
  //octopartBom: Object,
  // `body` is of type String
  components: {
    type: Schema.Types.ObjectId,
    ref: "Component"
  }
  //throughHole: Boolean

});
//
// BOMSchema.plugin(filePlugin, {
//     name: "octopartBom",
//     upload_to: make_upload_to_model(uploads, 'boms'),
//     relative_to: uploads_base
//});
// This creates our model from the above schema, using mongoose's model method
var Bom = mongoose.model("Bom", BOMSchema);

// Export the Note model
module.exports = Bom;

var mongoose = require("mongoose");

// Save a reference to the Schema constructor
var Schema = mongoose.Schema;

// Using the Schema constructor, create a new UserSchema object
// This is similar to a Sequelize model
var InventorySchema = new Schema({
  // `title` is required and of type String
  title: {
    type: String,
    required: true
  },
  // `link` is required and of type String
  link: {
    type: String,
    required: true
  },
  components: {
    type: Schema.Types.ObjectId,
    ref: "Component"
  },
  boms:{
    type: Schema.Types.ObjectId,
    ref: "BOM"
  }
});

// This creates our model from the above schema, using mongoose's model method
var Inventory = mongoose.model("Inventory", InventorySchema);

// Export the Article model
module.exports = Inventory;

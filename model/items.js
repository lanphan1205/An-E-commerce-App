var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var itemSchema = new Schema({
    username: "string",
    itemId : "string",
    photos : ["string"],
    price: {type: "number", default: 0}
    // condition: "string"
})
var items = mongoose.model("items", itemSchema);
module.exports = items;

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var newsSchema = new Schema({
    newsTitle: String,
    newsContent: String,
    newsDate: { type: Date, default: Date.now }
});

module.exports = mongoose.model("News", newsSchema);
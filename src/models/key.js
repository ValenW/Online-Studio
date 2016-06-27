var mongoose = require("mongoose");

KeySchema = new mongoose.Schema({
	id: {type: String, required: true},
	url: String,
	instrument_id: String
});

KeySchema.static('findKeyById', function(id, callback) {
	return this.find({id: id}, callback);
});

KeySchema.static('findKeyByUrl', function(url, callback) {
	return this.find({url: url}, callback);
});

KeySchema.static('findKeyByInstrumentId', function(instrument_id, callback) {
	return this.find({instrument_id: instrument_id}, callback);
});

module.exports = mongoose.model('Key', KeySchema);
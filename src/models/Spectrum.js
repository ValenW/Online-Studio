var mongoose = require('mongoose');

SpectrumSchema = mongoose.Schema({
	tempo : Number,
	volume : Number,
	createDate : Date,
	lastModificationDate : Date,
	channels : Object
});

module.exports = mongoose.model('Spectrum', SpectrumSchema);

var mongoose = require('mongoose');

NoteSchema = new mongoose.Schema({
    key: Number,
    head: Number,
    tail: Number
});

var Note = mongoose.model('Note', NoteSchema);

ChannelSchema = new mongoose.Schema({
	instrument: int,
  	notes: [Note]
});

var Channel = mongoose.model('Channel', ChannelSchema);

SpectrumSchema = mongoose.Schema({
	id: String,
	tempo : Number,
	volumn : Number,
	createDate : Date,
	lastModificationDate : Date,
	channels : [ Channel ]
});

module.exports = mongoose.model('Spectrum', SpectrumSchema);

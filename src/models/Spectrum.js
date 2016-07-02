var mongoose = require('mongoose');

// NoteSchema = new mongoose.Schema({
//     key: Number,
//     head: Number,
//     tail: Number
// });

// var Note = mongoose.model('Note', NoteSchema);

// ChannelSchema = new mongoose.Schema({
// 	instrument: Number,
//   	notes: [Note]
// });

// var Channel = mongoose.model('Channel', ChannelSchema);

SpectrumSchema = mongoose.Schema({
	// _id: String,
	tempo : Number,
	volume : Number,
	createDate : Date,
	lastModificationDate : Date,
	channels : Object
});

module.exports = mongoose.model('Spectrum', SpectrumSchema);

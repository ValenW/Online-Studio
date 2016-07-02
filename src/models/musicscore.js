var mongoose = require('mongoose');

NoteSchema = new mongoose.Schema({
    key_id: {type: mongoose.Schema.Types.ObjectId, ref: 'Key'},
    head: Number,
    tail: Number
});

var Note = mongoose.model('Note', NoteSchema);

MusicscoreSchema = new mongoose.Schema({
  id: String,
  note_list: [ [Note] ]
});

module.exports = mongoose.model('Music', MusicSchema);

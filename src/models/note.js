var mongoose = require('mongoose');

NoteSchema = new mongoose.Schema({
  id: String,
  keyId: String,
  head: int,
  tail: int
});

NoteSchema.static('findNoteById', function(id, callback) {
  return this.find({id: id}, callback);
});

module.exports = mongoose.model('Note', NoteSchema);

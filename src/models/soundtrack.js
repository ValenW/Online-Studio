var mongoose = require('mongoose');

SoundtrackSchema = new mongoose.Schema({
  id: String,
  notes: [{type: mongoose.Schema.Types.ObjectId, ref: 'Note'}]
});

SoundtrackSchema.static('findSoundtrackById', function(id, callback) {
  return this.find({id: id}, callback);
});

module.exports = mongoose.model('Soundtrack', SoundtrackSchema);

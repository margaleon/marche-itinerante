const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const participantSchema = new Schema({
  firstName: { type: String, required: true },
  age: { type: Number, required: true },
  presentation: { type: String, required: true },
});

const Participant = mongoose.model("Participant", participantSchema);

module.exports = { Participant };

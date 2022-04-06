const { Participant } = require("../models/participantModel");

/* GET ALL PARTICIPANTS */
const participant_get_all = async (req, res) => {
  try {
    const participants = await Participant.find();
    res.status(200).json(participants);
  } catch (err) {
    res.status(500).json(err);
  }
};

/* GET PARTICIPANT BY ID */
const participant_get_byID = (req, res) => {
  const id = req.params.id;
  Participant.findById(id)
    .then((result) => {
      res.status(200).send(result);
    })
    .catch((err) => {
      res.status(400).send(err);
    });
};

/* UPDATE PARTICIPANT BY ID */
const participant_update = (req, res) => {
  const id = req.params.id;
  Participant.findByIdAndUpdate(id)
    .then((result) => {
      res.status(200).send(result);
    })
    .catch((err) => {
      res.status(400).send(err);
    });
};

module.exports = {
  participant_get_all,
  participant_get_byID,
  participant_update,
};

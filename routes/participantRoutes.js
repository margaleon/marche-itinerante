const express = require("express");
const participantController = require("../controllers/participantController");
const { authenticateToken } = require("../utils/JWT");

const router = express.Router();

router.get("/", authenticateToken, participantController.participant_get_all);
router.get(
  "/:id",
  authenticateToken,
  participantController.participant_get_byID
);

router.put("/:id", authenticateToken, participantController.participant_update);

module.exports = router;

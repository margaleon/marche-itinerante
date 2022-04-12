const express = require("express");
const postController = require("../controllers/postController");
const { authenticateToken } = require("../utils/JWT");

const router = express.Router();

router.get("/", authenticateToken, postController.post_get_all);
router.get("/:id", authenticateToken, postController.post_get_byID);
router.post("/", authenticateToken, postController.post_create);

router.put("/:id", authenticateToken, postController.post_update);
router.delete("/:id", authenticateToken, postController.post_delete);

module.exports = router;

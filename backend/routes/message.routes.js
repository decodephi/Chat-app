const express = require("express");
const router = express.Router();
const { getMessages, sendMessage, deleteMessage } = require("../controllers/message.controller");
const { protect } = require("../middleware/auth.middleware");

router.use(protect);

router.get("/:userId", getMessages);
router.post("/send/:receiverId", sendMessage);
router.delete("/:messageId", deleteMessage);

module.exports = router;

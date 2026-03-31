const express = require("express");
const router = express.Router();
const { getUsers, searchUsers, getUserById } = require("../controllers/user.controller");
const { protect } = require("../middleware/auth.middleware");

// All user routes are protected
router.use(protect);

router.get("/", getUsers);
router.get("/search", searchUsers);
router.get("/:id", getUserById);

module.exports = router;

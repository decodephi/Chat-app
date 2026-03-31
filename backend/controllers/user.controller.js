const User = require("../models/User");

// ─────────────────────────────────────────────────────────────
// @route   GET /api/users
// @desc    Get all users except the logged-in user (for sidebar)
// @access  Private
// ─────────────────────────────────────────────────────────────
const getUsers = async (req, res, next) => {
  try {
    // Exclude the requesting user from the list
    const users = await User.find({ _id: { $ne: req.user._id } })
      .select("-password")
      .sort({ name: 1 });

    res.status(200).json({ success: true, users });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────
// @route   GET /api/users/search?q=<query>
// @desc    Search users by name or email
// @access  Private
// ─────────────────────────────────────────────────────────────
const searchUsers = async (req, res, next) => {
  try {
    const { q } = req.query;

    if (!q || q.trim() === "") {
      return res.status(400).json({ success: false, message: "Query required" });
    }

    const regex = new RegExp(q.trim(), "i"); // case-insensitive search
    const users = await User.find({
      _id: { $ne: req.user._id },
      $or: [{ name: regex }, { email: regex }],
    })
      .select("-password")
      .limit(20);

    res.status(200).json({ success: true, users });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────
// @route   GET /api/users/:id
// @desc    Get a single user by ID
// @access  Private
// ─────────────────────────────────────────────────────────────
const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    res.status(200).json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

module.exports = { getUsers, searchUsers, getUserById };

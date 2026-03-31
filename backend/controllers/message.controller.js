const Message = require("../models/Message");

// Lazy import to avoid circular dependency
let socketModule;
const getSocket = () => {
  if (!socketModule) socketModule = require("../socket/socket");
  return socketModule;
};

// GET /api/messages/:userId — conversation history
const getMessages = async (req, res, next) => {
  try {
    const myId = req.user._id;
    const { userId: chatPartnerId } = req.params;

    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: chatPartnerId },
        { senderId: chatPartnerId, receiverId: myId },
      ],
    }).sort({ createdAt: 1 });

    await Message.updateMany(
      { senderId: chatPartnerId, receiverId: myId, read: false },
      { read: true }
    );

    res.status(200).json({ success: true, messages });
  } catch (error) { next(error); }
};

// POST /api/messages/send/:receiverId — send message
const sendMessage = async (req, res, next) => {
  try {
    const { message } = req.body;
    const { receiverId } = req.params;
    const senderId = req.user._id;

    if (!message || !message.trim()) {
      return res.status(400).json({ success: false, message: "Message cannot be empty" });
    }

    const newMessage = await Message.create({ senderId, receiverId, message: message.trim() });

    // Emit to receiver if online
    const { getReceiverSocketId, io } = getSocket();
    const receiverSocketId = getReceiverSocketId(receiverId);
    const ioInstance = io();
    if (receiverSocketId && ioInstance) {
      ioInstance.to(receiverSocketId).emit("newMessage", newMessage);
    }

    res.status(201).json({ success: true, message: newMessage });
  } catch (error) { next(error); }
};

// DELETE /api/messages/:messageId
const deleteMessage = async (req, res, next) => {
  try {
    const message = await Message.findById(req.params.messageId);
    if (!message) return res.status(404).json({ success: false, message: "Not found" });
    if (message.senderId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }
    await message.deleteOne();
    res.status(200).json({ success: true, message: "Deleted" });
  } catch (error) { next(error); }
};

module.exports = { getMessages, sendMessage, deleteMessage };

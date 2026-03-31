import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { userService, messageService } from "../services/chat.service";
import { useSocket } from "./SocketContext";
import toast from "react-hot-toast";

const ChatContext = createContext(null);

export const ChatProvider = ({ children }) => {
  const [users, setUsers]               = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages]         = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const { socket } = useSocket();

  // ── Fetch all users for sidebar ──────────────────────────────
  const fetchUsers = useCallback(async () => {
    setLoadingUsers(true);
    try {
      const { data } = await userService.getAll();
      setUsers(data.users);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to load users");
    } finally {
      setLoadingUsers(false);
    }
  }, []);

  // ── Fetch messages for selected conversation ──────────────────
  const fetchMessages = useCallback(async (userId) => {
    setLoadingMessages(true);
    try {
      const { data } = await messageService.getConversation(userId);
      setMessages(data.messages);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to load messages");
    } finally {
      setLoadingMessages(false);
    }
  }, []);

  // ── Send a message ────────────────────────────────────────────
  const sendMessage = useCallback(async (messageText) => {
    if (!selectedUser) return;
    try {
      const { data } = await messageService.send(selectedUser._id, messageText);
      setMessages((prev) => [...prev, data.message]);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send message");
    }
  }, [selectedUser]);

  // ── Select a conversation ─────────────────────────────────────
  const selectUser = useCallback((user) => {
    setSelectedUser(user);
    setMessages([]); // clear previous conversation instantly
  }, []);

  // ── Load messages when selectedUser changes ───────────────────
  useEffect(() => {
    if (selectedUser) fetchMessages(selectedUser._id);
  }, [selectedUser, fetchMessages]);

  // ── Socket: receive real-time messages ───────────────────────
  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (newMsg) => {
      const isFromSelected = selectedUser && newMsg.senderId === selectedUser._id;
      if (isFromSelected) {
        setMessages((prev) => [...prev, newMsg]);
      }
      // Always play a sound / notification for non-active conversations
    };

    socket.on("newMessage", handleNewMessage);
    return () => socket.off("newMessage", handleNewMessage);
  }, [socket, selectedUser]);

  return (
    <ChatContext.Provider
      value={{
        users, fetchUsers, loadingUsers,
        selectedUser, selectUser,
        messages, sendMessage, loadingMessages,
        setMessages,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error("useChat must be used within ChatProvider");
  return ctx;
};

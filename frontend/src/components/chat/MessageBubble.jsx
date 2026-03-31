import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useChat } from "../../context/ChatContext";
import { messageService } from "../../services/chat.service";
import { formatMessageTime } from "../../utils/helpers";
import Avatar from "../common/Avatar";
import toast from "react-hot-toast";

const MessageBubble = ({ message, prevMessage }) => {
  const { authUser }    = useAuth();
  const { selectedUser, setMessages } = useChat();
  const [showMenu, setShowMenu] = useState(false);

  const isMine = message.senderId === authUser?._id;
  const sender = isMine ? authUser : selectedUser;

  // Group consecutive messages from same sender (skip avatar for middle messages)
  const showAvatar = !prevMessage || prevMessage.senderId !== message.senderId;

  const handleDelete = async () => {
    try {
      await messageService.deleteMessage(message._id);
      setMessages((prev) => prev.filter((m) => m._id !== message._id));
      toast.success("Message deleted");
    } catch {
      toast.error("Could not delete message");
    }
    setShowMenu(false);
  };

  return (
    <div
      className={`flex items-end gap-2 group ${isMine ? "flex-row-reverse" : "flex-row"} ${
        !showAvatar ? (isMine ? "pr-12" : "pl-12") : ""
      }`}
    >
      {/* Avatar — only on first message in a group */}
      {showAvatar ? (
        <Avatar user={sender} size="sm" className="flex-shrink-0 mb-1" />
      ) : (
        <div className="w-8 flex-shrink-0" />
      )}

      <div className={`flex flex-col ${isMine ? "items-end" : "items-start"} max-w-[75%]`}>
        {/* Sender name for received messages */}
        {!isMine && showAvatar && (
          <span className="text-xs text-slate-500 ml-1 mb-1">{sender?.name}</span>
        )}

        <div className="relative">
          <div
            className={isMine ? "bubble-out" : "bubble-in"}
            onDoubleClick={() => isMine && setShowMenu((s) => !s)}
          >
            <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.message}</p>
          </div>

          {/* Context menu for own messages */}
          {isMine && showMenu && (
            <div className="absolute bottom-full right-0 mb-1 bg-chat-surface border border-chat-border rounded-lg shadow-xl z-10 overflow-hidden animate-fade-in">
              <button
                onClick={handleDelete}
                className="flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 w-full text-left"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
                Delete
              </button>
            </div>
          )}
        </div>

        {/* Timestamp + read status */}
        <div className={`flex items-center gap-1 mt-0.5 px-1 ${isMine ? "flex-row-reverse" : ""}`}>
          <span className="text-[10px] text-slate-600">
            {formatMessageTime(message.createdAt)}
          </span>
          {isMine && (
            <svg className={`w-3.5 h-3.5 ${message.read ? "text-primary-400" : "text-slate-600"}`}
              fill="currentColor" viewBox="0 0 24 24">
              <path d="M18 7l-1.41-1.41-6.34 6.34 1.41 1.41L18 7zm4.24-1.41L11.66 16.17 7.48 12l-1.41 1.41L11.66 19l12-12-1.42-1.41zM.41 13.41L6 19l1.41-1.41L1.83 12 .41 13.41z"/>
            </svg>
          )}
        </div>
      </div>

      {/* Hide menu on outside click */}
      {showMenu && (
        <div
          className="fixed inset-0 z-[5]"
          onClick={() => setShowMenu(false)}
        />
      )}
    </div>
  );
};

export default MessageBubble;

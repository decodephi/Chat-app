import { useEffect, useRef } from "react";
import { useChat } from "../../context/ChatContext";
import { useAuth } from "../../context/AuthContext";
import MessageBubble from "./MessageBubble";
import Spinner from "../common/Spinner";
import { format, isToday, isYesterday, isSameDay } from "date-fns";

const DateSeparator = ({ date }) => {
  const d = new Date(date);
  const label = isToday(d) ? "Today" : isYesterday(d) ? "Yesterday" : format(d, "MMMM d, yyyy");
  return (
    <div className="flex items-center gap-3 my-4 px-4">
      <div className="flex-1 h-px bg-chat-border" />
      <span className="text-xs text-slate-600 font-medium px-2 py-0.5 bg-chat-bg rounded-full border border-chat-border">
        {label}
      </span>
      <div className="flex-1 h-px bg-chat-border" />
    </div>
  );
};

const TypingIndicator = ({ name }) => (
  <div className="flex items-end gap-2 px-4 py-1">
    <div className="w-8 h-8 rounded-full bg-chat-surface border border-chat-border flex items-center justify-center text-xs text-slate-400">
      {name?.[0]?.toUpperCase()}
    </div>
    <div className="bubble-in py-3 px-4">
      <span className="inline-flex gap-1">
        <span className="typing-dot" />
        <span className="typing-dot" />
        <span className="typing-dot" />
      </span>
    </div>
  </div>
);

const MessageList = ({ isTyping }) => {
  const { messages, loadingMessages, selectedUser } = useChat();
  const { authUser } = useAuth();
  const bottomRef = useRef(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  if (loadingMessages) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Spinner size="md" />
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-slate-600 px-8 text-center">
        <div className="w-16 h-16 rounded-full bg-chat-surface border border-chat-border flex items-center justify-center mb-4">
          <svg className="w-8 h-8 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
        </div>
        <p className="font-medium text-slate-400">No messages yet</p>
        <p className="text-sm mt-1">Say hello to <span className="text-primary-400">{selectedUser?.name}</span>!</p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
      {messages.map((msg, idx) => {
        const prev = messages[idx - 1];
        // Show date separator when date changes between messages
        const showDate = !prev || !isSameDay(new Date(msg.createdAt), new Date(prev.createdAt));
        return (
          <div key={msg._id}>
            {showDate && <DateSeparator date={msg.createdAt} />}
            <MessageBubble message={msg} prevMessage={prev} />
          </div>
        );
      })}

      {/* Typing indicator */}
      {isTyping && <TypingIndicator name={selectedUser?.name} />}

      {/* Scroll anchor */}
      <div ref={bottomRef} />
    </div>
  );
};

export default MessageList;

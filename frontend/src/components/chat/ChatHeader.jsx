import { useSocket } from "../../context/SocketContext";
import Avatar from "../common/Avatar";

const ChatHeader = ({ user, isTyping, onMobileBack }) => {
  const { onlineUsers } = useSocket();
  const isOnline = onlineUsers.includes(user?._id);

  return (
    <div className="flex items-center gap-3 px-4 py-3 bg-chat-sidebar border-b border-chat-border">
      {/* Mobile back button */}
      <button
        onClick={onMobileBack}
        className="md:hidden btn-ghost p-1.5 mr-1"
        aria-label="Back"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <Avatar user={user} showStatus isOnline={isOnline} />

      <div className="flex-1 min-w-0">
        <h2 className="text-sm font-semibold text-white truncate">{user?.name}</h2>
        <p className="text-xs">
          {isTyping ? (
            <span className="text-primary-400 flex items-center gap-1">
              <span>typing</span>
              <span className="inline-flex gap-0.5">
                <span className="typing-dot" />
                <span className="typing-dot" />
                <span className="typing-dot" />
              </span>
            </span>
          ) : isOnline ? (
            <span className="text-emerald-400">Online</span>
          ) : (
            <span className="text-slate-500">Offline</span>
          )}
        </p>
      </div>

      {/* Action icons */}
      <div className="flex items-center gap-1">
        <button className="btn-ghost p-2" title="Voice call (coming soon)">
          <svg className="w-5 h-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
            />
          </svg>
        </button>
        <button className="btn-ghost p-2" title="Video call (coming soon)">
          <svg className="w-5 h-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M15 10l4.553-2.069A1 1 0 0121 8.82v6.36a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;

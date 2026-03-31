import { useAuth } from "../../context/AuthContext";
import { useSocket } from "../../context/SocketContext";

const WelcomeScreen = () => {
  const { authUser } = useAuth();
  const { onlineUsers } = useSocket();

  return (
    <div className="flex-1 flex flex-col items-center justify-center bg-chat-bg text-center px-8">
      {/* Animated logo */}
      <div className="relative mb-6">
        <div className="w-24 h-24 bg-primary-600/20 rounded-full flex items-center justify-center border border-primary-600/30 animate-pulse">
          <div className="w-16 h-16 bg-primary-600/30 rounded-full flex items-center justify-center border border-primary-600/40">
            <svg className="w-9 h-9 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
          </div>
        </div>
        {/* Orbiting dot */}
        <div className="absolute top-1 right-1 w-4 h-4 bg-emerald-400 rounded-full border-2 border-chat-bg" />
      </div>

      <h1 className="text-2xl font-bold text-white mb-2">
        Welcome, {authUser?.name?.split(" ")[0]}!
      </h1>
      <p className="text-slate-400 text-sm max-w-xs leading-relaxed">
        Select a conversation from the sidebar to start messaging in real time.
      </p>

      {/* Stats */}
      <div className="flex items-center gap-6 mt-8 p-4 bg-chat-sidebar border border-chat-border rounded-2xl">
        <div className="text-center">
          <p className="text-2xl font-bold text-emerald-400">{onlineUsers.length}</p>
          <p className="text-xs text-slate-500 mt-0.5">Online now</p>
        </div>
        <div className="w-px h-10 bg-chat-border" />
        <div className="text-center">
          <p className="text-2xl font-bold text-primary-400">E2E</p>
          <p className="text-xs text-slate-500 mt-0.5">Real-time</p>
        </div>
        <div className="w-px h-10 bg-chat-border" />
        <div className="text-center">
          <p className="text-2xl font-bold text-slate-300">∞</p>
          <p className="text-xs text-slate-500 mt-0.5">History</p>
        </div>
      </div>

      <p className="text-xs text-slate-700 mt-6">
        NexChat · Built with MERN + Socket.IO
      </p>
    </div>
  );
};

export default WelcomeScreen;

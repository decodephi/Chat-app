import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../../context/AuthContext";
import { useChat } from "../../context/ChatContext";
import { useSocket } from "../../context/SocketContext";
import { userService } from "../../services/chat.service";
import Avatar from "../common/Avatar";
import { truncate } from "../../utils/helpers";
import toast from "react-hot-toast";

const Sidebar = ({ onMobileClose }) => {
  const { authUser, logout } = useAuth();
  const { users, fetchUsers, loadingUsers, selectedUser, selectUser, messages } = useChat();
  const { onlineUsers } = useSocket();

  const [searchQuery, setSearchQuery]   = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching]   = useState(false);
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);

  // Initial fetch
  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  // Debounced search
  useEffect(() => {
    if (!searchQuery.trim()) { setSearchResults([]); return; }
    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const { data } = await userService.search(searchQuery);
        setSearchResults(data.users);
      } catch {
        toast.error("Search failed");
      } finally {
        setIsSearching(false);
      }
    }, 350);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const displayedUsers = searchQuery.trim()
    ? searchResults
    : showOnlineOnly
      ? users.filter((u) => onlineUsers.includes(u._id))
      : users;

  const handleSelectUser = (user) => {
    selectUser(user);
    onMobileClose?.();
  };

  const handleLogout = async () => {
    try { await logout(); } catch { /* ignore */ }
  };

  return (
    <aside className="flex flex-col h-full bg-chat-sidebar border-r border-chat-border w-full">
      {/* ── Header ──────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-chat-border">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
          </div>
          <span className="font-bold text-white text-lg tracking-tight">NexChat</span>
        </div>

        {/* Online filter toggle */}
        <button
          onClick={() => setShowOnlineOnly((s) => !s)}
          className={`text-xs px-2.5 py-1 rounded-full border transition-all font-medium ${
            showOnlineOnly
              ? "border-emerald-500 text-emerald-400 bg-emerald-500/10"
              : "border-chat-border text-slate-500 hover:text-slate-300"
          }`}
        >
          Online
        </button>
      </div>

      {/* ── Search ──────────────────────────────────────────── */}
      <div className="px-3 py-3 border-b border-chat-border">
        <div className="relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500"
            fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search users…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-chat-bg border border-chat-border rounded-xl pl-9 pr-4 py-2 text-sm text-slate-200
                       placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-primary-500"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* ── Online count ─────────────────────────────────────── */}
      {!searchQuery && (
        <div className="px-4 pt-3 pb-1">
          <p className="text-xs text-slate-600 font-medium uppercase tracking-widest">
            {onlineUsers.filter(id => id !== authUser?._id).length} online · {users.length} total
          </p>
        </div>
      )}

      {/* ── User List ────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto py-2">
        {loadingUsers || isSearching ? (
          <div className="flex flex-col gap-2 px-3 pt-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-3 px-3 py-3 rounded-xl">
                <div className="w-10 h-10 rounded-full bg-chat-surface animate-pulse" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 bg-chat-surface rounded animate-pulse w-3/4" />
                  <div className="h-2 bg-chat-surface rounded animate-pulse w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : displayedUsers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-slate-600">
            <svg className="w-10 h-10 mb-2 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <p className="text-sm">
              {searchQuery ? "No users found" : showOnlineOnly ? "No one online" : "No users yet"}
            </p>
          </div>
        ) : (
          displayedUsers.map((user) => {
            const isOnline  = onlineUsers.includes(user._id);
            const isActive  = selectedUser?._id === user._id;
            return (
              <div
                key={user._id}
                onClick={() => handleSelectUser(user)}
                className={`user-item ${isActive ? "user-item-active" : ""}`}
              >
                <Avatar user={user} showStatus isOnline={isOnline} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className={`text-sm font-medium truncate ${isActive ? "text-white" : "text-slate-200"}`}>
                      {user.name}
                    </span>
                    {isOnline && (
                      <span className="text-xs text-emerald-400 font-medium ml-2 flex-shrink-0">Active</span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 truncate">{truncate(user.email, 28)}</p>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* ── Current user footer ──────────────────────────────── */}
      <div className="border-t border-chat-border p-3">
        <div className="flex items-center gap-3">
          <Avatar user={authUser} size="sm" showStatus isOnline />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">{authUser?.name}</p>
            <p className="text-xs text-emerald-400">Online</p>
          </div>
          <button
            onClick={handleLogout}
            title="Sign out"
            className="btn-ghost p-2 rounded-lg text-slate-500 hover:text-red-400 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;

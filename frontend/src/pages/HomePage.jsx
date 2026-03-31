import { useState } from "react";
import { useChat } from "../context/ChatContext";
import Sidebar from "../components/chat/Sidebar";
import ChatWindow from "../components/chat/ChatWindow";

/**
 * HomePage — the main chat layout.
 *
 * Desktop:  Sidebar (fixed width) | ChatWindow (flex-1)  — both always visible
 * Mobile:   Show Sidebar OR ChatWindow depending on selection state
 */
const HomePage = () => {
  const { selectedUser, selectUser } = useChat();
  // Mobile: track whether the chat panel is open
  const [mobileChatOpen, setMobileChatOpen] = useState(false);

  const handleSelectUser = (user) => {
    selectUser(user);
    setMobileChatOpen(true);
  };

  const handleMobileBack = () => {
    setMobileChatOpen(false);
  };

  return (
    <div className="flex h-full bg-chat-bg overflow-hidden">
      {/* ── Sidebar ─────────────────────────────────────────────
          Desktop: always visible (w-72 lg:w-80)
          Mobile:  visible when chat is NOT open
      ──────────────────────────────────────────────────────── */}
      <div
        className={`
          flex-shrink-0
          md:w-72 lg:w-80
          ${mobileChatOpen ? "hidden md:flex" : "flex"}
          flex-col w-full
        `}
      >
        <Sidebar onMobileClose={() => setMobileChatOpen(true)} />
      </div>

      {/* ── Chat Window ──────────────────────────────────────────
          Desktop: always visible (flex-1)
          Mobile:  visible only when a chat is selected
      ──────────────────────────────────────────────────────── */}
      <div
        className={`
          flex-1 flex flex-col min-w-0
          ${mobileChatOpen ? "flex" : "hidden md:flex"}
        `}
      >
        <ChatWindow onMobileBack={handleMobileBack} />
      </div>
    </div>
  );
};

export default HomePage;

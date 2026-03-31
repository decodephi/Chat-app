import { useState, useRef, useCallback } from "react";
import { useChat } from "../../context/ChatContext";
import useTyping from "../../hooks/useTyping";

const EMOJIS = ["😊","😂","❤️","👍","🙌","🔥","😎","🤔","😢","🎉","✨","💯","🙏","😍","🤣"];

const MessageInput = () => {
  const { sendMessage, selectedUser } = useChat();
  const { emitTyping } = useTyping(selectedUser?._id);

  const [text, setText]           = useState("");
  const [sending, setSending]     = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);
  const textareaRef = useRef(null);

  const handleChange = (e) => {
    setText(e.target.value);
    emitTyping();
  };

  const handleSubmit = useCallback(async (e) => {
    e?.preventDefault();
    const trimmed = text.trim();
    if (!trimmed || sending) return;

    setSending(true);
    setText("");
    setShowEmoji(false);

    try {
      await sendMessage(trimmed);
    } finally {
      setSending(false);
      // Refocus input after send
      setTimeout(() => textareaRef.current?.focus(), 50);
    }
  }, [text, sending, sendMessage]);

  // Submit on Enter (Shift+Enter = newline)
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const insertEmoji = (emoji) => {
    setText((prev) => prev + emoji);
    setShowEmoji(false);
    textareaRef.current?.focus();
  };

  return (
    <div className="px-4 py-3 bg-chat-sidebar border-t border-chat-border">
      {/* Emoji picker */}
      {showEmoji && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setShowEmoji(false)} />
          <div className="absolute bottom-20 left-4 right-4 md:left-auto md:right-4 md:w-72 bg-chat-surface border border-chat-border rounded-2xl shadow-2xl p-3 z-20 animate-slide-in">
            <p className="text-xs text-slate-600 mb-2 font-medium">Quick emojis</p>
            <div className="flex flex-wrap gap-1">
              {EMOJIS.map((em) => (
                <button
                  key={em}
                  onClick={() => insertEmoji(em)}
                  className="text-xl hover:bg-chat-bg rounded-lg w-9 h-9 flex items-center justify-center transition-colors"
                >
                  {em}
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      <form onSubmit={handleSubmit} className="flex items-end gap-2">
        {/* Emoji button */}
        <button
          type="button"
          onClick={() => setShowEmoji((s) => !s)}
          className={`btn-ghost p-2.5 rounded-xl flex-shrink-0 transition-colors ${
            showEmoji ? "text-primary-400 bg-chat-surface" : "text-slate-500"
          }`}
          title="Emoji"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </button>

        {/* Textarea */}
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={text}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder="Type a message…"
            rows={1}
            className="w-full bg-chat-bg border border-chat-border rounded-xl px-4 py-3 text-sm text-slate-100
                       placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-primary-500
                       resize-none overflow-hidden leading-5 max-h-32"
            style={{ height: "auto" }}
            onInput={(e) => {
              e.target.style.height = "auto";
              e.target.style.height = Math.min(e.target.scrollHeight, 128) + "px";
            }}
          />
        </div>

        {/* Send button */}
        <button
          type="submit"
          disabled={!text.trim() || sending}
          className={`flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-200
            ${text.trim() && !sending
              ? "bg-primary-600 hover:bg-primary-700 text-white shadow-lg shadow-primary-600/20 active:scale-95"
              : "bg-chat-surface text-slate-600 cursor-not-allowed"
            }`}
          title="Send message"
        >
          {sending ? (
            <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
              />
            </svg>
          )}
        </button>
      </form>

      {/* Hint */}
      <p className="text-center text-[10px] text-slate-700 mt-1.5">
        Enter to send · Shift+Enter for newline
      </p>
    </div>
  );
};

export default MessageInput;

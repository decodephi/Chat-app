import { useState, useEffect, useRef, useCallback } from "react";
import { useSocket } from "../context/SocketContext";

/**
 * Manages typing indicator state.
 * - Emits "typing" event on keystroke (debounced to stop after 2s idle).
 * - Listens for "typing" / "stopTyping" from the selected conversation partner.
 */
const useTyping = (selectedUserId) => {
  const { socket } = useSocket();
  const [isPartnerTyping, setIsPartnerTyping] = useState(false);
  const typingTimeoutRef = useRef(null);
  const isTypingRef = useRef(false);

  // Emit typing event when user types
  const emitTyping = useCallback(() => {
    if (!socket || !selectedUserId) return;

    if (!isTypingRef.current) {
      isTypingRef.current = true;
      socket.emit("typing", { receiverId: selectedUserId });
    }

    // Reset after 2 seconds of no keystrokes
    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      isTypingRef.current = false;
      socket.emit("stopTyping", { receiverId: selectedUserId });
    }, 2000);
  }, [socket, selectedUserId]);

  // Listen for partner typing events
  useEffect(() => {
    if (!socket) return;

    const handleTyping = ({ senderId }) => {
      if (senderId === selectedUserId) setIsPartnerTyping(true);
    };

    const handleStopTyping = ({ senderId }) => {
      if (senderId === selectedUserId) setIsPartnerTyping(false);
    };

    socket.on("typing",     handleTyping);
    socket.on("stopTyping", handleStopTyping);

    return () => {
      socket.off("typing",     handleTyping);
      socket.off("stopTyping", handleStopTyping);
    };
  }, [socket, selectedUserId]);

  // Clear state when conversation changes
  useEffect(() => {
    setIsPartnerTyping(false);
    isTypingRef.current = false;
    clearTimeout(typingTimeoutRef.current);
  }, [selectedUserId]);

  return { isPartnerTyping, emitTyping };
};

export default useTyping;

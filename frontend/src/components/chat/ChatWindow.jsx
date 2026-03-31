import { useChat } from "../../context/ChatContext";
import useTyping from "../../hooks/useTyping";
import ChatHeader from "./ChatHeader";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import WelcomeScreen from "./WelcomeScreen";

const ChatWindow = ({ onMobileBack }) => {
  const { selectedUser } = useChat();
  const { isPartnerTyping } = useTyping(selectedUser?._id);

  if (!selectedUser) {
    return (
      <div className="hidden md:flex flex-1 flex-col">
        <WelcomeScreen />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-chat-bg animate-fade-in">
      <ChatHeader user={selectedUser} isTyping={isPartnerTyping} onMobileBack={onMobileBack} />
      <MessageList isTyping={isPartnerTyping} />
      <MessageInput />
    </div>
  );
};

export default ChatWindow;

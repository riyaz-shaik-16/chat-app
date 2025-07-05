import { useEffect, useRef } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import ChatBubble from "./ChatBubble";
import ChatHeader from "./ChatHeader";
import ChatInput from "./ChatInput";
import { useDispatch, useSelector } from "react-redux";
import { selectSelectedChat } from "@/redux/slices/chat.slice";
import { selectUserInfo } from "@/redux/slices/user.slice";
import { fetchMessages, selectMessages } from "@/redux/slices/message.slice";

const ChatContainer = ({ className = "" }) => {
  const chatRef = useRef(null);
  const user = useSelector(selectUserInfo);
  const selectedUser = useSelector(selectSelectedChat);

  console.log("Selected user: ",selectedUser?._id);

  const messages = useSelector(selectMessages) || []
  console.log("MEssages: ",messages);
  const isTyping = true

  const handleTyping = () => {}

  const dispatch = useDispatch();

  useEffect(() => {
    selectedUser?._id && dispatch(fetchMessages(selectedUser?._id));
  }, [dispatch, selectedUser]);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTo({
        top: chatRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  return (
    <div className={`${className}`}>
      {selectedUser ? (
        <div className="h-screen w-full flex flex-col">
          <ChatHeader user={selectedUser} />

          <ScrollArea
            className="h-[calc(100dvh-200px)] px-4 py-2 mt-[56px]"
            viewportRef={chatRef}
          >
            <div className="flex flex-col gap-2">
              {messages.map((msg, i) => (
                <ChatBubble key={i} message={msg} />
              ))}
              {isTyping && <p>Typing..</p>}
            </div>
          </ScrollArea>

          <ChatInput onTyping={handleTyping} />
        </div>
      ) : (
        <>
          <div className="flex flex-1 flex-col items-center justify-center h-full text-center text-muted-foreground px-4">
            <div className="text-4xl mb-4">💬</div>
            <h2 className="text-xl font-semibold mb-2">Select a chat</h2>
            <p className="text-sm">
              Choose a conversation from the sidebar or start a new one.
            </p>
          </div>
        </>
      )}
    </div>
  );
};

export default ChatContainer;

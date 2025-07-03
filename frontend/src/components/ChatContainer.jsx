import { useState, useEffect, useRef } from "react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import ChatBubble from "./ChatBubble";
import ChatHeader from "./ChatHeader";
import ChatInput from "./ChatInput";
import { useSelector, useDispatch } from "react-redux";
import axiosInstance from "@/utils/axiosInstance";
import { setConversation } from "@/redux/slices/chat.slice";
import socket from "@/utils/Socket";

const ChatContainer = ({ className = "" }) => {
  const chatRef = useRef(null);
  const selectedUser = useSelector((state) => state.chat.selectedUser);
  const rawMessages = useSelector(
    (state) => state.chat.conversations?.[selectedUser?._id]
  );
  const messages = rawMessages || [];
  const user = useSelector(state => state.user.user);

  const [isTyping, setIsTyping] = useState(false);

  const dispatch = useDispatch();

  const typingTimeoutRef = useRef(null);

  const handleTyping = () => {
    console.log("This trigerreddd!!!");
    socket.emit("typing", { to: selectedUser._id });

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("stop_typing", { to: selectedUser._id });
    }, 2000);
  };

  useEffect(() => {
    const fetchMessages = async () => {
      const { data } = await axiosInstance(
        `/messages/get-messages/${selectedUser?._id}`
      );
      console.log("Response of fetch messages: ", data.data);
      dispatch(
        setConversation({ userId: selectedUser?._id, messages: data.data })
      );
    };

    if (selectedUser) {
      socket.emit("mark_seen", {
        conversationId: selectedUser?.conversationId,
      });
    }

    socket.on("typing", ({ from }) => {
      if (from === user?._id) setIsTyping(true);
    });

    socket.on("stop_typing", ({ from }) => {
      if (from === user_id) setIsTyping(false);
    });
    selectedUser && fetchMessages();

    return () => {
      socket.off("typing");
      socket.off("stop_typing");
    };
  }, [selectedUser]);

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

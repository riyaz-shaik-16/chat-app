import { useState, useEffect, useRef } from "react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import ChatBubble from "./ChatBubble";
import ChatHeader from "./ChatHeader";
import ChatInput from "./ChatInput";
import { useSelector } from "react-redux";

const ChatContainer = ({className = "" }) => {
  const chatRef = useRef(null);
  const selectedUser = useSelector((state) => state.chat.selectedUser);
  const rawMessages = useSelector((state) => state.chat.conversations?.[selectedUser]);
  const messages = rawMessages || []

  const [message, setMessage] = useState("");


  const handleSend = () => {}

  // const messages = [
  //   { user: "You", content: "Hey, are you coming to the meeting?" },
  //   { user: "no", content: "Give me 5 mins, wrapping up another call." },
  //   { user: "You", content: "Alright, I'll wait. Don't be too late though." },
  //   {
  //     user: "no",
  //     content:
  //       "Yeah yeah, I won't. Just need to send a quick report. Also, did you check the bug on login?",
  //   },
  //   {
  //     user: "You",
  //     content: "Oh right, I saw it. Looks like a token expiry issue.",
  //   },
  //   {
  //     user: "no",
  //     content:
  //       "Exactly. I think the refresh logic isn't triggering. Might be something with the interceptor.",
  //   },
  //   {
  //     user: "You",
  //     content:
  //       "We should probably log the response object and check if the 401 is actually caught.",
  //   },
  //   {
  //     user: "no",
  //     content:
  //       "Yep, doing that now. Btw, should we roll back to the old auth flow temporarily?",
  //   },
  //   {
  //     user: "You",
  //     content: "Nah, let's patch it. Rollback might break mobile clients.",
  //   },
  //   { user: "no", content: "Alright then. On it. Meet you in 3." },
  //   { user: "You", content: "Cool. Bring coffee." },
  // ];

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
            </div>
          </ScrollArea>

          <ChatInput onSend={handleSend} />
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

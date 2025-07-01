import { useState, useEffect } from "react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import Socket from "@/utils/Socket"
import ChatBubble from "./ChatBubble";



const ChatContainer = ({selectedUser = null}) => {
  return (
    <>
      {selectedUser ? (
        // <h1>Chat Container</h1>
        <div className="">
          <ScrollArea className="h-[90%] pr-4">
            <div className="w-full">
              <ChatBubble message={{ user: "You", content: "First Message" }} />
              <ChatBubble
                message={{
                  user: "no",
                  content:
                    "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Id laudantium, unde illo soluta perspiciatis laborum ipsam ducimus repudiandae vero expedita fuga assumenda facere laboriosam aliquid tempora suscipit, magnam dicta animi?",
                }}
              />
              <ChatBubble message={{ user: "You", content: "First Message" }} />
              <ChatBubble
                message={{
                  user: "no",
                  content:
                    "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Id laudantium, unde illo soluta perspiciatis laborum ipsam ducimus repudiandae vero expedita fuga assumenda facere laboriosam aliquid tempora suscipit, magnam dicta animi?",
                }}
              />
              <ChatBubble message={{ user: "You", content: "First Message" }} />
              <ChatBubble
                message={{
                  user: "no",
                  content:
                    "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Id laudantium, unde illo soluta perspiciatis laborum ipsam ducimus repudiandae vero expedita fuga assumenda facere laboriosam aliquid tempora suscipit, magnam dicta animi?",
                }}
              />
              <ChatBubble message={{ user: "You", content: "First Message" }} />
              <ChatBubble
                message={{
                  user: "no",
                  content:
                    "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Id laudantium, unde illo soluta perspiciatis laborum ipsam ducimus repudiandae vero expedita fuga assumenda facere laboriosam aliquid tempora suscipit, magnam dicta animi?",
                }}
              />
              <ChatBubble message={{ user: "You", content: "First Message" }} />
              <ChatBubble
                message={{
                  user: "no",
                  content:
                    "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Id laudantium, unde illo soluta perspiciatis laborum ipsam ducimus repudiandae vero expedita fuga assumenda facere laboriosam aliquid tempora suscipit, magnam dicta animi?",
                }}
              />
              <ChatBubble message={{ user: "You", content: "First Message" }} />
              <ChatBubble
                message={{
                  user: "no",
                  content:
                    "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Id laudantium, unde illo soluta perspiciatis laborum ipsam ducimus repudiandae vero expedita fuga assumenda facere laboriosam aliquid tempora suscipit, magnam dicta animi?",
                }}
              />
              <ChatBubble message={{ user: "You", content: "First Message" }} />
              <ChatBubble
                message={{
                  user: "no",
                  content:
                    "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Id laudantium, unde illo soluta perspiciatis laborum ipsam ducimus repudiandae vero expedita fuga assumenda facere laboriosam aliquid tempora suscipit, magnam dicta animi?",
                }}
              />
              <ChatBubble message={{ user: "You", content: "First Message" }} />
              <ChatBubble
                message={{
                  user: "no",
                  content:
                    "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Id laudantium, unde illo soluta perspiciatis laborum ipsam ducimus repudiandae vero expedita fuga assumenda facere laboriosam aliquid tempora suscipit, magnam dicta animi?",
                }}
              />
              <ChatBubble message={{ user: "You", content: "First Message" }} />
              <ChatBubble
                message={{
                  user: "no",
                  content:
                    "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Id laudantium, unde illo soluta perspiciatis laborum ipsam ducimus repudiandae vero expedita fuga assumenda facere laboriosam aliquid tempora suscipit, magnam dicta animi?",
                }}
              />
              <ChatBubble message={{ user: "You", content: "First Message" }} />
              <ChatBubble
                message={{
                  user: "no",
                  content:
                    "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Id laudantium, unde illo soluta perspiciatis laborum ipsam ducimus repudiandae vero expedita fuga assumenda facere laboriosam aliquid tempora suscipit, magnam dicta animi?",
                }}
              />
            </div>
            <ScrollBar className="pl-4" />
          </ScrollArea>
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
    </>
  );
};

export default ChatContainer;

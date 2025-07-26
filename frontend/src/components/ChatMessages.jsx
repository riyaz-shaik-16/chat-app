import { useEffect, useMemo, useRef } from "react";
import moment from "moment";
import { Check, CheckCheck } from "lucide-react";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

const ChatMessages = ({ selectedUser, messages, loggedInUser }) => {
  const bottomRef = useRef(null);

  const uniqueMessages = useMemo(() => {
    if (!messages) return [];
    const seen = new Set();
    return messages.filter((message) => {
      if (seen.has(message._id)) return false;
      seen.add(message._id);
      return true;
    });
  }, [messages]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [selectedUser, uniqueMessages]);

  return (
    <div className="flex-1 overflow-hidden">
      <ScrollArea className="h-full max-h-[calc(100vh-215px)] px-4 py-2">
        {!selectedUser ? (
          <p className="text-muted-foreground text-center mt-20">
            Please select a user to start chatting 📩
          </p>
        ) : (
          <div className="space-y-4">
            {uniqueMessages.map((msg, index) => {
              const isSentByMe = msg.sender === loggedInUser?._id;
              const key = `${msg._id}-${index}`;

              return (
                <div
                  key={key}
                  className={`flex flex-col gap-1 mt-2 ${
                    isSentByMe ? "items-end" : "items-start"
                  }`}
                >
                  <Card
                    className={`${msg.messageType === "image" ? "pt-0 px-0 py-0 border-0" : "px-4 py-3"}  max-w-sm text-sm ${
                      isSentByMe
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-foreground"
                    }`}
                  >
                    {msg.messageType === "image" && msg.image && (
                      <img
                        src={msg.image.url}
                        alt="shared"
                        className="max-w-full h-auto rounded"
                      />
                    )}
                    {msg.text && <p className="mt-1 break-words whitespace-pre-wrap">{msg.text}</p>}
                  </Card>

                  <div
                    className={`flex items-center gap-1 text-xs text-muted-foreground ${
                      isSentByMe ? "pr-2 flex-row-reverse" : "pl-2"
                    }`}
                  >
                    <span>{moment(msg.createdAt).format("hh:mm A . MMM D")}</span>
                    {isSentByMe && (
                      <div className="flex items-center ml-1">
                        {msg.seen ? (
                          <div className="flex items-center gap-1 text-blue-400">
                            Seen At: 
                            <CheckCheck className="w-3 h-3" />
                            {msg.seenAt && (
                              <span>{moment(msg.seenAt).format("hh:mm A")}</span>
                            )}
                          </div>
                        ) : (
                          <Check className="w-3 h-3 text-gray-500" />
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
            <div ref={bottomRef} />
          </div>
        )}
      </ScrollArea>
    </div>
  );
};

export default ChatMessages;

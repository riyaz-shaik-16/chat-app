import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { SendHorizonal } from "lucide-react";
import socket from "@/utils/Socket";
import { useDispatch, useSelector } from "react-redux";
import { addMessage, updateLastMessage } from "@/redux/slices/chat.slice";

const ChatInput = ({handleTyping = () => {}}) => {
  const [message, setMessage] = useState("");
  const textareaRef = useRef(null);
  const dispatch = useDispatch();
  const selectedUser = useSelector((state) => state.chat.selectedUser);
  const user = useSelector(state => state.user.user);

  useEffect(() => {
    socket.on("receive_message", (payload) => {
      console.log("Message Received: ")
      dispatch(addMessage({ message: payload, myId:user?._id })); 
      dispatch(
      updateLastMessage({ content: payload.message.content.trim(), timestamp: new Date().toISOString(),type:"text",senderId:payload.message.from,id:payload.message.to})
    );
    });

    socket.on("message_sent", (payload) => {
      dispatch(addMessage({ message: payload, myId:user?._id }));
    });

    return () => {
      socket.off("receive_message");
      socket.off("message_sent");
    };
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    socket.emit("send_message", {
      to: selectedUser?._id,
      content: message.trim(),
    });
    dispatch(
      updateLastMessage({ content: message.trim(), timestamp: new Date().toISOString(),type:"text",senderId:user?._id,id:selectedUser._id})
    );
    setMessage("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      handleSubmit(e);
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;

      if (textareaRef.current.scrollHeight > 100) {
        textareaRef.current.style.overflowY = "auto";
        textareaRef.current.style.height = "100px";
      } else {
        textareaRef.current.style.overflowY = "hidden";
      }
    }
  }, [message]);

  return (
    <div className="w-full p-4">
      <form onSubmit={handleSubmit} className="flex items-end gap-3">
        <Textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => {setMessage(e.target.value);handleTyping()}}
          onKeyDown={handleKeyDown}
          className="resize-none border rounded-xl min-h-[100px] max-h-36 py-3"
          placeholder="Type a message..."
          rows={1}
        />
        <Button
          type="submit"
          size="icon"
          className="h-11 w-11 flex-shrink-0"
          disabled={!message.trim()}
        >
          <SendHorizonal className="h-5 w-5" />
        </Button>
      </form>
    </div>
  );
};

export default ChatInput;

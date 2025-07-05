import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { SendHorizonal } from "lucide-react";
import { useSelector } from "react-redux";
import { selectUserInfo } from "@/redux/slices/user.slice";

const ChatInput = ({ handleTyping = () => {} }) => {
  const [message, setMessage] = useState("");
  const textareaRef = useRef(null);
  const user = useSelector(selectUserInfo);

  

  const handleSubmit = (e) => {
    e.preventDefault();
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
          onChange={(e) => {
            setMessage(e.target.value);
            handleTyping();
          }}
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

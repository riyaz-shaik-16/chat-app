import { Card, CardFooter, CardContent } from "./ui/card";
import { useSelector } from "react-redux";

const ChatBubble = ({ message }) => {

  const selectedUser = useSelector((state) => state.chat.selectedUser);

  return (
    <Card
      className={`w-fit h-fit mt-3 mb-3 max-w-[75%] ${
        message.from !== selectedUser._id
          ? "ml-auto bg-primary-foreground text-dark"
          : "bg-muted"
      }`}
    >
      <CardContent className="">
        <p className="text-sm">{message.content}</p>
      </CardContent>
      <CardFooter>
        <p
          className={`text-[10px] ${
            message.from !== selectedUser._id ? "text-left" : "text-right"
          }`}
        >
          {new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          })}
        </p>
      </CardFooter>
    </Card>
  );
};

export default ChatBubble;

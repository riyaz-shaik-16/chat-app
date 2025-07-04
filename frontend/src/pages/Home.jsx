import { LeftSideBar, ChatContainer } from "../components";
import socket from "@/utils/Socket";
import { useEffect } from "react";
import { useSelector } from "react-redux";

const Home = () => {

  const {user} = useSelector(s => s.user)
  
  useEffect(() => {

    socket.connect();

    socket.on("message_sent", (payload) => {
      dispatch(addMessage({ message: payload, myId: user?._id }));
      dispatch(
        updateLastMessage({
          content: payload.content.trim(),
          timestamp: payload.timestamp,
          type: payload.type,
          senderId: payload.from,
          id: payload.to,
        })
      );
    });

    return () => {
      socket.disconnect();
      socket.off("message_sent");
    };
  }, []);

  return (
    <div className="flex h-screen">
      <LeftSideBar/>
      <ChatContainer className={`flex-1`}/>
    </div>
  );
};

export default Home;

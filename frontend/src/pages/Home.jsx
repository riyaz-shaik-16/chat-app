import { LeftSideBar, ChatContainer } from "../components";
import socket from "@/utils/Socket";
import { useEffect } from "react";

const Home = () => {
  
  useEffect(() => {
    socket.connect();
    return () => {
      socket.disconnect();
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

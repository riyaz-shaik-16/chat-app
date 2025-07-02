import { LeftSideBar, ChatContainer } from "../components";
import socket from "@/utils/Socket";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

// import {Button} from "../components/ui/button"

const Home = () => {
  const { user } = useSelector((state) => state.user);
  

  useEffect(() => {
    socket.connect();
    socket.emit("register", user?.email);

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

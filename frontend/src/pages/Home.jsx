import { useEffect } from "react";
import { LeftSideBar, ChatContainer } from "../components";
import socket from "@/utils/Socket";
import { useDispatch } from "react-redux";
import { setOnlineUsers } from "@/redux/slices/presence.slice";

const Home = () => {
  const dispatch =  useDispatch();
  useEffect(() => {
    socket.connect();
    socket.on("online_users_list",(data)=>{
      dispatch(setOnlineUsers(data));
    })

    return () => {
      socket.disconnect();
      socket.off("online_users_list")
    };
  });
  return (
    <div className="flex h-screen">
      <LeftSideBar />
      <ChatContainer className={`flex-1`} />
    </div>
  );
};

export default Home;

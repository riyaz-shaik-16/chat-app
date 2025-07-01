import { LeftSideBar, ChatContainer } from "../components";
import socket from "@/utils/Socket";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

// import {Button} from "../components/ui/button"

const Home = () => {
  const { user } = useSelector((state) => state.user);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    socket.connect();
    socket.emit("register", user?.email);

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div className="flex h-screen">
      <LeftSideBar
        setSelectedUser={setSelectedUser}
        selectedUser={selectedUser}
      />
      <ChatContainer selectedUser={selectedUser} />
    </div>
  );
};

export default Home;

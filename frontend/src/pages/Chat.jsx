import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import toast from "react-hot-toast";

import { chat_service, useAppData } from "../context/AppContext.jsx";
import { SocketData } from "../context/SocketContext.jsx";

import Loading from "../components/Loading";
import ChatSidebar from "../components/ChatSideBar.jsx";
import ChatHeader from "../components/ChatHeader.jsx";
import ChatMessages from "../components/ChatMessages.jsx";
import MessageInput from "../components/MessageInput.jsx";

const ChatApp = () => {
  const {
    loading,
    isAuth,
    logoutUser,
    chats,
    user: loggedInUser,
    users,
    fetchChats,
    setChats,
  } = useAppData();

  const { onlineUsers, socket } = SocketData();
  const navigate = useNavigate();

  const [selectedUser, setSelectedUser] = useState(null);
  const [message, setMessage] = useState("");
  const [siderbarOpen, setSiderbarOpen] = useState(false);
  const [messages, setMessages] = useState(null);
  const [user, setUser] = useState(null);
  const [showAllUser, setShowAllUser] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [typingTimeOut, setTypingTimeOut] = useState(null);

  useEffect(() => {
    if (!isAuth && !loading) navigate("/login");
  }, [isAuth, loading, navigate]);

  const handleLogout = () => logoutUser();

  const fetchChat = async () => {
    const token = Cookies.get("token");
    try {
      const { data } = await axios.get(`${chat_service}/api/v1/message/${selectedUser}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // console.log("Data in fetching chat details: ",data);
      setMessages(data.messages);
      setUser(data.user);
      await fetchChats();
    } catch (error) {
      toast.error("Failed to load messages");
    }
  };

  const moveChatToTop = (chatId, newMessage, updatedUnseenCount = true) => {
    setChats((prev) => {
      if (!prev) return null;
      const updatedChats = [...prev];
      const index = updatedChats.findIndex((chat) => chat.chat._id === chatId);
      if (index !== -1) {
        const [chatItem] = updatedChats.splice(index, 1);
        const unseen =
          updatedUnseenCount && newMessage.sender !== loggedInUser?._id
            ? (chatItem.chat.unseenCount || 0) + 1
            : chatItem.chat.unseenCount || 0;
        updatedChats.unshift({
          ...chatItem,
          chat: {
            ...chatItem.chat,
            latestMessage: newMessage,
            updatedAt: new Date().toString(),
            unseenCount: unseen,
          },
        });
      }
      return updatedChats;
    });
  };

  const resetUnseenCount = (chatId) => {
    setChats((prev) =>
      prev?.map((chat) =>
        chat.chat._id === chatId
          ? { ...chat, chat: { ...chat.chat, unseenCount: 0 } }
          : chat
      )
    );
  };

  const createChat = async (u) => {
    try {
      const token = Cookies.get("token");
      const { data } = await axios.post(
        `${chat_service}/api/v1/chat/new`,
        { userId: loggedInUser?._id, otherUserId: u._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSelectedUser(data.chatId);
      setShowAllUser(false);
      await fetchChats();
    } catch {
      toast.error("Failed to start chat");
    }
  };

  const handleMessageSend = async (e, imageFile) => {
    e.preventDefault();
    if (!message.trim() && !imageFile) return;
    if (!selectedUser) return;

    clearTimeout(typingTimeOut);
    setTypingTimeOut(null);

    socket?.emit("stopTyping", { chatId: selectedUser, userId: loggedInUser?._id });

    const token = Cookies.get("token");
    const formData = new FormData();
    formData.append("chatId", selectedUser);
    if (message.trim()) formData.append("text", message);
    if (imageFile) formData.append("image", imageFile);

    try {
      const { data } = await axios.post(`${chat_service}/api/v1/message`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setMessages((prev) =>
        prev?.some((msg) => msg._id === data.message._id)
          ? prev
          : [...(prev || []), data.message]
      );

      setMessage("");

      moveChatToTop(selectedUser, {
        text: imageFile ? "📷 image" : message,
        sender: data.sender,
      }, false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Message send failed");
    }
  };

  const handleTyping = (value) => {
    setMessage(value);
    if (!selectedUser || !socket || !value.trim()) return;

    socket.emit("typing", { chatId: selectedUser, userId: loggedInUser?._id });

    clearTimeout(typingTimeOut);
    const timeout = setTimeout(() => {
      socket.emit("stopTyping", { chatId: selectedUser, userId: loggedInUser?._id });
    }, 2000);

    setTypingTimeOut(timeout);
  };

  useEffect(() => {
    if (!socket) return;

    socket.on("newMessage", (message) => {
      if (selectedUser === message.chatId) {
        setMessages((prev) =>
          prev?.some((msg) => msg._id === message._id) ? prev : [...(prev || []), message]
        );
        moveChatToTop(message.chatId, message, false);
      } else {
        moveChatToTop(message.chatId, message, true);
      }
    });

    socket.on("messagesSeen", ({ chatId, messageIds }) => {
      if (selectedUser !== chatId) return;
      setMessages((prev) =>
        prev?.map((msg) =>
          msg.sender === loggedInUser?._id && (!messageIds || messageIds.includes(msg._id))
            ? { ...msg, seen: true, seenAt: new Date().toString() }
            : msg
        ) || null
      );
    });

    socket.on("userTyping", ({ chatId, userId }) => {
      if (chatId === selectedUser && userId !== loggedInUser?._id) setIsTyping(true);
    });

    socket.on("userStoppedTyping", ({ chatId, userId }) => {
      if (chatId === selectedUser && userId !== loggedInUser?._id) setIsTyping(false);
    });

    return () => {
      socket.off("newMessage");
      socket.off("messagesSeen");
      socket.off("userTyping");
      socket.off("userStoppedTyping");
    };
  }, [socket, selectedUser, loggedInUser?._id]);

  useEffect(() => {
    if (!selectedUser) return;
    fetchChat();
    setIsTyping(false);
    resetUnseenCount(selectedUser);
    socket?.emit("joinChat", selectedUser);
    return () => {
      socket?.emit("leaveChat", selectedUser);
      setMessages(null);
    };
  }, [selectedUser]);

  useEffect(() => () => clearTimeout(typingTimeOut), [typingTimeOut]);

  if (loading) return <Loading />;

  return (
    <div className="min-h-screen flex bg-background text-foreground overflow-hidden">
      <ChatSidebar
        sidebarOpen={siderbarOpen}
        setSidebarOpen={setSiderbarOpen}
        showAllUsers={showAllUser}
        setShowAllUsers={setShowAllUser}
        users={users}
        loggedInUser={loggedInUser}
        chats={chats}
        selectedUser={selectedUser}
        setSelectedUser={setSelectedUser}
        handleLogout={handleLogout}
        createChat={createChat}
        onlineUsers={onlineUsers}
      />

      <div className="flex-1 flex flex-col border-l">
        {<ChatHeader
          sidebarOpen={siderbarOpen}
          user={user}
          setSidebarOpen={setSiderbarOpen}
          isTyping={isTyping}
          onlineUsers={onlineUsers}
        />}

          <ChatMessages
            selectedUser={selectedUser}
            messages={messages}
            loggedInUser={loggedInUser}
          />

        <div className="p-4">
          <MessageInput
            selectedUser={selectedUser}
            message={message}
            setMessage={handleTyping}
            handleMessageSend={handleMessageSend}
          />
        </div>
      </div>
    </div>
  );
};

export default ChatApp;

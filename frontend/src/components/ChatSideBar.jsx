import {
  LogOut,
  MessageCircle,
  Plus,
  Search,
  UserCircle,
  X,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ModeToggle } from "./mode-toggle";

const ChatSidebar = ({
  sidebarOpen,
  setShowAllUsers,
  setSidebarOpen,
  showAllUsers,
  users,
  loggedInUser,
  chats,
  selectedUser,
  setSelectedUser,
  handleLogout,
  createChat,
  onlineUsers,
}) => {
  const [searchQuery, setSearchQuery] = useState("");

  // users?.map((u)=>console.log(u.name));
  console.log("Chats: ", chats);
  return (
    <aside
      className={`fixed z-20 sm:static top-0 left-0 h-screen w-80 bg-background border-r transition-transform duration-300 flex flex-col ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      } sm:translate-x-0`}
    >
      {/* Header */}
      <div className="p-4 border-b">
        <div className="sm:hidden flex justify-end mb-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="w-5 h-5" />
          </Button>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-bold">
              {showAllUsers ? "New Chat" : "Messages"}
            </h2>
          </div>
          <Button
            size="icon"
            className={`${
              showAllUsers
                ? "bg-red-600 hover:bg-red-700"
                : "bg-green-600 hover:bg-green-700"
            } cursor-pointer`}
            onClick={() => setShowAllUsers((prev) => !prev)}
          >
            {showAllUsers ? (
              <X className="w-4 h-4 text-primary " />
            ) : (
              <Plus className="w-4 h-4 text-primary" />
            )}
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden px-4 py-2">
        {showAllUsers ? (
          <div className="space-y-4 h-full">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search Users..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="space-y-2 overflow-y-auto h-full pb-4">
              {users
                ?.filter(
                  (u) =>
                    u._id !== loggedInUser?._id &&
                    u.name.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .map((u) => (
                  <Card
                    key={u._id}
                    className="p-4 hover:bg-muted cursor-pointer"
                    onClick={() => createChat(u)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <UserCircle className="w-6 h-6 text-muted-foreground" />
                        {onlineUsers.includes(u._id) && (
                          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-green-500 border-2 border-background" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="font-medium text-foreground">
                          {u.name}
                        </span>
                        <p className="text-xs text-muted-foreground">
                          {onlineUsers.includes(u._id) ? "Online" : "Offline"}
                        </p>
                      </div>
                    </div>
                  </Card>
                ))}
            </div>
          </div>
        ) : chats && chats.length > 0 ? (
          <div className="space-y-2 overflow-y-auto h-full pb-4">
            {chats.map((chat) => {
              const latestMessage = chat.chat.latestMessage;
              const messageType = chat.chat.latestMessage.messageType;
              const isSelected = selectedUser === chat.chat._id;
              const isSentByMe = latestMessage?.sender === loggedInUser?._id;
              const unseenCount = chat.chat.unseenCount || 0;

              return (
                <Card
                  key={chat.chat._id}
                  className={`p-4 cursor-pointer ${
                    isSelected ? "bg-secondary" : "hover:bg-muted"
                  }`}
                  onClick={() => {
                    console.log("Selecte chat: ", chat);
                    setSelectedUser(chat.chat._id);
                    setSidebarOpen(false);
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                        <UserCircle className="w-6 h-6 text-muted-foreground" />
                      </div>
                      {onlineUsers.includes(chat.user._id) && (
                        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-green-500 border-2 border-background" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold truncate">
                          {chat.user.name}
                        </span>
                        {unseenCount > 0 && (
                          <div className="bg-red-600 text-white text-xs font-bold rounded-full min-w-[22px] h-5.5 flex items-center justify-center px-2">
                            {unseenCount > 99 ? "99+" : unseenCount}
                          </div>
                        )}
                      </div>
                      {latestMessage && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          {isSentByMe ? "You:" : null}
                          {messageType === "image" && "📷 Image"}
                          <span className="truncate flex-1">
                            {latestMessage.text}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="p-4 bg-muted rounded-full mb-4">
              <MessageCircle className="w-8 h-8 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground font-medium">
              No conversation yet
            </p>
            <p className="text-sm text-muted-foreground/70 mt-1">
              Start a new chat to begin messaging
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t space-y-2">
        <div className="px-3">
          <ModeToggle/>
        </div>
        <Link
          to="/profile"
          className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-muted"
        >
          <div className="p-1.5 bg-muted-foreground/10 rounded-lg">
            <UserCircle className="w-4 h-4 text-muted-foreground" />
          </div>
          <span className="font-medium text-foreground">Profile</span>
        </Link>

        <Button
          variant="ghost"
          className="w-full px-4 py-4 inline-flex justify-start cursor-pointer text-red-600 hover:text-white hover:bg-red-600"
          onClick={handleLogout}
        >
          <div className="p-1.5 bg-red-600 rounded-lg">
            <LogOut className="w-4 h-5 text-white" />
          </div>
          <span className="font-medium">Logout</span>
        </Button>
      </div>
    </aside>
  );
};

export default ChatSidebar;

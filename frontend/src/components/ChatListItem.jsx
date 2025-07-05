import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { SidebarMenuItem } from "./ui/sidebar";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { setSelectedChat } from "@/redux/slices/chat.slice";
import { selectOnlineUsers } from "@/redux/slices/presence.slice";

const ChatListItem = ({ user, className = "" }) => {
  const dispatch = useDispatch();
  const onlineUsers = useSelector(selectOnlineUsers);
  return (
    <SidebarMenuItem
      key={user?._id}
      onClick={() => dispatch(setSelectedChat(user))}
    >
      <button
        className={`w-full flex items-center gap-3 px-2 py-2 rounded-md hover:bg-muted transition-colors ${className}`}
      >
        <div className="relative w-fit">
          <Avatar className="h-12 w-12">
            <AvatarImage src={user?.picture} />
            <AvatarFallback>{user?.name[0]}</AvatarFallback>
          </Avatar>

          {onlineUsers?.length > 0 && onlineUsers?.includes(user?._id) && (
            <Badge
              className="absolute top-0 right-0 h-3 w-3 p-0 bg-green-500 rounded-full"
              variant="default"
            />
          )}
        </div>

        <div className="flex-1 text-left overflow-hidden">
          <p className="text-sm font-medium text-foreground truncate">
            {user?.name}
          </p>
          <p className="text-xs text-muted-foreground truncate">
            {user?.lastMessage?.content || ""}
          </p>
        </div>

        <span className="flex items-center gap-1 text-xs text-muted-foreground whitespace-nowrap">
          {user?.unreadCount > 0 && (
            <Badge
              className="h-4 px-1 py-0 text-[10px] bg-green-500 rounded-full"
              variant="default"
            >
              {user.unreadCount}
            </Badge>
          )}
          {user?.lastMessage &&
            new Date(user.lastMessage.timestamp).toLocaleTimeString("en-GB", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
            })}
        </span>
      </button>
    </SidebarMenuItem>
  );
};

export default ChatListItem;

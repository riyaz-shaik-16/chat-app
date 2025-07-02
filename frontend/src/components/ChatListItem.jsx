import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { SidebarMenuItem } from "./ui/sidebar";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { Badge } from "./ui/badge";
import {selectUser} from "@/redux/slices/chat.slice"

const ChatListItem = ({ user,className=""}) => {
  const onlineUsers = useSelector((state) => state.chat.onlineUsers);
  const dispatch = useDispatch();
  return (
    <SidebarMenuItem key={user?.email} onClick={() => dispatch(selectUser(user))}>
      <button className={`w-full flex items-center gap-3 px-2 py-2 rounded-md hover:bg-muted transition-colors ${className}`}>
        <div className="relative w-fit">
          <Avatar className="h-12 w-12">
            <AvatarImage src={user?.picture} />
            <AvatarFallback>{user?.fullName[0]}</AvatarFallback>
          </Avatar>

          {onlineUsers.includes(user?.email) && (
            <Badge
              className="absolute top-0 right-0 h-3 w-3 p-0 bg-green-500 rounded-full"
              variant="default"
            />
          )}
        </div>

        <div className="flex-1 text-left overflow-hidden">
          <p className="text-sm font-medium text-foreground truncate">
            {user?.fullName}
          </p>
          <p className="text-xs text-muted-foreground truncate">
            Sure, I’ll ping you at 5...
          </p>
        </div>
        <span className="text-xs text-muted-foreground whitespace-nowrap">
          8:32 PM
        </span>
      </button>
    </SidebarMenuItem>
  );
};

export default ChatListItem;

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { selectOnlineUsers } from "@/redux/slices/presence.slice";
import { MoreVertical } from "lucide-react";
import { useSelector } from "react-redux";

const ChatHeader = ({ user }) => {

  const onlineUsers = useSelector(selectOnlineUsers);
  return (
    <div className="w-full fixed top-0 z-1 flex items-center justify-between border-b px-4 py-3 bg-background">
      <div className="flex items-center gap-4">
        <div className="relative">
          <Avatar className="h-10 w-10">
            <AvatarImage src={user?.picture} alt={user?.name} />
            <AvatarFallback>{user?.name?.[0] ?? "U"}</AvatarFallback>
          </Avatar>
          {onlineUsers?.length > 0 && onlineUsers?.includes(user?._id) && (
            <Badge className="absolute bottom-0 right-0 h-3 w-3 p-0 rounded-full bg-green-500 border-2 border-background" />
          )}
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-medium">{user?.name}</span>
          <span className="text-xs text-muted-foreground">
            {onlineUsers?.length > 0 && onlineUsers?.includes(user?._id) ? "Online" : "Offline"}
          </span>
        </div>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="icon" variant="ghost">
            <MoreVertical className="h-5 w-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>View Profile</DropdownMenuItem>
          <DropdownMenuItem>Mute</DropdownMenuItem>
          <DropdownMenuItem>Block</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default ChatHeader;

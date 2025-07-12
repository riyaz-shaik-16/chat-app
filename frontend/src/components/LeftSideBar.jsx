import { useEffect, useState } from "react";
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarProvider,
  SidebarTrigger,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Moon, Sun } from "lucide-react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useTheme } from "@/components/theme-provider";
import ProfileDialog from "./ProfileDialog";
import Logout from "./Logout";
import ChatListItem from "./ChatListItem";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchChatUsers,
  selectChatUsers,
  selectSidebarLoading,
  updateLastMessage,
} from "@/redux/slices/chat.slice";
import { selectSelectedChat } from "@/redux/slices/chat.slice";
import { selectUserInfo } from "@/redux/slices/user.slice";
import socket from "@/utils/Socket";

const LeftSideBar = ({}) => {
  const { setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();

  const chatUsers = useSelector(selectChatUsers);
  const loading = useSelector(selectSidebarLoading);
  const selectedUser = useSelector(selectSelectedChat);
  const user = useSelector(selectUserInfo);

  useEffect(() => {
    
  },[]);

  useEffect(() => {
    dispatch(fetchChatUsers());
  }, [dispatch]);

  if (loading) return <h1>Loadingg...</h1>;

  return (
    <SidebarProvider>
      <SidebarTrigger />
      <Sidebar>
        <SidebarHeader>
          <Input placeholder="Search chats..." className="rounded-md" />
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Chats</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <ScrollArea className="h-[calc(100vh-160px)] pr-3">
                  {chatUsers.length > 0 &&
                    chatUsers?.map((user) => (
                      <ChatListItem
                        key={user._id}
                        user={user}
                        className={`${
                          selectedUser?._id === user?._id ? "bg-muted" : null
                        }`}
                      ></ChatListItem>
                    ))}
                  <ScrollBar />
                </ScrollArea>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
          <SidebarFooter>
            <Dialog open={open} onOpenChange={setOpen}>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="secondary">Settings</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="start">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuGroup>
                    <ProfileDialog user={user} />
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuSub>
                      <DropdownMenuSubTrigger>Theme</DropdownMenuSubTrigger>
                      <DropdownMenuPortal>
                        <DropdownMenuSubContent>
                          <DropdownMenuItem onClick={() => setTheme("light")}>
                            Light{" "}
                            <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setTheme("dark")}>
                            Dark{" "}
                            <Moon className=" h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => setTheme("system")}>
                            System
                          </DropdownMenuItem>
                        </DropdownMenuSubContent>
                      </DropdownMenuPortal>
                    </DropdownMenuSub>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuSeparator />
                  <Logout />
                </DropdownMenuContent>
              </DropdownMenu>
            </Dialog>
          </SidebarFooter>
        </SidebarContent>
      </Sidebar>
    </SidebarProvider>
  );
};

export default LeftSideBar;

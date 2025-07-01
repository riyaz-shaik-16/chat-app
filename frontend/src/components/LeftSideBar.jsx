import { useState, useEffect } from "react";
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
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axiosInstance from "@/utils/axiosInstance";
import { setUser, logout } from "@/redux/slices/user.slice";
import Logout from "./Logout";
import { setOnlineUsers, setUsers } from "@/redux/slices/users.slice";
import socket from "@/utils/Socket";
import ChatListItem from "./ChatListItem";

const LeftSideBar = ({ selectedUser, setSelectedUser = () => {} }) => {
  const { setTheme } = useTheme();
  const [open, setOpen] = useState(false);

  const user = useSelector((state) => state.user?.user);
  const { users } = useSelector((state) => state.users);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [usersListLoading, setUsersListLoading] = useState(false);
  const { onlineUsers } = useSelector((state) => state.users);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const { data } = await axiosInstance.get("/auth/profile");
      dispatch(setUser(data.data));
    } catch (err) {
      console.log("Error: ", err);
      dispatch(logout());
      toast.error("Internal Server Error!");
      navigate("/login");
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      setUsersListLoading(true);
      const { data } = await axiosInstance.get("/auth/getUsers");
      const { data: users } = data;
      dispatch(setUsers(users));
    } catch (err) {
      console.log("Error: ", err);
      dispatch(logout());
      toast.error("Internal Server Error!");
      navigate("/login");
    } finally {
      setUsersListLoading(false);
    }
  };

  const handleOnlineUsers = (onlineUsers) => {
    // console.log("Online users: ",onlineUsers)
    dispatch(setOnlineUsers(onlineUsers));
  };

  useEffect(() => {
    fetchProfile();
    fetchUsers();

    socket.on("online_users_list", handleOnlineUsers);

    return () => {
      socket.off("online_users_list", handleOnlineUsers);
    };
  }, [dispatch, selectedUser]);

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
                  {users.length > 0 &&
                    users?.map((user) => (
                      <ChatListItem
                        key={user.email}
                        onSelectUser={setSelectedUser}
                        user={user}
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

import { Menu, UserCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const ChatHeader = ({ user, setSidebarOpen, isTyping, onlineUsers }) => {
  const isOnlineUser = user && onlineUsers.includes(user._id);
  console.log("User in header: ",user);

  return (
    <>
      {/* mobile menu toggle */}
      <div className="sm:hidden fixed top-4 right-4 z-30">
        <Button
          size="icon"
          variant="ghost"
          className="bg-muted hover:bg-muted/80"
          onClick={() => setSidebarOpen(true)}
        >
          <Menu className="w-5 h-5 text-foreground" />
        </Button>
      </div>

      {/* chat header */}
      <Card className="mb-6 border p-6">
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <div className="relative">
                <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center">
                  <UserCircle className="w-8 h-8 text-muted-foreground" />
                </div>
                {isOnlineUser && (
                  <span className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full bg-green-500 border-2 border-background"></span>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1">
                  <h2 className="text-2xl font-bold text-foreground truncate">
                    {user.name}
                  </h2>
                </div>

                <div className="flex items-center gap-2">
                  {isTyping ? (
                    <span className="text-sm font-medium text-primary">
                      typing...
                    </span>
                  ) : (
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          isOnlineUser ? "bg-green-500" : "bg-gray-500"
                        }`}
                      ></div>
                      <span
                        className={`text-sm font-medium ${
                          isOnlineUser ? "text-green-500" : "text-muted-foreground"
                        }`}
                      >
                        {isOnlineUser ? "Online" : "Offline"}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center">
                <UserCircle className="w-8 h-8 text-muted-foreground" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-muted-foreground">
                  Select a conversation
                </h2>
                <p className="text-sm text-muted-foreground/70 mt-1">
                  Choose a chat from the sidebar to start messaging
                </p>
              </div>
            </div>
          )}
        </div>
      </Card>
    </>
  );
};

export default ChatHeader;

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const ProfileCard = ({ user, status = "online" }) => {
  return (
    <div className="h-screen w-full flex justify-center items-center">
      <Card className="w-full max-w-sm mx-auto shadow-xl rounded-2xl">
      <CardHeader className="flex flex-col items-center gap-3">
        <Avatar className="h-20 w-20">
          <AvatarImage src={user?.picture} alt={user?.name} />
          <AvatarFallback>{user?.name}</AvatarFallback>
        </Avatar>
        <CardTitle className="text-xl">{user?.fullName}</CardTitle>
        <Badge variant={status === "online" ? "default" : "outline"}>
          {status}
        </Badge>
      </CardHeader>
      <CardContent className="text-center text-sm text-muted-foreground">
        {user?.email}
        <p>Profile Created at: {new Date(user?.createdAt).toLocaleDateString()}</p>
      </CardContent>
    </Card>
    </div>
  );
};

export default ProfileCard;

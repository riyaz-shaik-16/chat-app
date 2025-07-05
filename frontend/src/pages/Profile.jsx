import ProfileCard from "../components/ProfileCard";
import { useSelector } from "react-redux";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { selectUserInfo, selectUserLoading } from "@/redux/slices/user.slice";

const ProfileSkeleton = () => {
  return (
    <div className="w-full h-screen flex justify-center items-center">
      <Card className="w-full max-w-sm mx-auto shadow-xl rounded-2xl">
        <CardHeader className="flex flex-col items-center gap-3">
          <Skeleton className="h-20 w-20 rounded-full" />
          <Skeleton className="h-6 w-32 rounded" />
          <Skeleton className="h-4 w-20 rounded" />
        </CardHeader>
        <CardContent className="flex justify-center">
          <Skeleton className="h-4 w-48 rounded" />
        </CardContent>
      </Card>
    </div>
  );
};

const Profile = () => {
  const userLoading = useSelector(selectUserLoading);
  const user = useSelector(selectUserInfo);

  console.log("User in profile page: ",user);

  if (userLoading) return <ProfileSkeleton />;

  return (
    <>
      <ProfileCard user={user} />
    </>
  );
};

export default Profile;

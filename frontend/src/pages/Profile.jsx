import ProfileCard from "../components/ProfileCard";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import axiosInstance from "@/utils/axiosInstance";
import { setUser } from "@/redux/slices/user.slice";

const ProfileSkeleton = () => {
  return (
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
  );
};




const Profile = () => {
  const [loading,setLoading] = useState(false);
  const user = useSelector(state => state.user?.user)
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  

  const getData = async () => {
    try {
      setLoading(true);
      const { data } = await axiosInstance.get("/auth/profile");
      dispatch(setUser(data.data));
    } catch (err) {
      console.log("Error: ",err);
      toast.error("Error!")
      navigate("/login")
    } finally {
      setLoading(false);
    }
  }

  useEffect(()=>{
    getData();
  },[])

  if(loading) return <ProfileSkeleton/>

  return (
    <ProfileCard user={user}
    />
  );
};


export default Profile;
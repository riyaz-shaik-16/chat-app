import { useAppData, user_service } from "../context/AppContext";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

import Loading from "../components/Loading";
import { ArrowLeft, Save, User, UserCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

const ProfilePage = () => {
  const { user, isAuth, loading, setUser } = useAppData();
  const [isEdit, setIsEdit] = useState(false);
  const [name, setName] = useState("");
  const navigate = useNavigate();

  const editHandler = () => {
    setIsEdit((prev) => !prev);
    setName(user?.name || "");
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    const token = Cookies.get("token");
    try {
      const { data } = await axios.post(
        `${user_service}/api/v1/update/user`,
        { name },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      Cookies.set("token", data.token, {
        expires: 15,
        secure: false,
        path: "/",
      });
      toast.success(data.message);
      setUser(data.user);
      setIsEdit(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Update failed");
    }
  };

  useEffect(() => {
    if (!isAuth && !loading) navigate("/login");
  }, [isAuth, loading, navigate]);

  if (loading) return <Loading />;

  return (
    <div className="min-h-screen bg-background text-foreground p-6">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="icon" onClick={() => navigate("/chat")}> 
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Profile Settings</h1>
            <p className="text-sm text-muted-foreground">Manage your account information</p>
          </div>
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center gap-4">
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center">
                <UserCircle className="w-12 h-12 text-muted-foreground" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-background" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">{user?.name || "User"}</h2>
              <p className="text-sm text-muted-foreground">Active now</p>
            </div>
          </CardHeader>

          <Separator />

          <CardContent className="pt-6">
            <Label className="text-sm mb-2 block">Display Name</Label>
            {isEdit ? (
              <form onSubmit={submitHandler} className="space-y-4">
                <div className="relative">
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter name"
                  />
                  <User className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                </div>

                <div className="flex gap-3">
                  <Button type="submit" className="flex items-center gap-2">
                    <Save className="w-4 h-4" /> Save Changes
                  </Button>
                  <Button variant="secondary" type="button" onClick={editHandler}>
                    Cancel
                  </Button>
                </div>
              </form>
            ) : (
              <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                <span className="text-base font-medium">{user?.name || "Not set"}</span>
                <Button variant="outline" onClick={editHandler}>
                  Edit
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProfilePage;
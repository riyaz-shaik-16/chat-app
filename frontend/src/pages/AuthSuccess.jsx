import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "@/utils/axiosInstance";
import { useDispatch } from "react-redux";
import { setUser } from "@/redux/slices/user.slice";
import { toast } from "sonner";

const AuthSuccess = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const getData = async () => {
    try {
      setLoading(true);
      const { data } = await axiosInstance.get("/auth/profile");
      console.log(data.data);
      dispatch(setUser(data.data));
      toast.success("Logged in Successfully!");
      navigate("/profile");
    } catch (err) {
      toast.error("Login Failed!");
      navigate("/login");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const token = queryParams.get("token");

    if (token) {
      getData();
    } else {
      toast.error("Token not found in URL");
      navigate("/login");
    }
  }, [navigate]);

  return <p>{loading ? "Fetching profile..." : "Logging you in..."}</p>;
};

export default AuthSuccess;

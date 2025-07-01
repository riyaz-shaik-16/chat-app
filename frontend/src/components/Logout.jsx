import React from "react";
import { DropdownMenuItem } from "./ui/dropdown-menu";
import axiosInstance from "@/utils/axiosInstance";
import { useDispatch } from "react-redux";
import { logout } from "@/redux/slices/user.slice";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const Logout = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const handleLogout = async() => {
        try {
            console.log("logout button clicked!")
            const response = await axiosInstance.post("/auth/logout");
            console.log(response);
            if(response.data.success){
                dispatch(logout());
                toast.success("Logged out successfully!");
                navigate("/login")
            }
        } catch (error) {
            console.log("Error in logout: ",error.message);
            dispatch(logout());
            navigate("/login");
        }
    }
  return <DropdownMenuItem onClick={handleLogout}>Log out</DropdownMenuItem>;
};

export default Logout;

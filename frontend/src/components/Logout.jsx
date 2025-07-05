import React from "react";
import { DropdownMenuItem } from "./ui/dropdown-menu";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { performLogout } from "@/redux/thunks/auth.thunk";

const Logout = () => {
  const dispatch = useDispatch();
  const handleLogout =  () => {
    try {
      dispatch(performLogout());
      localStorage.removeItem("auth_check_cache"); 
      toast.success("Logged out successfully!");
      navigate("/login"); 
    } catch (err) {
      toast.error("Logout failed. Please try again.");
    }
  };
  return <DropdownMenuItem onClick={handleLogout}>Log out</DropdownMenuItem>;
};

export default Logout;

import React, { useState } from "react";
import axiosInstance from "@/utils/axiosInstance";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const SetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axiosInstance.post(
        "/auth/set-password",
        { password, confirmPassword }
      );
      console.log("response in set password: ",response);
      toast.success("Password set successfully!");
      navigate("/dashboard"); // or wherever you want
    } catch (error) {
      console.log(error);
      const message =
        error?.response?.data?.message || "Something went wrong!";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-4 max-w-md mx-auto">
      <input
        type="password"
        required
        placeholder="Enter password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="p-2 border rounded"
      />
      <input
        type="password"
        required
        placeholder="Confirm password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        className="p-2 border rounded"
      />
      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
      >
        {loading ? "Setting..." : "Set Password"}
      </button>
    </form>
  );
};

export default SetPassword;

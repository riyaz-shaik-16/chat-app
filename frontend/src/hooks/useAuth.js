import { useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchUserFailure,
  fetchUserStart,
  fetchUserSuccess,
  selectUserInfo,
  selectUserLoading,
} from "@/redux/slices/user.slice";

const useAuth = () => {
  const dispatch = useDispatch();
  const loading = useSelector(selectUserLoading);
  const user = useSelector(selectUserInfo);
  const getUser = async () => {
    try {
      dispatch(fetchUserStart());
      const { data } = await axios.get(
        "http://localhost:5000/api/user/get-profile",
        {
          withCredentials: true,
        }
      );
      dispatch(fetchUserSuccess(data.user));
    } catch (error) {
      dispatch(fetchUserFailure(error.message || "Failed to fetch user!"));
    }
  };

  useEffect(() => {
    getUser();
  }, []);
  return {loading,user};
};

export default useAuth;

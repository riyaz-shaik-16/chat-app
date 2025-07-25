import React, { useEffect } from "react";
import axios from "axios";
import {
  fetchUsersStart,
  fetchUsersSuccess,
  fetchUsersFailure,
  selectUsers,
  selectUsersLoading,
  selectUsersError,
} from "@/redux/slices/users.slice";
import { useSelector, useDispatch } from "react-redux";
import { selectUserInfo } from "@/redux/slices/user.slice";
import { fetchChatUsersFailure, fetchChatUsersStart, fetchChatUsersSuccess, selectChatUsersError, selectChatUsers, selectChatUsersLoading } from "@/redux/slices/chat.slice";

const Chat = () => {
  const dispatch = useDispatch();
  const users = useSelector(selectUsers);
  const loading = useSelector(selectUsersLoading);
  const error = useSelector(selectUsersError);
  const loggedInUser = useSelector(selectUserInfo);
  const chatUsers = useSelector(selectChatUsers);
  const chatUsersLoading = useSelector(selectChatUsersLoading);
  const chatUsersError = useSelector(selectChatUsersError);

  const fetchUsers = async () => {
    try {
      console.log("In fetch users func");
      dispatch(fetchUsersStart());
      const { data } = await axios.get(
        "http://localhost:5000/api/user/get-users"
      );
      console.log("data: ",data);
      if (data.success) {
        dispatch(fetchUsersSuccess(data.users));
      }
    } catch (error) {
      console.log(error);
      dispatch(
        fetchUsersFailure(
          error.response?.data?.message || "Error fetching users!"
        )
      );
    }
  };

  const getAllChats = async () => {
    try {
      console.log("In get all chats func");
      dispatch(fetchChatUsersStart());
      const { data } = await axios.get(
        "http://localhost:5002/api/chat/get-all-chats",{withCredentials:true}
      );
      console.log("data for all chats: ",data);
      if (data.success) {
        dispatch(fetchChatUsersSuccess(data.chats));
      }
    } catch (error) {
      console.log(error);
      dispatch(
        fetchChatUsersFailure(
          error.response?.data?.message || "Error fetching users!"
        )
      );
    }
  };


  useEffect(() => {
    fetchUsers();
    getAllChats();
  }, []);

  // console.log("users: ",users);

  if(loading) return <h1>Loading..</h1>
  return (
    <>  
    <h1>all users</h1>
    {error && <h1 className="text-red-500">{error}</h1>}
      {
        users && users?.length > 0 && (
          users.map((user) => user.email !== loggedInUser.email ? (<h1 key={user?.email}>{user?.name}</h1>) : null)
        )
      }

      <h1>chatted users</h1>
      {
        chatUsers && chatUsers?.length > 0 && (
          chatUsers.map((chatUser) => chatUser?.user?.email !== loggedInUser.email ? (<h1 key={chatUser?.user?.email}>{chatUser?.user?.name}</h1>) : null)
        )
      }

    </>
  );
};

export default Chat;

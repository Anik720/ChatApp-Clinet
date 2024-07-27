import React, { createContext, useState } from "react";
import Fetch from "../../utils/axios";
import { API } from "../../utils/api";
import NotoficationHandler from "../../utils/notificationHandler";

export const AdminUserContext = createContext({
  adminUsers: null,
  isAdminUsersLoading: false,
  getUsers: (data: any) => {},
  bannedUser: (id: string) => {},
  unBannedUser: (id: string) => {},
  getRoomsByUserId: (id: string) => {},
  getConversationByRoomId: (id: string) => {},
  rooms: [],
  conversations: [],
  getAllUser: () => {},
  allAdminUsers: null,
});

export default function AdminUserContextProvider({ children }: any) {
  const [adminUsers, setAdminUsers] = useState(null);
  const [allAdminUsers, setAllAdminUsers] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [isAdminUsersLoading, setIsAdminUsersLoading] =
    useState<boolean>(false);

  const getUsers = async (data: any) => {
    setIsAdminUsersLoading(true);
    try {
      const result = await Fetch.get(
        `${API.admin.user.GET_USERS}?page=${data.page}&limit=${
          data.limit
        }&status=${data.status || ""}`
      );
      setAdminUsers(result.data);
      setIsAdminUsersLoading(false);
    } catch (error: any) {
      setIsAdminUsersLoading(false);
      console.log(error);
    }
  };

  const getAllUser = async () => {
    setIsAdminUsersLoading(true);
    try {
      const result = await Fetch.get(`${API.admin.user.GET_ALL_USERS}`);
      setAllAdminUsers(result.data);
      setIsAdminUsersLoading(false);
    } catch (error: any) {
      setIsAdminUsersLoading(false);
      console.log(error);
    }
  };

  const bannedUser = async (id: string) => {
    setIsAdminUsersLoading(true);
    try {
      const result = await Fetch.post(API.admin.user.BANNED_USER, { id });
      setAdminUsers(result.data.users);
      setIsAdminUsersLoading(false);
      NotoficationHandler(result.data, "success");
      getUsers(
        adminUsers?.page
          ? { page: adminUsers?.page, limit: adminUsers?.limit }
          : { page: 1, limit: 10 }
      );
    } catch (error: any) {
      NotoficationHandler(error.response.data, "error");
      setIsAdminUsersLoading(false);
      console.log(error);
    }
  };

  const unBannedUser = async (id: string) => {
    setIsAdminUsersLoading(true);
    try {
      const result = await Fetch.post(API.admin.user.UNBANNED_USER, { id });
      setAdminUsers(result.data.users);
      setIsAdminUsersLoading(false);
      NotoficationHandler(result.data, "success");
      getUsers(
        adminUsers?.page
          ? { page: adminUsers?.page, limit: adminUsers?.limit }
          : { page: 1, limit: 10 }
      );
    } catch (error: any) {
      NotoficationHandler(error.response.data, "error");
      setIsAdminUsersLoading(false);
    }
  };

  const getRoomsByUserId = async (id: string) => {
    setIsAdminUsersLoading(true);
    try {
      const result = await Fetch.get(
        `${API.admin.user.GET_ROOM_BY_USER_ID}/${id}`
      );
      setRooms(result.data.rooms);
      setIsAdminUsersLoading(false);
    } catch (error: any) {
      setIsAdminUsersLoading(false);
      console.log(error);
    }
  };

  const getConversationByRoomId = async (id: string) => {
    setIsAdminUsersLoading(true);
    try {
      const result = await Fetch.get(
        `${API.admin.user.GET_CONVERSATION_BY_ROOM_ID}/${id}`
      );
      setConversations(result.data.conversation);
      setIsAdminUsersLoading(false);
    } catch (error: any) {
      setIsAdminUsersLoading(false);
      console.log(error);
    }
  };

  return (
    <AdminUserContext.Provider
      value={{
        adminUsers,
        isAdminUsersLoading,
        getUsers,
        bannedUser,
        getRoomsByUserId,
        rooms,
        getConversationByRoomId,
        conversations,
        unBannedUser,
        getAllUser,
        allAdminUsers,
      }}
    >
      {children}
    </AdminUserContext.Provider>
  );
}

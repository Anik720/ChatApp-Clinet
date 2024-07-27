import React, { createContext, useState } from "react";
import Fetch from "../utils/axios";
import { API } from "../utils/api";

export const UserContext = createContext({
  users: [],
  isUsersLoading: false,
  getUsersIfRoomExits: () => {},
  setUsers: (data: object) => {},
});

export default function UserContextProvider({ children }: any) {
  const [users, setUsers] = useState([]);

  const [isUsersLoading, setIsUsersLoading] = useState<boolean>(false);

  const getUsersIfRoomExits = async () => {
    setIsUsersLoading(true);
    try {
      const result = await Fetch.get(API.user.GET_USER_IF_ROOM_EXITS);
      console.log("result", result);
      setUsers(result.data.users);
      setIsUsersLoading(false);
    } catch (error: any) {
      setIsUsersLoading(false);
      console.log(error);
    }
  };

  return (
    <UserContext.Provider
      value={{
        users,
        isUsersLoading,
        getUsersIfRoomExits,
        setUsers,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

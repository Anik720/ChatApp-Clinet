import React, { createContext, useState } from "react";
import Fetch from "../../utils/axios";
import { API } from "../../utils/api";
import NotoficationHandler from "../../utils/notificationHandler";

export const AdminConversationContext = createContext({
  getAllConversations: () => {},
  allConversations: [],
});

export default function AdminConversationContextProvider({ children }: any) {
  const [isAdminConvertionLoading, setIsAdminConvertionLoading] =
    useState<boolean>(false);
  const [allConversations, setAllConversations] = useState<object[]>([]);

  const getAllConversations = async () => {
    setIsAdminConvertionLoading(true);
    try {
      const result = await Fetch.get(
        API.admin.conversation.GET_ALL_CONVERSATIONS
      );
      setAllConversations(result.data.conversations);
      setIsAdminConvertionLoading(false);
    } catch (error: any) {
      NotoficationHandler(error?.response?.data, "error");
      setIsAdminConvertionLoading(false);
      console.log(error);
    }
  };

  return (
    <AdminConversationContext.Provider
      value={{
        getAllConversations,
        allConversations,
      }}
    >
      {children}
    </AdminConversationContext.Provider>
  );
}

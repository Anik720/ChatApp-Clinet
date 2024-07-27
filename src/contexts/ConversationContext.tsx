import React, { createContext, useState } from "react";
import Fetch from "../utils/axios";
import { API } from "../utils/api";
import { message } from "antd";

export const ConversationContext = createContext({
  isConversationLoading: false,
  deleteConversation: (id: string) => {},
  conversation: [],
  setConversation: (data: any) => {},
});

export default function ConversationContextProvider({ children }: any) {
  const [conversation, setConversation] = useState<any>([]);
  const [isConversationLoading, setIsConversationLoading] =
    useState<boolean>(false);

  const deleteConversation = async (id: string) => {
    setIsConversationLoading(true);
    try {
      const result = await Fetch.delete(
        API.conversation.CONVERSATION_ROUTE + "/" + id
      );
      setIsConversationLoading(false);
      setConversation(conversation.filter((item: any) => item._id !== id));
      message.success(result.data.message);
    } catch (error: any) {
      setIsConversationLoading(false);
      console.log(error);
    }
  };

  return (
    <ConversationContext.Provider
      value={{
        isConversationLoading,
        deleteConversation,
        conversation,
        setConversation,
      }}
    >
      {children}
    </ConversationContext.Provider>
  );
}


export const useConversation = () => React.useContext(ConversationContext);
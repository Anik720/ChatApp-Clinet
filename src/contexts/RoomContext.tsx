import React, { createContext, useState } from "react";
import { API } from "../utils/api";
import Fetch from "../utils/axios";
import { useAuth } from "./AuthContext";
import { useSocket } from "./SocketContext";

export const RoomContext = createContext({
    isRoomsLoading: false,
    createGroupRoom: (data: object) => {},
    leaveGroup: (data: any) => {},
    rooms: [],
    publicRooms: [],
    setPublicRooms: (data: any) => {},
    isTyping: null,
    setIsTyping: (data: any) => {}
});

export default function RoomContextProvider({ children }: any) {
    const [isTyping, setIsTyping] = useState<any>(null);
    const [publicRooms, setPublicRooms] = useState<any>([]);
    const [isRoomsLoading, setIsRoomsLoading] = useState<boolean>(false);
    const { rooms } = useSocket();

    const createGroupRoom = async (data: object) => {
        setIsRoomsLoading(true);
        return new Promise(async (res: any, rej: any) => {
            Fetch.post(API.room.CREATE_GROUP_ROOM, data)
                .then((response: any) => {
                    setIsRoomsLoading(false);
                    return res(response.data);
                })
                .catch((err: any) => {
                    setIsRoomsLoading(false);
                    return rej(err);
                });
        });
    };

    const leaveGroup = async () => {
        try {
            console.log("first");
        } catch (error) {}
    };

    return (
        <RoomContext.Provider
            value={{
                isRoomsLoading,
                createGroupRoom,
                rooms,
                leaveGroup,
                publicRooms,
                setPublicRooms,
                isTyping,
                setIsTyping
            }}>
            {children}
        </RoomContext.Provider>
    );
}

export const useRoom = () => React.useContext(RoomContext);

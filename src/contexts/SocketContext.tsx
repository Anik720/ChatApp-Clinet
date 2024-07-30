'use client'
import { SOCKET_URL } from "@/utils/api";
import moment from "moment";
import { createContext, useContext, useEffect, useState } from "react";
import { initDB, saveConversations, getConversations } from "@/utils/indexedDB";
import { Button, message } from 'antd';
import { io } from "socket.io-client";
import { useAuth } from "./AuthContext";
const socket:any = io(SOCKET_URL, {
    transports: ["websocket"]
});
const SocketContext = createContext(null);

const processMessages = (messages) => {
    messages?.map((message) => {
        message.timestamp = moment(message.updated_at).unix();
        return message;
    });
    messages?.sort((a, b) => {
        return a.timestamp - b.timestamp;
    });
    //remove duplicate messages

    let unique = {};
    messages = messages?.filter((obj) => !unique[obj._id] && (unique[obj._id] = true));

    return messages;
};

export const SocketProvider = ({ children }) => {
    const [isConnected, setIsConnected] = useState(socket.connected);
    const [rooms, setRooms] = useState([]);
    const [currentRoom, setCurrentRoom] = useState(null);
    const [conversations, setConversations] = useState({});
    const [typingIndicators, setTypingIndicators] = useState({});
    const [infoImageApprovalData, setInfoImageApprovalData] = useState();
    const [notifyMessageOfImagesData, setNotifyMessageOfImagesData] = useState( {
        roomId: "",
        senderID: "",
        recieverId: "",
      });

    const [showModal, setShowModal] = useState(false);
    const [messageApprovalStatus, setMessageApprovalStatus] = useState(false);
    const { user } = useAuth();


    useEffect(() => {
        socket.on("connect", () => {
            setIsConnected(true);
        });

        socket.on("disconnect", () => {
            setIsConnected(false);
            setRooms([]);
            setConversations([]);
        });
        socket.on("rooms", (rooms: any) => {
            setRooms(rooms);
        });
        socket.on("preChat", async ({ conversation, roomId, infoImageApproval}) => {
            const processedMessages = processMessages(conversation);
            console.log(63, infoImageApproval)
            await saveConversations(roomId, processedMessages);

            setInfoImageApprovalData(infoImageApproval)
            setConversations((prevConversations) => ({
                ...prevConversations,
                [roomId]: processedMessages
            }));
        });
        socket.on("newMessage", async ({ conversation, roomId }) => {
            setConversations((prevConversations) => {
                const updatedConversations = processMessages([...(prevConversations[roomId] || []), conversation]);
                saveConversations(roomId, updatedConversations);
                return {
                    ...prevConversations,
                    [roomId]: updatedConversations
                };
            });
        });
        socket.on("setCurrentRoom", async (room) => {
            setCurrentRoom(room);
            const storedConversations = await getConversations(room.roomId);
            if (storedConversations) {
                setConversations((prevConversations) => ({
                    ...prevConversations,
                    [room.roomId]: storedConversations.conversations
                }));
            }
        });


        socket.on("messageApprove", ({ roomId}) => {
            setMessageApprovalStatus(true)
        });


        socket.on("notifyMessage", ({ conversation, roomId }) => {
            const audio = new Audio("/notify.mp3");
            audio.play();
            setRooms((prev) => {
                const room = prev.find((room) => room._id === roomId);
                if (room) {
                    room.lastConversation.message = conversation.message;
                    // unseenMessageCount;
                    room.unseenMessageCount = room.unseenMessageCount + 1;
                }
                return [...prev];
            });
        });
        socket.on("notifyMessageOfImages", ({ roomId,
            senderID,
            recieverId }) => {

            setNotifyMessageOfImagesData({ roomId,
                senderID,
                recieverId })
                setShowModal(true)   
        });
  

        socket.on("imagePermissionApproved", ({ roomId,senderid,recieverid}) => {
            setShowModal(false) 
            message.success('Succcess'); 
  
        });


        //typing
        socket.on("startTyping", ({ roomId, userId }) => {
            setTypingIndicators((prev) => {
                return {
                    ...prev,
                    [roomId]: userId
                };
            });
        });
        socket.on("stopTyping", ({ roomId }) => {
            setTypingIndicators((prev) => {
                return {
                    ...prev,
                    [roomId]: null
                };
            });
        });
        socket.on("joined", (roomId) => {
            setRooms((prev) => {
                const updatedRooms = prev.map((room) => {
                    if (room._id === roomId) {
                        return { ...room, unseenMessageCount: 0 };
                    }
                    return room;
                });
                return [...updatedRooms];
            });
        });

        return () => {
            socket.off("connect");
            socket.off("disconnect");
            socket.off("rooms");
            socket.off("preChat");
            socket.off("newMessage");
            socket.off("notifyMessage");
            socket.off("setCurrentRoom");
            socket.off("startTyping");
            socket.off("stopTyping");
            // socket.off("notifyMessageOfImages");
        };
    }, []);

    const joinRoom = (room) => {
        if (currentRoom) {
            socket.emit("leaveRoom", currentRoom);
        }
        socket.emit("joinRoom", { roomId: room.roomId, isCurrent: true });
        setCurrentRoom(room);
    };

    const leaveRoom = (room) => {
        socket.emit("leaveRoom", { roomId: room });
    };
    const sendMessage = (message, members, images) => {
        if (message.trim()) {
            const data = {
                roomId: currentRoom?.roomId || null,
                members: members || null,
                message,
                images: images
            };
            socket.emit("message", data);
        }
    };

    const startTyping = (roomId) => {
        console.log("start typing");
        socket.emit("startTyping", { roomId });
    };

    const stopTyping = (roomId) => {
        console.log("stop typing");
        socket.emit("stopTyping", { roomId });
    };

    const approveImagePermission = (roomId,senderid, recieverid) => {
        
        socket.emit("imagePermission",{roomId,senderid,recieverid});

    };

    return (
        <SocketContext.Provider
            value={{
                socket,
                isConnected,
                rooms,
                joinRoom,
                leaveRoom,
                conversations,
                sendMessage,
                currentRoom,
                setCurrentRoom,
                startTyping,
                stopTyping,
                typingIndicators,
                setTypingIndicators,
                notifyMessageOfImagesData,
                setNotifyMessageOfImagesData,
                showModal,
                setShowModal,
                approveImagePermission,
                messageApprovalStatus, 
                setMessageApprovalStatus,
                infoImageApprovalData,
                setInfoImageApprovalData,
            }}>
            {children}
        </SocketContext.Provider>
    );
};

export const useSocket = () => {
    if (!SocketContext) {
        throw new Error("useSocket must be used within a SocketProvider");
    }
    return useContext(SocketContext);
};

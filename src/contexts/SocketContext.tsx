'use client'
import { SOCKET_URL } from "@/utils/api";
import moment from "moment";
import { createContext, useContext, useEffect, useState } from "react";
import { initDB, saveConversations, getConversations } from "@/utils/indexedDB";
import { Button, message } from 'antd';
import { io } from "socket.io-client";
import { useAuth } from "./AuthContext";
import Fetch from "@/utils/axios";
export const socket:any = io(SOCKET_URL, {
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
    let [rooms, setRooms] = useState<any>([]);
    let [roomsLoading, setRoomsLoading] = useState<any>(true);
    const [roomsCopy, setRoomsCopy] = useState([]);
    const [currentRoom, setCurrentRoom] = useState(null);
    const [conversations, setConversations] = useState({});
    const [typingIndicators, setTypingIndicators] = useState({});
    const [infoImageApprovalData, setInfoImageApprovalData] = useState(null);
    const [infoMessageApprovalData, setInfoMessageApprovalData] = useState(null);
    const [notifyMessageOfImagesData, setNotifyMessageOfImagesData] = useState( {
        roomId: "",
        senderID: "",
        recieverId: "",
      });

    const [showModal, setShowModal] = useState(false);
    const [messageApprovalStatus, setMessageApprovalStatus] = useState({
        status: false,
        roomId: "", 
        senderId : '',
        recieverId : ''
    });
    const [loadingStatusMessageApproval, setLoadingStatusMessageApproval] = useState(false);

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
            console.log(66, rooms)
            setRoomsLoading(false);
            if(rooms.length > 0){
             setRooms(rooms);
            }

        });
        socket.on("preChat", async ({ conversation, roomId, infoImageApproval,curreentRoom, infoMessageApproval}) => {
            if(JSON.parse(localStorage.getItem('loggedInUser'))?._id ===  JSON.stringify(curreentRoom?.imagesPermission?.senderID) || JSON.parse(localStorage.getItem('loggedInUser'))?._id ===  JSON.stringify(curreentRoom?.imagesPermission?.recieverId)){
                setShowModal(true)
            }
            const processedMessages = processMessages(conversation);
            await saveConversations(roomId, processedMessages);
            setInfoImageApprovalData(infoImageApproval)

            setConversations((prevConversations) => ({
                ...prevConversations,
                [roomId]: processedMessages
            }));
        });
        socket.on("newMessage", async ({ conversation, roomId }) => {
            let loggedInUser = localStorage.getItem("loggedInUser");
            if(loggedInUser){
                socket.emit("allRoomGetTrigger", JSON.parse(loggedInUser));
            }
  
            setConversations((prevConversations) => {
                const updatedConversations = processMessages([...(prevConversations[roomId] || []), conversation]);
                console.log("new message", updatedConversations);
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



        socket.on("messageApprove",async ({ roomId,senderId, recieverId,room, senderInfo, recieverInfo}) => {
            console.log(107, "messageApprove")
            setMessageApprovalStatus({
                status: false,
                roomId: roomId ,
                senderId : senderId,
                recieverId : recieverId
            })
            let modifiedRooms = []
           
            if( JSON.parse(localStorage.getItem('loggedInUser'))?._id ==  recieverId ){
    
                room.members = [senderInfo,recieverInfo]
                if(rooms?.find(room => room._id == roomId)){
                    modifiedRooms  = [...rooms]
                }else{
                    modifiedRooms  = [...rooms, room]
                }

            }
            rooms = modifiedRooms
            socket.emit("rooms", rooms);
            socket.emit("mergeRooms", modifiedRooms);
            // setRooms(rooms);
          
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
            recieverId,
            presentRoom
        }) => {

            setNotifyMessageOfImagesData({ roomId,
                senderID,
                recieverId })
                if(presentRoom?._id == roomId){
                    if(  JSON.parse(localStorage.getItem('loggedInUser'))?._id ==  senderID || JSON.parse(localStorage.getItem('loggedInUser'))?._id == recieverId){
                        setShowModal(true)
                    }
                }
       
        });
  

        socket.on("imagePermissionApproved", ({ roomId,senderid,recieverid,infoImageApproval}) => {
            setShowModal(false) 
            message.success('Succcess'); 
            setInfoImageApprovalData(infoImageApproval)
            localStorage.setItem("rooms",JSON.stringify([]))
  
        });
        socket.on("guestUserMessageRequestApproved", ({ roomId,senderid,recieverid}) => {
           
            setMessageApprovalStatus({
                status: true,
                roomId: roomId ,
                senderId : senderid,
                recieverId : recieverid
            }) 
            setLoadingStatusMessageApproval(false)
   
            // message.success('Succcess'); 
  
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
            setInfoImageApprovalData(null)
            setRooms([]);
            setConversations([]);
            socket.off("notifyMessageOfImages");
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


    const approveGuestUserMessageRequestPermission = (roomId,senderid, recieverid) => { 
        socket.emit("guestUserMessageApprovalPermission",{roomId,senderid,recieverid});

    };

    return (
        <SocketContext.Provider
            value={{
                socket,
                isConnected,
                rooms,
                setRooms,
                roomsLoading, 
                setRoomsLoading,
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
                approveGuestUserMessageRequestPermission,
                infoMessageApprovalData,
                setInfoMessageApprovalData,
                loadingStatusMessageApproval,
                setLoadingStatusMessageApproval
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

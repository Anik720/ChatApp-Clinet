import moment from "moment";

// export const getRooms = (
//     socket: any,
//     callback: (rooms: any) => void,
//     setCurrentRoom: (room: any) => void = null,
// ) => {
//     console.log("getRooms");
//     socket.on("rooms", (rooms: any) => {
//         callback(rooms);
//         if (rooms.length > 0 && setCurrentRoom) {
//             setCurrentRoom(rooms[0]);
//         }
//     });
// }
export const getPublicRooms = (socket: any, callback: (rooms: any) => void) => {
    socket && socket.emit("publicRooms", {
        type: "publicRooms"
    });

    socket && socket.on("publicRooms", (rooms: any) => {
        callback(rooms);
    }
    );
}

export const getPreviousMessages = (socket: any, callback: (messages: any) => void) => {
    socket && socket.on("preChat", (messages: any) => {
        messages.map((message: any) => {
            message.timestamp = moment(message.updated_at).unix();
            return message;
        })
        messages.sort((a: any, b: any) => {
            return a.timestamp - b.timestamp;
        });
        callback(messages);
    });
}

export const joinRoom = (socket: any, room: string, isCurrent = false) => {
    socket && socket.emit("joinRoom", {
        roomId: room,
        isCurrent
    });
}
export const joinGroup = (socket: any, room: string, isCurrent = false) => {
    socket && socket.emit("joinGroup", {
        roomId: room,

    });
}

export const getNewMessage = (socket: any, callback: (message: any) => void, setRooms: (rooms: any) => void, user: any) => {

    socket && socket.on("newMessage", ({ conversation }) => {
        const audio = new Audio("/notify.mp3");
        if (conversation?.from._id !== user?._id) {
            console.log("new message", user);
            audio.play();
        }

        callback((prev: any) => {
            const messages = [...prev, conversation];
            messages.map((message: any) => {
                message.timestamp = moment(message.updated_at).unix();
                return message;
            })
            messages.sort((a: any, b: any) => {
                return a.timestamp - b.timestamp;
            });
            return messages;
        });
        setRooms((prev: any) => {
            const room = prev.find((room: any) => room._id === conversation.roomId);
            if (room) {
                room.lastConversation = conversation;
            }
            return [...prev];
        }
        );

    });
}


import { useSocket } from "@/contexts/SocketContext";
import { Avatar, Badge, Card, Divider, Space, Typography } from "antd";
import isEmpty from "lodash/isEmpty";
import { useContext } from "react";
import { AuthContext } from "../../../contexts/AuthContext";
import { RoomContext } from "../../../contexts/RoomContext";
import getColor from "../../../utils/colorPicker";
import AgoTimeCount from "../../../utils/timeAgo";

const propsInterface = {
    search: "",
    searchUser: [],
    rooms: [],
    onRoomClick: (data: any) => {},
    currentRoom: {
        _id: "",
        roomId: ""
    },
    setSearch: (data: string) => {}
};

const YourJoinedRooms = ({ search, searchUser, rooms, onRoomClick, currentRoom, setSearch }: typeof propsInterface = propsInterface) => {
    const { user } = useContext(AuthContext);
    const { isTyping } = useContext(RoomContext);
    const { typingIndicators } = useSocket();

    const getTypingUsers = (roomId) => {
        const typingUsers = typingIndicators[roomId];
        return typingUsers ? "Typing..." : "";
    };

    const renderLastMessage = (item) => {
        const isTyping = isEmpty(typingIndicators) ? false : getTypingUsers(item._id);

        if (isTyping) {
            return isTyping;
        }
        if (item?.lastConversation?.from?._id === user?._id) {
            return "You: " + item?.lastConversation?.message;
        } else {
            return item?.lastConversation?.message;
        }

        // {
        //     !item?.isGroup && item?.lastConversation?.from?._id === user?._id ? "You: " : "";
        // }

        // {
        //     item?.isGroup && item?.lastConversation?.from?._id !== user?._id && `${item?.lastConversation?.from?.nickName}: `;
        // }

        // {
        //     item?.isGroup && item?.lastConversation?.from?._id === user?._id && `You: `;
        // }

        // {
        //     item?.lastConversation
        //         ? item?.lastConversation?.deletedByAdmin
        //             ? " Message was deleted by admin"
        //             : item?.lastConversation?.message?.slice(0, 20)
        //         : "No Text";
        // }
    };



    return (
        <div
            style={{
                scrollSnapType: "y mandatory",
                overflowY: "auto",
                overflowX: "hidden",
                height: "82vh",
                marginTop: "10px"
            }}>
            {search && (
                <>
                    <Divider
                        style={{
                            margin: "5px"
                        }}
                    />
                    {searchUser.map((item: any) => (
                        <div
                            key={item._id}
                            style={{
                                width: "98%"
                            }}>
                            <Card
                                size='small'
                                hoverable
                                bordered={false}
                                onClick={() => {
                                    setSearch("");
                                    onRoomClick({
                                        roomId: item?.roomId,
                                        host: user._id,
                                        members: [user._id, item._id],
                                        user: item
                                    });
                                }}>
                                <Space
                                    style={{
                                        display: "flex",
                                        gap: "15px",
                                        padding: "10px"
                                    }}>
                                    <Avatar size={"large"} />
                                    <Space
                                        style={{
                                            display: "flex",
                                            flexDirection: "column",
                                            justifyContent: "center",
                                            alignItems: "flex-start",
                                        }}>
                                        <Typography.Text
                                            style={{
                                                fontWeight: "bold",
                                                lineHeight: "0"
                                            }}>
                                            {item.name}
                                        </Typography.Text>
                                        <Typography.Text
                                            style={{
                                                lineHeight: "0"
                                            }}>
                                            {item.nickName}
                                        </Typography.Text>
                                    </Space>
                                </Space>
                            </Card>
                            <Divider
                                style={{
                                    margin: "5px"
                                }}
                            />
                        </div>
                    ))}
                </>
            )}
            {!search && (
                <>
                    {rooms.map((item: any, index: any) => {
                        return (
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    backgroundColor: item._id === currentRoom?.roomId ? "#F0F2F5" : "",
                                    width: "100%",
                                    justifyContent: "space-between",
                                    padding: "10px"
                                }}
                                key={index}
                                onClick={() => {
                                    onRoomClick({
                                        roomId: item?._id,
                                        host: user._id,
                                        members: [user?._id, item?.members],
                                        ...item
                                    });
                                }}>
                                <Space
                                    style={{
                                        cursor: "pointer"
                                    }}>
                                    <Avatar
                                        size={"large"}
                                        style={{
                                            backgroundColor: getColor(
                                                item.isGroup
                                                    ? item?.name[0].toLowerCase()
                                                    : item?.members.map((member: any) => {
                                                          if (member?._id !== user?._id) {
                                                              // return member.name[0].toLowerCase();
                                                              return member.name
                                                                  ? member.name[0].toLowerCase()
                                                                  : member.nickName[0].toLowerCase();
                                                          }
                                                      })
                                            )
                                        }}>
                                        {item.isGroup
                                            ? item?.name?.charAt(0)
                                            : item?.members.map((member: any) => {
                                                  if (member?._id !== user?._id) {
                                                      return (
                                                          member.name?.charAt(0).toUpperCase() || member.nickName?.charAt(0).toUpperCase()
                                                      );
                                                  }
                                              })}
                                    </Avatar>
                                    <div
                                        style={{
                                            marginLeft: "10px"
                                        }}>
                                        <Typography.Text
                                            style={{
                                                fontWeight: "bold"
                                            }}>
                                            {item.isGroup
                                                ? item?.name
                                                : item?.members.map((member: any) => {
                                                      if (member?._id !== user?._id) {
                                                          return member.name || member.nickName;
                                                      }
                                                  })}
                                        </Typography.Text>{" "}
                                        <br />
                                        <Typography.Text
                                            type={
                                                item?.lastConversation?.status === "sent" || item?.host?._id === user?._id
                                                    ? "secondary"
                                                    : "success"
                                            }
                                            strong={item?.lastConversation?.status !== "seen" ? true : false}
                                            style={{
                                                fontSize: 12,
                                                whiteSpace: "nowrap",
                                                overflow: "hidden",
                                                textOverflow: "ellipsis",
                                                width: "100%"
                                            }}>
                                            {renderLastMessage(item)}
                                        </Typography.Text>
                                    </div>
                                </Space>
                                <div>
                                    <Space>
                                        {item?.unseenMessageCount !== 0 && item?.lastConversation?.from?._id !== user?._id && (
                                            <Badge color='teal' size={"small"} />
                                        )}
                                        <Typography.Text
                                            style={{
                                                fontSize: 10,
                                                color: "#808080",
                                                marginLeft: "10px"
                                            }}>
                                            {AgoTimeCount(item?.lastConversation?.created_at)}
                                        </Typography.Text>
                                    </Space>
                                </div>
                            </div>
                        );
                    })}
                </>
            )}
        </div>
    );
};

export default YourJoinedRooms;

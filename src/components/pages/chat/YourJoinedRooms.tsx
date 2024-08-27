import { socket, useSocket } from "@/contexts/SocketContext";
import { Avatar, Badge, Button, Card, Divider, Skeleton, Space, Typography } from "antd";
import isEmpty from "lodash/isEmpty";
import { useContext } from "react";
import { AuthContext } from "../../../contexts/AuthContext";
import { RoomContext } from "../../../contexts/RoomContext";
import getColor from "../../../utils/colorPicker";
import AgoTimeCount from "../../../utils/timeAgo";
import Fetch from "@/utils/axios";

const propsInterface = {
  search: "",
  searchUser: [],
  rooms: [],
  onRoomClick: (data: any) => {},
  currentRoom: {
    _id: "",
    roomId: "",
  },
  setSearch: (data: string) => {},
};

const YourJoinedRooms = ({
  search,
  searchUser,
  rooms,
  onRoomClick,
  currentRoom,
  setSearch,
}: typeof propsInterface = propsInterface) => {
  const { user } = useContext(AuthContext);
  const { isTyping } = useContext(RoomContext);
  const {
    typingIndicators,
    setShowModal,
    setInfoImageApprovalData,
    messageApprovalStatus,
    setRooms,
    approveGuestUserMessageRequestPermission,
  } = useSocket();

  const getTypingUsers = (roomId) => {
    const typingUsers = typingIndicators[roomId];
    return typingUsers ? "Typing..." : "";
  };

  const renderLastMessage = (item) => {
    const isTyping = isEmpty(typingIndicators)
      ? false
      : getTypingUsers(item._id);

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

  const handleApproveImagePermission = async (targetItem) => {
    approveGuestUserMessageRequestPermission(
      targetItem._id,
      targetItem.messagePermission?.senderID,
      targetItem.messagePermission?.recieverId
    );
    // const res = await Fetch.get("/room/all-rooms");
   let modifiedRooms = rooms.map(item => {
      if (targetItem._id === item._id) {
          return {
              ...item,
              messagePermission: {
                  ...item.messagePermission,
                  active: true,
                  senderID: targetItem.messagePermission?.senderID,
                  recieverId: targetItem.messagePermission?.recieverId
              }
          };
      }
      return item;
  });
    // if (res?.data?.success) {
    //   socket.emit("rooms", res?.data?.rooms);
    //   // setRooms(res?.data?.rooms);
    // }
    console.log(94, modifiedRooms)
    setRooms(modifiedRooms);
  };

  return (
    <div
      style={{
        scrollSnapType: "y mandatory",
        overflowY: "auto",
        overflowX: "hidden",
        height: "82vh",
        marginTop: "10px",
      }}
    >
      {search && (
        <>
          <Divider
            style={{
              margin: "5px",
            }}
          />
          {searchUser.map((item: any) => (
            <div
              key={item._id}
              style={{
                width: "98%",
              }}
            >
              <Card
                size="small"
                hoverable
                bordered={false}
               
              >
                <Space
                  style={{
                    display: "flex",
                    gap: "15px",
                    padding: "10px",
                  }}
                  onClick={() => {
                    setSearch("");
                    setShowModal(false);
                    setInfoImageApprovalData(null);
                    onRoomClick({
                      roomId: item?.roomId,
                      host: user._id,
                      members: [user._id, item._id],
                      user: item,
                    });
                  }}
                >
                  <Avatar size={"large"} />
                  <Space
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "flex-start",
                    }}
                  >
                    <Typography.Text
                      style={{
                        fontWeight: "bold",
                        lineHeight: "0",
                      }}
                    >
                      {item.name}
                    </Typography.Text>
                    <Typography.Text
                      style={{
                        lineHeight: "0",
                      }}
                    >
                      {item.nickName}
                    </Typography.Text>
                  </Space>
                </Space>
              </Card>
              <Divider
                style={{
                  margin: "5px",
                }}
              />
            </div>
          ))}
        </>
      )}
      {!search && (
        <>
          { rooms?.length > 0 ?   
          rooms?.map((item: any, index: any) => {
            // console.log("item", item);
            return (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  backgroundColor:
                    item._id === currentRoom?.roomId ? "#F0F2F5" : "",
                  width: "100%",
                  justifyContent: "space-between",
                  padding: "10px",
                }}
                key={index}
             
              >
                <Space
                  style={{
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    setShowModal(false);
                    setInfoImageApprovalData(null);
                    onRoomClick({
                      roomId: item?._id,
                      host: user._id,
                      members: [user?._id, item?.members],
                      ...item,
                    });
                  }}
                >
                  <Avatar
                    size={"large"}
                    style={{
                      backgroundColor: getColor(
                        item?.isGroup
                          ? item?.name[0].toLowerCase()
                          : item?.members.map((member: any) => {
                              if (member?._id !== user?._id) {
                                // return member.name[0].toLowerCase();
                                return member?.name
                                  ? member.name[0].toLowerCase()
                                  : member?.nickName[0]?.toLowerCase();
                              }
                            })
                      ),
                    }}
                  >
                    {item?.isGroup
                      ? item?.name?.charAt(0)
                      : item?.members.map((member: any) => {
                          if (member?._id !== user?._id) {
                            return (
                              member.name?.charAt(0).toUpperCase() ||
                              member.nickName?.charAt(0).toUpperCase()
                            );
                          }
                        })}
                  </Avatar>
                  <div
                    style={{
                      marginLeft: "10px",
                    }}
                  >
                    <Typography.Text
                      style={{
                        fontWeight: "bold",
                      }}
                    >
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
                        item?.lastConversation?.status === "sent" ||
                        item?.host?._id === user?._id
                          ? "secondary"
                          : "success"
                      }
                      strong={
                        item?.lastConversation?.status !== "seen" ? true : false
                      }
                      style={{
                        fontSize: 12,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        width: "100%",
                      }}
                    >
                      {renderLastMessage(item)}
                    </Typography.Text>
                  </div>
                </Space>
                <div>
                  <div className="d-flex justify-center items-center">
                    <Space>
                      {item?.unseenMessageCount !== 0 &&
                        item?.lastConversation?.from?._id !== user?._id && (
                          <Badge color="teal" size={"small"} />
                        )}
                      <Typography.Text
                        style={{
                          fontSize: 10,
                          color: "#808080",
                          marginLeft: "10px",
                        }}
                      >
                        {AgoTimeCount(item?.lastConversation?.created_at)}
                      </Typography.Text>
                    </Space>
                  </div>

                  {(messageApprovalStatus?.roomId == item?._id) ||
                  (item?.messagePermission?.recieverId == user?._id &&
                    item?.messagePermission?.active == false)
                    ? user?.status === "active" && (
                        <>
                          <Button
                            type="primary"
                            size="small"
                            onClick={() => {
                              //   showApprovalModal(item);
                              handleApproveImagePermission(item);
                            }}
                          >
                            Approve
                          </Button>
                          {/* <Button
                            type="primary"
                            size="small"
                            onClick={() => {
                              showRejectModal(item);
                            }}
                          >
                            Reject
                          </Button> */}
                        </>
                      )
                    : null}
                </div>
              </div>
            );
          }) 
          :
          <>
          <Divider
            style={{
              margin: "5px",
            }}
          />
          {[...Array(5)].map((_, index) => (
            <div
              key={index}
              style={{
                width: "98%",
              }}
            >
              <Card
                size="small"
                hoverable
                bordered={false}
              >
                <Space
                  style={{
                    display: "flex",
                    gap: "15px",
                    padding: "10px",
                  }}
                >
                  <Skeleton.Avatar active size={"large"} />
                  <Space
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "flex-start",
                    }}
                  >
                    <Skeleton.Input active size="small" style={{ width: 100 }} />
                    <Skeleton.Input active size="small" style={{ width: 60, marginTop: 5 }} />
                  </Space>
                </Space>
              </Card>
              <Divider
                style={{
                  margin: "5px",
                }}
              />
            </div>
          ))}
        </>
        
        }
        </>
      )}
    </div>
  );
};

export default YourJoinedRooms;

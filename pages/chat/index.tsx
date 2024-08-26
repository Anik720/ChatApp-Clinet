"use client";
import ChatRoom from "@/components/pages/chat/ChatRoom";
import { useSocket } from "@/contexts/SocketContext";
import {
  CloseCircleOutlined,
  ReloadOutlined,
  SearchOutlined,
  UsergroupAddOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  Button,
  Col,
  Input,
  Modal,
  Row,
  Space,
  Tabs,
  Tooltip,
  message,
} from "antd";
import { get } from "lodash";
import React, { useEffect, useState } from "react";
import UserLayouts from "@/components/layout/UserLayouts";
import AuthModal from "@/components/pages/chat/AuthModal";
import ContactInfoDrawer from "@/components/pages/chat/ContactInfoDrawer";
import CreateNewGroup from "@/components/pages/chat/CreateNewGroup";
import LeaveGroupModal from "@/components/pages/chat/LeaveGroupModal";
import ProfileDrawer from "@/components/pages/chat/ProfileDrawer";
import YourJoinedRooms from "@/components/pages/chat/YourJoinedRooms";
import { useAuth } from "@/contexts/AuthContext";
import { useConversation } from "@/contexts/ConversationContext";
import { useRoom } from "@/contexts/RoomContext";
import { useTheme } from "@/contexts/ThemeContext";
import Fetch from "@/utils/axios";
import { getPublicRooms } from "@/utils/roomUtils";
import { SOCKET_URL } from "@/utils/api";
import { io } from "socket.io-client";
import { useRouter } from "next/router";

const ChatLayoutHome = ({ children }) => {
  const { isDark } = useTheme();
  const { rooms, publicRooms, setPublicRooms } = useRoom();
  const { conversation, setConversation } = useConversation();
  const conversationEndRef = React.useRef(null);
  const { user } = useAuth();
  const [search, setSearch] = useState<string>("");
  const [searchUser, setSearchUser] = useState<any>([]);
  const [isProfileDrawerVisible, setIsProfileDrawerVisible] =
    useState<boolean>(false);

  const [isCreateNewGroupVisible, setIsCreateNewGroupVisible] =
    useState<boolean>(false);
  const [isContactInfoDrawerVisible, setIsContactInfoDrawerVisible] =
    useState<boolean>(false);
  const {
    joinRoom,
    conversations,
    sendMessage,
    setCurrentRoom,
    currentRoom,
    notifyMessageOfImagesData,
    showModal,
    setShowModal,
    messageApprovalStatus,
    setMessageApprovalStatus,
  } = useSocket();
  const [leaveGroupModal, setLeaveGroupModal] = useState<boolean>(false);
  const [images, setImages] = React.useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<string>("1");
  const router = useRouter()

  const scrollToBottom = () => {
    conversationEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(scrollToBottom, [conversation]);
  const { socket } = useSocket();

  useEffect(() => {
    const getUserByNickName = async () => {
      try {
        const result = await Fetch.get(`/user/search/${search}`);
        setSearchUser(result.data.users);
      } catch (error: any) {
        console.log(error);
      }
    };
    if (search.length > 0) {
      getUserByNickName();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const showModalHandler = () => {
    setShowModal(true);
  };

  const handleOk = () => {
    setShowModal(false);
    router.push('/guest-user-message-request-list')
  };

  const handleCancel = () => {
    setShowModal(false);
  };

  // useEffect(() => {
  //     if (socket) {
  //         socket.emit("notification");
  //         if (rooms.length > 0) {
  //             rooms.forEach((room: any) => {
  //                 joinRoom(socket, room?._id);
  //             });
  //         }
  //     }
  // }, [rooms, socket]);

  // useEffect(() => {
  //     if (socket && user) {
  //         getRooms(socket, setRooms);
  //         getPreviousMessages(socket, setConversation);
  //         getNewMessage(socket, setConversation, setRooms, user);
  //         socket.on("updateRoom", (room: any) => {
  //             console.log("updateRoom", room);
  //             setRooms((rooms: any) => {
  //                 let newRooms = rooms.filter((r: any) => r._id !== room._id);
  //                 return [...newRooms, room];
  //             });
  //             setCurrentRoom((currentRoom: any) => {
  //                 return {
  //                     ...currentRoom,
  //                     isAccepted: room.isAccepted,
  //                     lastConversation: room.lastConversation
  //                 };
  //             });
  //         });
  //     }
  //     return () => {
  //         socket && socket.off("preChat");
  //         socket && socket.off("rooms");
  //         socket && socket.off("newMessage");
  //     };
  //     // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [socket, user]);

  const onRoomClick = (room: any) => {
    setConversation([]);
    localStorage.setItem("CurrentRoom",JSON.stringify(room))
    setCurrentRoom(room);

    if (room?.roomId) {
      joinRoom(room, true);
    }
  };

  const handleTabsChange = (key: any) => {
    if (key === "1") {
      setCurrentRoom(null);
      // getRooms(socket, setRooms);
    }
    if (key === "2") {
      setCurrentRoom(null);
      getPublicRooms(socket, setPublicRooms);
    }
  };

  const items = [
    {
      key: "1",
      label: `You Joined`,
      children: (
        <YourJoinedRooms
          search={search}
          setSearch={setSearch}
          rooms={rooms}
          onRoomClick={onRoomClick}
          currentRoom={currentRoom}
          searchUser={searchUser}
        />
      ),
    },
    {
      key: "2",
      label: `public group`,
      children: (
        <YourJoinedRooms
          setSearch={setSearch}
          rooms={publicRooms}
          onRoomClick={onRoomClick}
          currentRoom={currentRoom}
          search={search}
          searchUser={searchUser}
        />
      ),
    },
  ];

  const deleteChat = async () => {
    try {
      const result = await Fetch.post("/room/deleteChat", {
        roomId: currentRoom._id,
      });
      setConversation([]);
      message.success(result?.data?.message);
    } catch (error) {
      message.error(error?.response?.data?.message);
    }
  };
  const leaveGroup = async () => {
    try {
      const result = await Fetch.post("/room/leaveGroup", {
        roomId: currentRoom._id,
      });
      message.success(result?.data?.message);
    } catch (error) {
      message.error(error?.response?.data?.message);
    }
  };
  const onFinish = async (values: any) => {
    if (notifyMessageOfImagesData?.roomId) {
    }

    if (values?.message) {
      sendMessage(values.message, currentRoom?.members, images);
      setImages([]);
    }
  };


  console.log(24000, messageApprovalStatus)
  // console.log(241, conversation)
  return (
    <div style={{ boxShadow: "0 0 10px rgba(0,0,0,0.1)" }}>
      <Row>
        <Col
          span={6}
          style={{
            borderRight: "1px solid #e8e8e8",
            backgroundColor: !isDark ? "#fff" : "",
            height: "100vh",
            width: "100%",
            overflow: "hidden",
          }}
        >
          <Space
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "10px",
              backgroundColor: !isDark ? "#F0F2F5" : "",
            }}
          >
            <Avatar
              style={{
                backgroundColor: "#028069",
              }}
              onClick={() => {
                setIsProfileDrawerVisible(true);
              }}
            >
              {get(user, "name", "")?.charAt(0).toUpperCase() ||
                get(user, "nickName", "")?.charAt(0).toUpperCase()}
            </Avatar>
            <Space>
              <Tooltip title="Create Group ">
                <Button
                  type="primary"
                  size="small"
                  onClick={() => {
                    setIsCreateNewGroupVisible(true);
                  }}
                >
                  <UsergroupAddOutlined />
                </Button>
              </Tooltip>
              <Tooltip title="Refresh">
                <Button
                  type="primary"
                  size="small"
                  // onClick={() => getRooms(socket, setRooms)}
                >
                  <ReloadOutlined />
                </Button>
              </Tooltip>
            </Space>
          </Space>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
              marginTop: "10px",
            }}
          >
            <Input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
              }}
              style={{
                width: "90%",
              }}
              placeholder="Search a Nickname"
              prefix={<SearchOutlined />}
              suffix={
                search.length > 0 && (
                  <CloseCircleOutlined
                    onClick={() => {
                      setSearch("");
                      setCurrentRoom(null);
                    }}
                  />
                )
              }
            />
          </div>

          <Tabs
            centered
            defaultActiveKey={activeTab}
            items={items}
            onChange={(key: any) => {
              handleTabsChange(key);
            }}
            tabBarStyle={{
              margin: "0px",
            }}
          />

          <ProfileDrawer
            open={isProfileDrawerVisible}
            onClose={() => setIsProfileDrawerVisible(false)}
          />
          <CreateNewGroup
            setCurrentRoom={setCurrentRoom}
            open={isCreateNewGroupVisible}
            onClose={() => setIsCreateNewGroupVisible(false)}
          />
        </Col>

        <ChatRoom
          isContactInfoDrawerVisible={isContactInfoDrawerVisible}
          setIsContactInfoDrawerVisible={setIsContactInfoDrawerVisible}
          currentRoom={currentRoom}
          deleteChat={deleteChat}
          leaveGroup={leaveGroup}
          images={images}
          conversation={conversations[currentRoom?._id] || []}
          setImages={setImages}
          onFinish={onFinish}
        />

        <Col
          style={{
            overflow: "hidden",
          }}
          span={isContactInfoDrawerVisible ? 6 : 0}
        >
          <ContactInfoDrawer
            currentRoom={currentRoom}
            open={isContactInfoDrawerVisible}
            onClose={() => setIsContactInfoDrawerVisible(false)}
          />
        </Col>
      </Row>

      <AuthModal />

      <LeaveGroupModal
        leaveGroupModal={leaveGroupModal}
        setLeaveGroupModal={setLeaveGroupModal}
      />
   
      {messageApprovalStatus?.status == false && messageApprovalStatus?.senderId == user?._id
        ? user?.status === "pending" && (
            <>
              <Modal
                title="Basic Modal"
                open={messageApprovalStatus}
                onOk={()=>{
                  setMessageApprovalStatus(false)
                }}
                onCancel={()=>{
                  setMessageApprovalStatus(false)
                }}
              >
                <p>Wait for permission</p>
              </Modal>
            </>
          )
        : null}
      {/* {messageApprovalStatus
        ? user?.status === "active" && (
            <>
              <Modal
                title="Basic Modal"
                open={messageApprovalStatus}
                onOk={handleOk}
                onCancel={handleCancel}
              >
                <p>Give permission</p>
              </Modal>
            </>
          )
        : null} */}
    </div>
  );
};
export async function getServerSideProps(context: any) {
  return {
    props: {}, // will be passed to the page component as props
  };
}
ChatLayoutHome.Layout = UserLayouts;
export default ChatLayoutHome;

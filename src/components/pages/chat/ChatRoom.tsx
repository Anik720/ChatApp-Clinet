"use client";
import {
  BlockOutlined,
  DeleteOutlined,
  LoginOutlined,
  LogoutOutlined,
  MessageOutlined,
  MoreOutlined,
  ReloadOutlined,
  UserAddOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  Button,
  Col,
  Dropdown,
  Form,
  Menu,
  Modal,
  Space,
  Typography,
} from "antd";
import { useAuth } from "../../../contexts/AuthContext";
import getColor from "../../../utils/colorPicker";
import Conversation from "./Conversation";
import SentForm from "./SentForm";

import { getPublicRooms, joinGroup } from "@/utils/roomUtils";
import { useSocket } from "@/contexts/SocketContext";
import { useEffect, useState } from "react";
import { message } from "antd";
import { useRoom } from "@/contexts/RoomContext";

const ChatRoom = ({
  isContactInfoDrawerVisible,
  currentRoom,
  setIsContactInfoDrawerVisible,
  deleteChat,
  leaveGroup,
  images,
  conversation,
  setImages,
  onFinish,
}) => {
  const { user } = useAuth();
  const [form] = Form.useForm();
  const { socket } = useSocket();
  const { rooms, publicRooms, setPublicRooms } = useRoom();

  let name;
  if (currentRoom?.roomId) {
    if (currentRoom.isGroup) {
      name = currentRoom.name || "";
    } else {
      // Filter out undefined values resulting from the map function
      name = currentRoom.members
        .filter((member) => member._id !== user._id)
        .map((member) => member.name || member.nickName)
        .join(", "); // Join names with a comma and a space
    }
  } else {
    name = currentRoom?.user?.name || currentRoom?.user?.nickName || "";
  }

  useEffect(() => {
    getPublicRooms(socket, setPublicRooms);
  }, [socket]);

  const joinGroupHandler = () => {
    joinGroup(socket, currentRoom?._id);
    window.location.reload();
  };


  return (
    <Col
      span={isContactInfoDrawerVisible ? 12 : 18}
      style={{
        backgroundColor: "#F1F2F5",
      }}
    >
      {currentRoom ? (
        <>
          <Space
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "10px",
              backgroundColor: "#F0F2F5",
              margin: "0px 10px",
            }}
          >
            <Space
              style={{
                cursor: "pointer",
              }}
              onClick={() => {
                setIsContactInfoDrawerVisible(true);
              }}
            >
              <Avatar style={{ backgroundColor: getColor(name[0]) }}>
                {name[0]}
              </Avatar>
              <Typography.Text>{name}</Typography.Text>
            </Space>
            <Space>
              <Button type="text" icon={<UserAddOutlined />} />
              <Button type="text" icon={<ReloadOutlined />} />

              <Dropdown
                overlay={
                  <Menu>
                    <Menu.Item>
                      <Button
                        style={{ width: "100%", textAlign: "left" }}
                        type="text"
                        size="small"
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => {
                          deleteChat();
                        }}
                      >
                        Delete Chat
                      </Button>
                    </Menu.Item>
                    {currentRoom && !currentRoom?.isGroup && (
                      <Menu.Item>
                        <Button
                          style={{ width: "100%", textAlign: "left" }}
                          type="text"
                          size="small"
                          danger
                          icon={<BlockOutlined />}
                          onClick={() => {
                            leaveGroup();
                          }}
                        >
                          Block User
                        </Button>
                      </Menu.Item>
                    )}

                    {currentRoom && currentRoom?.isGroup && (
                      <Menu.Item>
                        <Button
                          style={{ width: "100%", textAlign: "left" }}
                          type="text"
                          size="small"
                          danger
                          icon={<LogoutOutlined />}
                          onClick={() => {
                            leaveGroup();
                          }}
                        >
                          Leave Group
                        </Button>
                      </Menu.Item>
                    )}
                  </Menu>
                }
                trigger={["click"]}
                arrow
                overlayStyle={{ width: 200 }}
                placement="bottomRight"
              >
                <a onClick={(e) => e.preventDefault()}>
                  <Button type="text" icon={<MoreOutlined />} />
                </a>
              </Dropdown>
            </Space>
          </Space>

          <Conversation
            images={images}
            conversation={conversation}
            currentRoom={currentRoom}
          />

          {!currentRoom?.isGroup ? (
            <SentForm
              setImages={setImages}
              images={images}
              onFinish={onFinish}
              form={form}
              currentRoom={currentRoom}
            />
          ) : (
            <>
              {currentRoom?.host?._id === user?._id ||
                currentRoom.members.find(
                  (member: any) => user?._id === member?._id
                ) ? (
                <SentForm
                  setImages={setImages}
                  images={images}
                  onFinish={onFinish}
                  form={form}
                  currentRoom={currentRoom}
                />
              ) : (
                <Space
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    flexDirection: "column",
                    width: "100%",
                  }}
                >
                  <Button
                    onClick={() => {
                      joinGroupHandler();
                    }}
                    style={{
                      marginTop: "20px",
                    }}
                    type="primary"
                    icon={<LoginOutlined />}
                  >
                    Join Group
                  </Button>
                </Space>
              )}
            </>
          )}
        </>
      ) : (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
            flexDirection: "column",
          }}
        >
          <MessageOutlined style={{ fontSize: 30 }} />
          <Typography.Text
            style={{
              fontSize: 20,
            }}
          >
            welcome to chat app
          </Typography.Text>
          <Typography.Text>select a chat to start messaging</Typography.Text>
        </div>
      )}


    </Col>
  );
};

export default ChatRoom;

import {
  ArrowLeftOutlined,
  BlockOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  CloseOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Avatar, Button, Divider, Drawer, Space, Typography } from "antd";
import React, { useContext } from "react";
import { AuthContext } from "../../../contexts/AuthContext";

const propsInterface = {
  onClose: () => {},
  open: false,
  currentRoom: {},
};

const ContactInfoDrawer = ({
  onClose,
  open,
  currentRoom,
}: typeof propsInterface = propsInterface) => {
  const { user } = useContext(AuthContext);

  return (
    <div>
      <Drawer
        title="Contact Info"
        placement="right"
        onClose={onClose}
        open={open}
        getContainer={false}
        width={"100%"}
        closeIcon={<CloseOutlined />}
        headerStyle={{
          backgroundColor: "#F0F2F5",
          borderLeft: "1px solid #E4E6EB",
          padding: "14px 16px",
        }}
      >
        <Space
          direction="vertical"
          align="center"
          style={{
            width: "100%",
          }}
        >
          <Avatar size={64} icon={<UserOutlined />} />
          <Typography.Title
            level={5}
            style={{
              lineHeight: 0,
              marginTop: 14,
            }}
          >
            {currentRoom?.isGroup
              ? currentRoom?.name
              : currentRoom?.members?.map((member: any) => {
                  if (member._id !== user._id) {
                    return member.name;
                  }
                })}
          </Typography.Title>
          <Typography.Text
            style={{
              lineHeight: 0,
            }}
          >
            {currentRoom?.isGroup
              ? currentRoom?.name
              : currentRoom?.members?.map((member: any) => {
                  if (member._id !== user._id) {
                    return member.phone;
                  }
                })}
          </Typography.Text>
        </Space>
        <Divider />

        <Space
          style={{
            width: "100%",
          }}
          direction="vertical"
        >
          <Button
            icon={<BlockOutlined />}
            type="text"
            block
            danger
            style={{
              width: "100%",
              textAlign: "left",
            }}
          >
            Block{" "}
            {currentRoom?.isGroup
              ? currentRoom?.name
              : currentRoom?.members?.map((member: any) => {
                  if (member._id !== user._id) {
                    return member.name;
                  }
                })}
          </Button>
          <Button
            icon={<BlockOutlined />}
            type="text"
            block
            danger
            style={{
              width: "100%",
              textAlign: "left",
            }}
          >
            Report{" "}
            {currentRoom?.isGroup
              ? currentRoom?.name
              : currentRoom?.members?.map((member: any) => {
                  if (member._id !== user._id) {
                    return member.name;
                  }
                })}
          </Button>
          <Button
            icon={<BlockOutlined />}
            type="text"
            block
            danger
            style={{
              width: "100%",
              textAlign: "left",
            }}
          >
            Delete Chat
          </Button>
        </Space>
      </Drawer>
    </div>
  );
};

export default ContactInfoDrawer;

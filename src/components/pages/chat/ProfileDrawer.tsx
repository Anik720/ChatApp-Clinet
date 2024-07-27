import {
  ArrowLeftOutlined,
  ArrowRightOutlined,
  EditOutlined,
  LogoutOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  Button,
  Divider,
  Drawer,
  Space,
  Switch,
  Typography,
} from "antd";
import React, { useContext, useEffect } from "react";
import { AuthContext } from "../../../contexts/AuthContext";
import { ThemeContext } from "../../../contexts/ThemeContext";

const propsInterface = {
  onClose: () => {},
  open: false,
};

const ProfileDrawer = ({
  onClose,
  open,
}: typeof propsInterface = propsInterface) => {
  const { user, logout } = useContext(AuthContext);
  const { isDark, setIsDark, toggleTheme } = useContext(ThemeContext);

  useEffect(() => {
    const darkMood = localStorage.getItem("darkMood");
    if (darkMood === "true") {
      setIsDark(true);
    } else {
      setIsDark(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDark]);
  return (
    <div>
      <Drawer
        title="Profile"
        placement="left"
        onClose={onClose}
        open={open}
        getContainer={false}
        width={"100%"}
        closeIcon={<ArrowLeftOutlined />}
        headerStyle={{
          backgroundColor: !isDark ? "#F0F2F5" : "",
          // borderRight: "1px solid #E4E6EB",
          padding: "14px 16px",
        }}
      >
        <Space
          direction="vertical"
          align="center"
          style={{
            width: "100%",
            textAlign: "center",
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
            {user?.name}
          </Typography.Title>
          <Typography.Text
            style={{
              lineHeight: 0,
            }}
          >
            {user?.phone}
          </Typography.Text>
        </Space>
        <Divider />
        <Space
          style={{
            width: "100%",
            justifyContent: "space-between",
          }}
        >
          <Typography.Text>Color Mood</Typography.Text>
          <Switch
            checkedChildren="Dark"
            unCheckedChildren="Light"
            checked={isDark}
            onChange={toggleTheme}
          />
        </Space>
        <Divider />

        <Space
          style={{
            width: "100%",
            justifyContent: "space-between",
          }}
        >
          <Typography.Text>Setting</Typography.Text>
          <Button icon={<EditOutlined />} type="text">
            Setting
          </Button>
        </Space>

        <Divider />
        <Space
          style={{
            width: "100%",
            justifyContent: "space-between",
          }}
        >
          <Typography.Text>Logout</Typography.Text>
          <Button icon={<LogoutOutlined />} type="text" onClick={logout}>
            Logout
          </Button>
        </Space>
      </Drawer>
    </div>
  );
};

export default ProfileDrawer;

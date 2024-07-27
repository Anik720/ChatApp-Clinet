import {
  Avatar,
  Button,
  Drawer,
  Dropdown,
  Image,
  Layout,
  Menu,
  Space,
  Switch,
  Tag,
  Typography,
} from "antd";
import React, { useContext, useEffect, useState } from "react";

import {
  LogoutOutlined,
  MailOutlined,
  MenuUnfoldOutlined,
  PhoneOutlined,
  UserOutlined,
} from "@ant-design/icons";

import { useRouter } from "next/router";
import { ThemeContext } from "../../../contexts/ThemeContext";
import { AuthContext } from "../../../contexts/AuthContext";
const { Header } = Layout;
const { Text } = Typography;

const Headers = () => {
  const { logout, user } = useContext(AuthContext);
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

  const menu = (
    <Menu
      style={{
        width: "270px",
      }}
      items={[
        {
          label: (
            <>
              <Space
                style={{
                  display: "flex",
                  justifyContent: "flex-start",
                  alignItems: "flex-start",
                  gap: "15px",
                  margin: "5px 0",
                }}
              >
                <UserOutlined />
                <Text>{user?.name}</Text>
              </Space>
            </>
          ),
          key: "1",
        },
        {
          label: (
            <>
              <Space
                style={{
                  display: "flex",
                  justifyContent: "flex-start",
                  alignItems: "flex-start",
                  gap: "15px",
                  margin: "5px 0",
                }}
              >
                <MailOutlined />
                <Text>{user?.email}</Text>
              </Space>
            </>
          ),
          key: "2",
        },
        {
          label: (
            <>
              <Space
                style={{
                  display: "flex",
                  justifyContent: "flex-start",
                  alignItems: "flex-start",
                  gap: "15px",
                  margin: "5px 0",
                }}
              >
                <PhoneOutlined />
                <Text>{user?.phone}</Text>
              </Space>
            </>
          ),
          key: "3",
        },

        {
          label: (
            <>
              <Space
                onClick={(e) => {
                  logout();
                }}
                style={{
                  display: "flex",
                  justifyContent: "flex-start",
                  alignItems: "flex-start",
                  gap: "15px",
                  margin: "5px 0",
                }}
              >
                <LogoutOutlined />
                <Text>Logout</Text>
              </Space>
            </>
          ),
          key: "4",
        },
      ]}
    />
  );
  return (
    <>
      <Header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 1,
          width: "100%",
          backgroundColor: isDark ? "#001529" : "#fff",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
          }}
        >
          <Space>
            <Switch
              checkedChildren="Dark"
              unCheckedChildren="Light"
              checked={isDark}
              onChange={toggleTheme}
            />
            <Dropdown
              placement="bottomLeft"
              arrow={{
                pointAtCenter: true,
              }}
              overlay={menu}
              trigger={["click"]}
            >
              <a onClick={(e) => e.preventDefault()}>
                <Space>
                  <Avatar />
                </Space>
              </a>
            </Dropdown>
          </Space>
        </div>
      </Header>
    </>
  );
};

export default Headers;

import React, { useContext, useEffect } from "react";
import { Image, Layout, Space, Spin } from "antd";
import { useRouter } from "next/router";
import { ThemeContext } from "../../contexts/ThemeContext";
import { AuthContext } from "../../contexts/AuthContext";
import Headers from "./Header/Headers";
import AdminMenuItem from "./MenuItem/AdminMenuItem";
import { AliwangwangOutlined } from "@ant-design/icons";

const { Sider, Content } = Layout;

const AdminLayouts = ({ children }: any) => {
  const Router = useRouter();
  const { isAuthLoading, user, checkAuth } = useContext(AuthContext);
  useEffect(() => {
    const checkAuthAsync = async () => {
      try {
        const result = await checkAuth();
      } catch (error) {
        console.log("error", error);
        Router.push("/chat");
      }
    };

    checkAuthAsync();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [Router.pathname]);

  if (!user) {
    return (
      <Content
        style={{
          height: "100vh",
          width: "100wh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Spin tip="Sit tight, we are initializing the app to be ready..."></Spin>
      </Content>
    );
  }

  return (
    <Layout>
      <Sider
        className="left-sider"
        style={{
          overflow: "auto",
          height: "100vh",
          position: "sticky",
          top: 0,
          left: 0,
          zIndex: 1,
        }}
        width={250}
        theme="light"
        collapsible
        collapsed={true}
      >
        {/* <div
          style={{
            height: 32,
            margin: 16,
            background: "#00806A",
          }}
        /> */}
        <Space
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: 54,
          }}
        >
          <AliwangwangOutlined
            style={{
              fontSize: 32,
              color: "#00806A",
            }}
          />
        </Space>

        <AdminMenuItem />
      </Sider>
      <Layout>
        <Headers />
        <Content
          style={{
            padding: "30px 34px",
            minHeight: "87vh",
          }}
        >
          {isAuthLoading ? (
            <div
              style={{
                height: "100%",
                width: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Spin tip="Sit tight, loading the page.."></Spin>
            </div>
          ) : (
            children
          )}
        </Content>
        {/* <Footers /> */}
      </Layout>
    </Layout>
  );
};

export default AdminLayouts;

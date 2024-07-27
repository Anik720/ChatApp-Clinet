import React, { useContext, useEffect } from "react";
import { Layout, Spin } from "antd";
import { useRouter } from "next/router";
import Headers from "./Header/Headers";
import Fetch from "../../utils/axios";
import { AuthContext } from "../../contexts/AuthContext";
import { ThemeContext } from "../../contexts/ThemeContext";

const { Content } = Layout;

const UserLayouts = ({ children }: any) => {
  const { isDark } = useContext(ThemeContext);
  const Router = useRouter();
  const { user, checkAuth, setIsAuthModalOpen } = useContext(AuthContext);

  useEffect(() => {
    const checkAuthAsync = async () => {
      try {
        const result = await checkAuth();
        setIsAuthModalOpen(false);
      } catch (error) {
        console.log("error", error);
        setIsAuthModalOpen(true);
      }
    };

    checkAuthAsync();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [Router.pathname]);

  // if (!user) {
  //   return (
  //     <Content
  //       style={{
  //         height: "100vh",
  //         width: "100wh",
  //         display: "flex",
  //         justifyContent: "center",
  //         alignItems: "center",
  //       }}
  //     >
  //       <Spin tip="Sit tight, we are initializing the app to be ready..."></Spin>
  //     </Content>
  //   );
  // }

  return (
    <Layout>
      {/* <Headers /> */}
      <Content
        style={{
          height: "100vh",
          maxWidth: 1920,
          minWidth: 300,
          margin: "0px auto",
          backgroundColor: !isDark ? "#D9DBDC" : "",
          // backgroundColor: "#D9DBDC",
          width: "100%",
        }}
      >
        {children}
      </Content>
    </Layout>
  );
};

export default UserLayouts;

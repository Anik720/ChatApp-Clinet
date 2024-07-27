import { Button, Result, Spin } from "antd";
import React, { useEffect, useState } from "react";
import Fetch from "../../src/utils/axios";
import { useRouter } from "next/router";
import Link from "next/link";
const Index: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);

  const [message, setMessage] = useState<string>("");
  const [resStatus, setResStatus] = useState<string>("success");

  const router = useRouter();
  const { userId } = router.query;

  const verifyUser = async () => {
    setLoading(true);
    try {
      const res = await Fetch.put(`/auth/verify-user/${userId}`);
      setMessage(res.data.message);
      setLoading(false);
      setResStatus("success");
    } catch (error: any) {
      setLoading(false);
      setMessage(error?.response?.data.message);
      setResStatus("error");
    }
  };
  useEffect(() => {
    if (userId) {
      verifyUser();
    }
  }, [userId]);
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        width: "100vw",
      }}
    >
      <Spin spinning={loading}>
        <Result
          status={resStatus || "success"}
          title={message}
          subTitle="Order number: 2017182818828182881 Cloud server configuration takes 1-5 minutes, please wait."
          extra={[
            <Button type="primary" key="login">
              <Link href={"/chat"}>Login</Link>
            </Button>,
            <Button href={"/chat"} key="register">
              Register
            </Button>,
          ]}
        />
      </Spin>
    </div>
  );
};

export default Index;

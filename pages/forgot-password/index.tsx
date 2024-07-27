import React, { useContext } from "react";
import { Space, Layout, Card, Typography, Form, Input, Button } from "antd";
import { AuthContext } from "../../src/contexts/AuthContext";

const { Content } = Layout;

const ForgotPassword = () => {
  const { isAuthLoading, forgotPassword } = useContext(AuthContext);
  const [form] = Form.useForm();

  const onFinish = (values: any) => {
    forgotPassword(values);
  };

  return (
    <Content
      style={{
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
        height: "100vh",
        backgroundColor: "#f0f2f5",
      }}
    >
      <Typography.Title level={2}>Forgot Password</Typography.Title>

      <Card style={{ width: 500 }}>
        <Form onFinish={onFinish} form={form} layout="vertical">
          <Form.Item label="Email" name="email">
            <Input placeholder="Enter your email  we can send you a reset link" />
          </Form.Item>
          <Space>
            <Button
              loading={isAuthLoading}
              disabled={isAuthLoading}
              htmlType="submit"
              type="primary"
            >
              Send
            </Button>
          </Space>
        </Form>
      </Card>
    </Content>
  );
};

export default ForgotPassword;

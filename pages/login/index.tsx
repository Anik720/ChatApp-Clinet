import React, { useContext } from "react";
import { Space, Layout, Card, Typography, Form, Input, Button } from "antd";
import { AuthContext } from "../../src/contexts/AuthContext";

const { Content } = Layout;

const Login = () => {
  const { isAuthLoading, login } = useContext(AuthContext);
  const [form] = Form.useForm();

  const onFinish = (values: any) => {
    login(values);
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
      <Typography.Title level={2}>Login</Typography.Title>

      <Card style={{ width: 500 }}>
        <Form onFinish={onFinish} form={form} layout="vertical">
          <Form.Item label="Email" name="email">
            <Input />
          </Form.Item>
          <Form.Item label="Password" name="password">
            <Input.Password />
          </Form.Item>
          <Space>
            <Button
              loading={isAuthLoading}
              disabled={isAuthLoading}
              htmlType="submit"
              type="primary"
            >
              Login
            </Button>
            <Button href="/register" type="link">
              Register
            </Button>
          </Space>
          <br />
          <br />
          <Typography.Text type="secondary">
            You lost your password? Click
          </Typography.Text>
          <Button href="/forgot-password" type="link">
            Forgot Password
          </Button>
        </Form>
      </Card>
    </Content>
  );
};

export default Login;

import { Button, Form, Input, Space, Typography } from "antd";
import React, { useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";

const LoginForm = ({ setVisibleForm }) => {
  const [form] = Form.useForm();
  const { login } = useContext(AuthContext);
  const onFinish = (values: any) => {
    login(values);
  };
  return (
    <Form onFinish={onFinish} form={form} layout="vertical">
      <Form.Item label="Email" name="email">
        <Input placeholder="Please input your email!" />
      </Form.Item>
      <Form.Item label="Password" name="password">
        <Input.Password placeholder="Please input your password!" />
      </Form.Item>
      <Space>
        <Button htmlType="submit" type="primary">
          Login
        </Button>
        <Button
          onClick={() => {
            setVisibleForm("register");
          }}
          type="link"
        >
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
  );
};

export default LoginForm;

import React, { useContext } from "react";
import { Space, Layout, Card, Typography, Form, Input, Button } from "antd";
import { AuthContext } from "../../src/contexts/AuthContext";
import { useRouter } from "next/router";

const { Content } = Layout;

const ResetPassword = () => {
  const router = useRouter();
  const { pid } = router.query;
  const { isAuthLoading, resetPassword } = useContext(AuthContext);
  const [form] = Form.useForm();

  const onFinish = (values: any) => {
    resetPassword({
      ...values,
      token: pid,
    });
  };

  const watchPassword = Form.useWatch("password", form);

  const watchConfirmPassword = Form.useWatch("confirmPassword", form);
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
      <Typography.Title level={2}>Reset Password</Typography.Title>

      <Card style={{ width: 500 }}>
        <Form onFinish={onFinish} form={form} layout="vertical">
          <Form.Item label="Password" name="password">
            <Input.Password />
          </Form.Item>
          <Form.Item label="Confirm Password" name="confirmPassword">
            <Input.Password />
          </Form.Item>

          <Space>
            <Button
              loading={isAuthLoading || watchPassword !== watchConfirmPassword}
              disabled={
                isAuthLoading ||
                watchPassword !== watchConfirmPassword ||
                !watchPassword
              }
              htmlType="submit"
              type="primary"
            >
              Reset Password
            </Button>
          </Space>
        </Form>
      </Card>
    </Content>
  );
};

export default ResetPassword;

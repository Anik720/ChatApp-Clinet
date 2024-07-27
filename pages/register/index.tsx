import React, { useContext, useState } from "react";
import {
  Button,
  Card,
  Form,
  Input,
  Layout,
  Space,
  Tooltip,
  Typography,
} from "antd";
import { AuthContext, useAuth } from "../../src/contexts/AuthContext";
import slugify from "../../src/utils/slugify";
import Fetch from "../../src/utils/axios";
import { API } from "../../src/utils/api";
import { CheckCircleTwoTone, CloseCircleTwoTone } from "@ant-design/icons";

const { Content } = Layout;

const Register = () => {
  const { register } = useAuth();
  const [form] = Form.useForm();

  const [nickNameAvailable, setNickNameAvailable] = useState<boolean>(false);

  const [nickName, setNickName] = useState<string>("");

  const onFinish = (values: any) => {
    register(values);
  };

  const checkNickName = async (value: string) => {
    try {
      const slugifyValue = slugify(value);
      form.setFieldsValue({
        nickName: slugifyValue,
      });
      setNickName(slugifyValue);
      const result = await Fetch.get(
        `${API.auth.CHECK_NICKNAME}/${slugifyValue}`
      );
      console.log("result", result);
      setNickNameAvailable(true);
    } catch (error: any) {
      setNickNameAvailable(false);
      console.log(error);
    }
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
      <Typography.Title level={2}>Register</Typography.Title>

      <Card style={{ width: 500 }}>
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item
            label="Full Name"
            name="name"
            rules={[
              {
                required: true,
                message: "Please input your full name!",
              },
            ]}
          >
            <Input placeholder="Please input your full name!" />
          </Form.Item>
          <Form.Item
            label="Nick Name"
            name="nickName"
            rules={[
              {
                required: true,
                message: "Please input your nick name!",
              },
            ]}
          >
            <Input
              placeholder="Please input your nick name!"
              onBlur={(e) => {
                checkNickName(e.target.value);
              }}
              suffix={
                nickName &&
                (nickNameAvailable ? (
                  <CheckCircleTwoTone twoToneColor="#52c41a" />
                ) : (
                  <Tooltip
                    color={"red"}
                    open={true}
                    title="This nick name is not available"
                  >
                    <CloseCircleTwoTone twoToneColor="#eb2f96" />
                  </Tooltip>
                ))
              }
            />
          </Form.Item>
          <Form.Item
            label="Email"
            name="email"
            rules={[
              {
                required: true,
                message: "Please input your email!",
              },
            ]}
          >
            <Input placeholder="Please input your email!" />
          </Form.Item>
          <Form.Item
            label="Password"
            name="password"
            rules={[
              {
                required: true,
                message: "Please input your password!",
              },
            ]}
          >
            <Input.Password placeholder="Please input your password!" />
          </Form.Item>
          <Form.Item
            label="Phone"
            name="phone"
            rules={[
              {
                required: true,
                message: "Please input your phone number!",
              },
            ]}
          >
            <Input placeholder="Please input your phone number!" />
          </Form.Item>
          <Space>
            <Button type="primary" htmlType="submit">
              Register
            </Button>
            <Button href="/login" type="link">
              Login
            </Button>
          </Space>
        </Form>
      </Card>
    </Content>
  );
};

export default Register;

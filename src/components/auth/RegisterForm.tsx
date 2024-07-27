import {
  Button,
  Col,
  Form,
  Image,
  Input,
  Row,
  Select,
  Space,
  Spin,
  Tooltip,
  Typography,
} from "antd";
import React, { useContext, useState } from "react";
import slugify from "../../utils/slugify";
import Fetch from "../../utils/axios";
import { API } from "../../utils/api";
import { AuthContext } from "../../contexts/AuthContext";
import { CheckCircleTwoTone, CloseCircleTwoTone } from "@ant-design/icons";

const RegisterForm = ({ setVisibleForm }) => {
  const { register, isAuthLoading } = useContext(AuthContext);
  const [form] = Form.useForm();

  const [nickNameAvailable, setNickNameAvailable] = useState<boolean>(false);

  const [nickName, setNickName] = useState<string>("");

  const onFinish = (values: any) => {
    register(values, form, setVisibleForm);
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

  const options = [
    {
      value: "bd",
      label: "+880",
    },
  ];

  return (
    <Spin spinning={isAuthLoading}>
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Row gutter={[16, 0]}>
          <Col span={12}>
            <Form.Item
              label="Full Name"
              name="name"
              rules={[
                {
                  required: false,
                  message: "Please input your full name!",
                },
              ]}
            >
              <Input placeholder="Please input your full name!" />
            </Form.Item>
          </Col>
          <Col span={12}>
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
          </Col>
          <Col span={12}>
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
          </Col>
          <Col span={12}>
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
          </Col>
          <Col span={24}>
            <Form.Item
              label="Phone"
              name="phone"
              rules={[
                {
                  required: false,
                  message: "Phone is required!",
                },
                {
                  max: 10,
                  message: "Phone number cant' be more than 10 digit",
                },
                {
                  min: 10,
                  message: "Phone number cant' be less than 10 digit",
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (
                      value !== undefined &&
                      value !== "" &&
                      !value.startsWith("1")
                    ) {
                      return Promise.reject(
                        new Error("Phone number must need to start with 1")
                      );
                    }
                    return Promise.resolve();
                  },
                }),
              ]}
            >
              <Space.Compact>
                <Select defaultValue="bd" options={options} />
                <Input
                  placeholder="Please input your phone number!"
                  style={{
                    width: 400,
                  }}
                />
              </Space.Compact>
              {/* <Input placeholder="Please input your phone number!" /> */}
            </Form.Item>
          </Col>
        </Row>

        <Space
          style={{
            width: "100%",
            justifyContent: "center",
          }}
        >
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
          <Button
            onClick={() => {
              setVisibleForm("login");
            }}
            type="link"
          >
            Login
          </Button>
        </Space>
      </Form>
    </Spin>
  );
};

export default RegisterForm;

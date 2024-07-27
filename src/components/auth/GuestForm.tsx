import {
  Button,
  Col,
  Form,
  Input,
  Row,
  Space,
  Tooltip,
  Typography,
} from "antd";
import React, { useContext, useState } from "react";
import slugify from "../../utils/slugify";
import Fetch from "../../utils/axios";
import { API } from "../../utils/api";
import { CheckCircleTwoTone, CloseCircleTwoTone } from "@ant-design/icons";
import { AuthContext } from "../../contexts/AuthContext";

const GuestForm = ({ setVisibleForm }) => {
  const [form] = Form.useForm();
  const { guestRegister } = useContext(AuthContext);

  const [nickNameAvailable, setNickNameAvailable] = useState<boolean>(false);

  const [nickName, setNickName] = useState<string>("");

  const onFinish = (values: any) => {
    guestRegister(values);
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
    <Form onFinish={onFinish} form={form} layout="vertical">
      <Row>
        {/* <Col span={24}>
          <Form.Item label="Full Name" name="name">
            <Input placeholder="Please input your Name!" />
          </Form.Item>
        </Col> */}
        <Col span={24}>
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
      </Row>

      <Button htmlType="submit" type="primary" disabled={!nickNameAvailable}>
        Start Chatting
      </Button>
      <ul
        style={{
          marginTop: "20px",
        }}
      >
        <li>
          <Typography.Text type="secondary">
            Already have an account?{" "}
            <Button
              type="link"
              onClick={() => {
                setVisibleForm("login");
              }}
              style={{
                padding: "5px",
              }}
            >
              Sign in
            </Button>
          </Typography.Text>
          <Typography.Text type="secondary">
            Or{" "}
            <Button
              style={{
                padding: "5px",
              }}
              type="link"
              onClick={() => {
                setVisibleForm("register");
              }}
            >
              register now!
            </Button>
          </Typography.Text>
        </li>

        <li>
          <Typography.Text type="secondary">
            Guest users can only send text messages.
          </Typography.Text>
          <br />
          <Typography.Text type="secondary">
            Please register to send images, create groups, and more.
          </Typography.Text>

          <br />
          <Typography.Text type="secondary">
            By clicking on the button above, you agree to our{" "}
            <Typography.Link href="#">Terms of Service</Typography.Link> and{" "}
            <Typography.Link href="#">Privacy Policy</Typography.Link>.
          </Typography.Text>
        </li>
      </ul>
    </Form>
  );
};

export default GuestForm;

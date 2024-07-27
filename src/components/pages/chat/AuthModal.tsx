import {
  Button,
  Col,
  Form,
  Image,
  Input,
  Modal,
  Row,
  Space,
  Typography,
} from "antd";
import React, { useContext, useEffect, useState } from "react";
import LoginForm from "../../auth/LoginForm";
import RegisterForm from "../../auth/RegisterForm";
import GuestForm from "../../auth/GuestForm";
import { AuthContext } from "../../../contexts/AuthContext";

const AuthModal = () => {
  const { isAuthModalOpen } = useContext(AuthContext);
  const [visibleForm, setVisibleForm] = useState<string>("guest");

  return (
    <Modal
      centered
      width={1000}
      open={isAuthModalOpen}
      footer={null}
      closable={false}
      style={{
        padding: "0px",
      }}
      bodyStyle={{
        padding: "0px",
        minHeight: "500px",
      }}
      maskStyle={{
        backgroundColor: "#808080",
      }}
    >
      <Row>
        <Col
          span={8}
          style={{
            borderRight: "1px solid #E5E5E5",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "100px",
          }}
        >
          <Image
            preview={false}
            src={
              "https://diviengine.com/wp-content/uploads/2023/01/ChatGPT-Logooptimized-610x610.png"
            }
            alt="logo"
            // width={200}
          />
        </Col>
        <Col span={16}>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
              padding: "100px",
            }}
          >
            {visibleForm === "login" && (
              <LoginForm setVisibleForm={setVisibleForm} />
            )}
            {visibleForm === "register" && (
              <RegisterForm setVisibleForm={setVisibleForm} />
            )}

            {visibleForm === "guest" && (
              <GuestForm setVisibleForm={setVisibleForm} />
            )}

            {visibleForm !== "guest" && (
              <div
                style={{
                  marginTop: "10px",
                }}
              >
                <Typography.Text type="secondary">
                  Continue as a guest? Click
                </Typography.Text>
                <Button
                  onClick={() => {
                    setVisibleForm("guest");
                  }}
                  type="link"
                >
                  Im a guest
                </Button>
              </div>
            )}
          </div>
        </Col>
      </Row>
    </Modal>
  );
};

export default AuthModal;

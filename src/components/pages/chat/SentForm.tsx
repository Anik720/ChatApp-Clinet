import { useSocket } from "@/contexts/SocketContext";
import {
  CloseCircleFilled,
  PictureOutlined,
  PlusOutlined,
  SendOutlined,
} from "@ant-design/icons";
import { Button, Image, Input, Space } from "antd";
import React, { useEffect } from "react";

const propsInterface = {
  form: {
    submit: () => {},
    resetFields: () => {},
  },
  onFinish: (data: any) => {},
  setImages: (data: any) => {},
  images: [],
  conversation: [],
  currentRoom: {} as any,
};

const SentForm = ({
  form,
  onFinish,
  setImages,
  images,
  conversation,
  currentRoom,
}: typeof propsInterface = propsInterface) => {
  const [textAreaValue, setTextAreaValue] = React.useState<string>("");
  const { startTyping, stopTyping } = useSocket();

  const convartToBase64 = (file: File) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = () => {
        resolve(fileReader.result);
      };
      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  };

  const handleImage = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.multiple = true;
    input.onchange = (e) => {
      const files = (e.target as HTMLInputElement).files;
      if (files) {
        for (let i = 0; i < files.length; i++) {
          convartToBase64(files[i]).then((base64) => {
            setImages([...images, base64]);
          });
        }
      }
    };
    input.click();
  };

  useEffect(() => {
    return () => {
      stopTyping(currentRoom.roomId);
    };
  }, []);

  console.log(71, currentRoom)

  return (
    <>
      {currentRoom ? (
        <div
          style={{
            backgroundColor: "#F0F2F5",
            padding: "10px",
            width: "100%",
          }}
        >
          {images.length > 0 && (
            <div
              style={{
                marginLeft: "50px",
                width: "100%",
                display: "flex",
              }}
            >
              {images.map((image, index) => {
                return (
                  <Space key={index}>
                    <Image
                      preview={false}
                      src={image}
                      alt="img"
                      style={{
                        position: "relative",
                        width: "50px",
                        height: "50px",
                        objectFit: "cover",
                        borderRadius: "10px",
                      }}
                    />
                    <CloseCircleFilled
                      style={{
                        fontSize: "15px",
                        marginTop: "-30px",
                        marginLeft: "-15px",
                        position: "absolute",
                      }}
                      onClick={() => {
                        setImages(images.filter((img, i) => i !== index));
                      }}
                    />
                  </Space>
                );
              })}
              <div
                style={{
                  height: "50px",
                  width: "50px",
                  borderRadius: "10px",
                  border: "1px dashed #BDBDBD",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  cursor: "pointer",
                }}
                onClick={() => {
                  handleImage();
                }}
              >
                <PlusOutlined />
              </div>
            </div>
          )}

          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginTop: "10px",
              width: "100%",
              gap: "10px",
            }}
          >
            <div>
              <PictureOutlined
                onClick={() => {
                  handleImage();
                }}
                style={{
                  fontSize: "20px",
                }}
              />
            </div>

            <div
              style={{
                width: "90%",
              }}
            >
              <Input.TextArea
                value={textAreaValue}
                bordered={false}
                style={{
                  backgroundColor: "#FBFBFB",
                }}
                placeholder="Type a message"
                autoSize={{
                  minRows: 1,
                  maxRows: 3,
                }}
                onChange={(e: any) => {
                  setTextAreaValue(e.target.value);
                  if (e.target.value) {
                    startTyping(currentRoom.roomId);
                  } else {
                    stopTyping(currentRoom.roomId);
                  }
                }}
                onKeyDown={(e: any) => {
                  if (e.keyCode === 13 && e.shiftKey === false) {
                    e.preventDefault();
                    onFinish({
                      message: textAreaValue,
                      images: images,
                    });
                    stopTyping(currentRoom.roomId);
                    setTextAreaValue("");
                  }
                }}
              />
            </div>
            <div>
              <Button
                size="small"
                type="primary"
                onClick={() => {
                  onFinish({
                    message: textAreaValue,
                    images: images,
                  });
                  setTextAreaValue("");
                }}
              >
                <SendOutlined />
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default SentForm;

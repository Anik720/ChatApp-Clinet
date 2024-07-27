import { ArrowLeftOutlined } from "@ant-design/icons";
import {
  Avatar,
  Button,
  Checkbox,
  Divider,
  Drawer,
  Form,
  Input,
  Select,
  Space,
  Typography,
  message,
} from "antd";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../contexts/AuthContext";
import { RoomContext } from "../../../contexts/RoomContext";
import { UserContext } from "../../../contexts/UserContext";
import NotoficationHandler from "../../../utils/notificationHandler";

const propsInterface = {
  onClose: (open: boolean) => {},
  open: false,
  setCurrentRoom: (data: any) => {},
};

const CreateNewGroup = ({
  onClose,
  open,
  setCurrentRoom,
}: typeof propsInterface = propsInterface) => {
  const { setRooms } = useContext(RoomContext);
  const { user } = useContext(AuthContext);
  const { getUsersIfRoomExits, users } = useContext(UserContext);
  const { createGroupRoom } = useContext(RoomContext);
  const [selectedUsers, setSelectedUsers] = useState<any>([]);

  const [formStep, setFormStep] = useState<number>(1);

  const [form] = Form.useForm();

  const handleChange = (value: string) => {
    setSelectedUsers(
      users &&
        users.filter((item: any) => {
          return value.includes(item._id);
        })
    );
  };

  const onFinish = (values: any) => {
    const members = selectedUsers.map((item: any) => {
      return item._id;
    });
    const data = {
      ...values,
      members,
    };

    createGroupRoom(data)
      .then((res: any) => {
        onClose(false);
        NotoficationHandler(res, "success");
        // window.location.reload();
        setCurrentRoom(res.room);
      })
      .catch((err: any) => {
        NotoficationHandler(err.data, "error");
        console.log("err", err);
      });
  };

  useEffect(() => {
    if (open) {
      getUsersIfRoomExits();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);
  const isGuestUser = user && user.type === "guest";

  const watchisPrivate = Form.useWatch("isPrivate", form);

  return (
    <Drawer
      title="Create New Group"
      placement="left"
      onClose={() => onClose(false)}
      open={open}
      getContainer={false}
      width={"100%"}
      closeIcon={<ArrowLeftOutlined />}
      headerStyle={{
        backgroundColor: "#F0F2F5",
        borderLeft: "1px solid #E4E6EB",
        padding: "14px 16px",
      }}
      extra={
        <>
          {formStep === 1 && (
            <Button
              size="small"
              type="primary"
              onClick={() => {
                setFormStep(2);
              }}
              disabled={watchisPrivate && selectedUsers.length < 2}
            >
              Next
            </Button>
          )}
          {formStep === 2 && (
            <Button
              type="primary"
              onClick={() => {
                form.submit();
              }}
              disabled={
                selectedUsers.length < 2 && watchisPrivate ? true : false
              }
            >
              Create
            </Button>
          )}
        </>
      }
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{
          isPrivate: true,
        }}
      >
        <div
          style={{
            margin: "10px 0px",
            display: formStep === 2 ? "block" : "none",
          }}
        >
          <Form.Item
            label="Group Name"
            name="name"
            rules={[
              {
                required: true,
                message: "Please input your group name!",
              },
            ]}
          >
            <Input placeholder="Group Name" />
          </Form.Item>
          <Form.Item
            label="Description"
            name="description"
            rules={[
              {
                required: false,
                message: "Please input your group name!",
              },
            ]}
          >
            <Input.TextArea placeholder="Group Name" />
          </Form.Item>
        </div>
        <div
          style={{
            display: formStep === 1 ? "block" : "none",
          }}
        >
          <Form.Item name="isPrivate" valuePropName="checked">
            <Checkbox>Private Group</Checkbox>
          </Form.Item>
          <Select
            disabled={isGuestUser}
            dropdownRender={() => <></>}
            bordered={false}
            mode="multiple"
            allowClear
            style={{ width: "100%" }}
            onChange={handleChange}
            placeholder="Please select"
            value={
              selectedUsers &&
              selectedUsers.map((item: any) => {
                return {
                  label: item.name,
                  value: item._id,
                };
              })
            }
          />

          <div
            style={{
              marginTop: "10px",
            }}
          >
            {users?.map((item: any, index: any) => {
              return (
                <div
                  key={index}
                  onClick={() => {
                    isGuestUser &&
                      message.error(
                        " You are not allowed to create group  as guest user "
                      );

                    setSelectedUsers(
                      selectedUsers &&
                        selectedUsers.map((i: any) => i._id).includes(item._id)
                        ? selectedUsers.filter((i: any) => i._id !== item._id)
                        : [...selectedUsers, item]
                    );
                  }}
                >
                  <Space
                    style={{
                      display: "flex",
                      gap: "15px",
                      padding: "10px",
                      backgroundColor:
                        selectedUsers &&
                        selectedUsers.map((i: any) => i._id).includes(item._id)
                          ? "#F0F2F5"
                          : "",
                      width: "99%",
                      cursor: "pointer",
                    }}
                  >
                    <Avatar size={"large"} />
                    <Space
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "flex-start",
                      }}
                    >
                      <Typography.Text
                        style={{
                          fontWeight: "bold",
                          lineHeight: "0",
                        }}
                      >
                        {item?.name}
                      </Typography.Text>
                      <Typography.Text
                        style={{
                          lineHeight: "0",
                        }}
                      >
                        {item?.lastConversation}
                      </Typography.Text>
                    </Space>
                  </Space>
                  <Divider
                    style={{
                      margin: "5px",
                    }}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </Form>
    </Drawer>
  );
};

export default CreateNewGroup;

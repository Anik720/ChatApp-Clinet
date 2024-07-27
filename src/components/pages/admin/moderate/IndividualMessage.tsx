import React, { useContext, useEffect } from "react";
import { Col, Form, Row, Select, Typography, Card, Space, Tabs } from "antd";
import moment from "moment";
import { AdminUserContext } from "../../../../contexts/admin/AdminUserContext";

const IndividualMessage = () => {
  const {
    adminUsers,
    getUsers,
    getRoomsByUserId,
    rooms,
    getConversationByRoomId,
    conversations,
  } = useContext(AdminUserContext);

  const [form] = Form.useForm();
  const onFinish = (values: any) => {
    console.log(values);
  };
  useEffect(() => {
    getUsers({
      page: 1,
      limit: 10,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const watchUser = Form.useWatch("userId", form);

  const watchRoom = Form.useWatch("roomId", form);

  useEffect(() => {
    if (watchUser) {
      getRoomsByUserId(watchUser);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchUser]);

  useEffect(() => {
    if (watchRoom) {
      getConversationByRoomId(watchRoom);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchRoom]);

  return (
    <div>
      <Card size="small" title="Filter">
        <Form form={form} name="basic" layout="vertical" onFinish={onFinish}>
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <Form.Item
                label="Select User"
                name="userId"
                rules={[
                  {
                    required: true,
                    message: "Please select user",
                  },
                ]}
              >
                <Select
                  style={{ width: "100%" }}
                  showSearch
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    (option?.label ?? "").includes(input)
                  }
                  filterSort={(optionA: any, optionB: any) =>
                    (optionA?.label ?? "")
                      .toLowerCase()
                      .localeCompare((optionB?.label ?? "").toLowerCase())
                  }
                  placeholder="Select a person"
                  options={adminUsers?.users.map((user: any) => {
                    return {
                      label: user.name,
                      value: user._id,
                    };
                  })}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Select Room"
                name="roomId"
                rules={[
                  {
                    required: true,
                    message: "Please select user",
                  },
                ]}
              >
                <Select
                  style={{ width: "100%" }}
                  showSearch
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    (option?.label ?? "").includes(input)
                  }
                  filterSort={(optionA, optionB) =>
                    (optionA?.label ?? "")
                      .toLowerCase()
                      .localeCompare((optionB?.label ?? "").toLowerCase())
                  }
                  placeholder="Select a room"
                  notFoundContent="First select user"
                  options={rooms.map((room) => {
                    return {
                      label: room.isGroup
                        ? room.name
                        : room.members
                            .map((member: any) => {
                              if (member._id === watchUser) return;
                              return member.name;
                            })
                            .join(""),

                      value: room._id,
                    };
                  })}
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Card>
      <Card
        style={{
          marginTop: 16,
        }}
      >
        <Space
          direction="vertical"
          style={{
            width: "100%",
            maxHeight: 500,
            overflowY: "auto",
          }}
        >
          {conversations && conversations.length > 0 ? (
            conversations.map((conversation: any, index: number) => {
              return (
                <Space
                  key={index}
                  direction="vertical"
                  style={{
                    marginBottom: 16,
                  }}
                >
                  <Typography.Text type="secondary">
                    {conversation.from.name}
                  </Typography.Text>
                  <Space
                    style={{
                      backgroundColor:
                        conversation.from._id === watchUser
                          ? "#00806A"
                          : "#f0f0f0",
                      padding: 8,
                      borderRadius: 8,
                    }}
                  >
                    <Typography.Text
                      style={{
                        color:
                          conversation.from._id === watchUser ? "#fff" : "",
                      }}
                    >
                      {conversation.message}{" "}
                    </Typography.Text>
                  </Space>
                  <Typography.Text type="secondary">
                    {" "}
                    {moment(conversation.created_at).format("DD/MM/YYYY HH:mm")}
                  </Typography.Text>
                </Space>
              );
            })
          ) : (
            <Typography.Text type="secondary">
              No conversation found
            </Typography.Text>
          )}
        </Space>
      </Card>
    </div>
  );
};

export default IndividualMessage;

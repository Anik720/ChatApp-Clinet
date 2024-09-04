import React, { useContext, useEffect, useRef, useState } from "react";
import {
  Typography,
  Card,
  Space,
  Dropdown,
  Form,
  Select,
  Row,
  Col,
  Button,
  Avatar,
  Spin,
  Popconfirm,
  message,
  Image,
} from "antd";
import moment, { min } from "moment";

import { AdminUserContext } from "../../../../contexts/admin/AdminUserContext";
import { SettingsContext } from "../../../../contexts/admin/SettingsContext";
import Fetch from "../../../../utils/axios";
import { API } from "../../../../utils/api";
import getColor from "../../../../utils/colorPicker";
import GetLink from "../../../../utils/getLink";
import { DeleteOutlined, MenuOutlined, UserOutlined } from "@ant-design/icons";

const AllMessage = () => {
  const [form] = Form.useForm();
  const conversationEndRef = useRef(null);
  const [filterLoading, setFilterLoading] = useState<boolean>(false);
  const [allConversations, setAllConversations] = useState<any>([]);
  const { getAllUser, allAdminUsers } = useContext(AdminUserContext);
  const { blockIps, isBlockIpsLoading, getBlockIps } =
    useContext(SettingsContext);
  const { getRoomsByUserId, rooms } = useContext(AdminUserContext);

  const [selectedConversation, setSelectedConversation] = useState<any>({});

  const scrollToBottom = () => {
    conversationEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(scrollToBottom, [allConversations]);

  useEffect(() => {
    filter();
    getAllUser();
    getBlockIps();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const watchUser = Form.useWatch("user", form);
  const watchIP = Form.useWatch("ip", form);
  const watchGroup = Form.useWatch("group", form);

  useEffect(() => {
    if (watchUser) {
      getRoomsByUserId(watchUser);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchUser]);

  const filter = async () => {
    setFilterLoading(true);
    try {
      const result = await Fetch.get(
        `${API.admin.conversation.GET_CONVERSATION_BY_FILTER}/${watchUser}/${watchIP}/${watchGroup}`
      );
      setFilterLoading(false);
      setAllConversations(result.data.conversations);
    } catch (error) {
      setFilterLoading(false);
      console.log(error);
      setAllConversations([]);
    }
  };

  const deleteConversation = async () => {
    try {
      const res = await Fetch.delete(
        `${API.admin.conversation.DELETE_CONVERSATION}/${selectedConversation._id}`
      );
      setAllConversations(
        allConversations.filter(
          (conversation: any) => conversation._id !== selectedConversation._id
        )
      );
      message.success(res.data.message);
    } catch (error) {
      message.error(error.response.data.message);
    }
  };

  useEffect(() => {
    if (watchUser || watchIP || watchGroup) {
      filter();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchUser, watchIP, watchGroup]);

  const items: any = [
    {
      label: (
        <Popconfirm
          title="Are you sure Delete Conversation ?"
          okText="Yes"
          cancelText="No"
          onConfirm={deleteConversation}
        >
          <Space
            style={{
              display: "flex",
              justifyContent: "flex-start",
              alignItems: "flex-start",
              gap: "15px",
              margin: "5px 0",
            }}
          >
            <DeleteOutlined
              style={{
                color: "red",
              }}
            />
            <Typography.Text type="danger">Delete Conversation</Typography.Text>
          </Space>
        </Popconfirm>
      ),
      key: "1",
    },

    {
      label: "Block User",
      key: "2",
    },
    {
      label: "Block IP",
      key: "3",
    },
  ];

  return (
    <div>
      <Card>
        <Form form={form} layout="vertical" name="filter">
          <Row gutter={[16, 16]}>
            <Col span={8}>
              <Form.Item label="User" name={"user"}>
                <Select
                  allowClear
                  style={{ width: "100%" }}
                  showSearch
                  placeholder="Select User"
                  optionFilterProp="children"
                  filterOption={(input: any, option: any) =>
                    option?.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                  options={allAdminUsers?.users?.map((user: any) => {
                    return {
                      label: user.name,
                      value: user._id,
                    };
                  })}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Ip" name={"ip"}>
                <Select
                  allowClear
                  loading={isBlockIpsLoading}
                  style={{ width: "100%" }}
                  showSearch
                  placeholder="Select ip"
                  optionFilterProp="children"
                  filterOption={(input: any, option: any) =>
                    option?.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                  options={blockIps.map((ip: any) => {
                    return {
                      label: ip.ip,
                      value: ip._id,
                    };
                  })}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Group" name={"group"}>
                <Select
                  allowClear
                  style={{ width: "100%" }}
                  showSearch
                  placeholder="Select User"
                  optionFilterProp="children"
                  filterOption={(input: any, option: any) =>
                    option?.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
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
        bodyStyle={{}}
      >
        <Space
          direction="vertical"
          style={{
            width: "100%",
            maxHeight: 500,
            overflowY: "scroll",
            overflowX: "hidden",
            scrollBehavior: "smooth",
            scrollSnapType: "y mandatory",
            flexDirection: "column-reverse",
          }}
        >
          <>
            {filterLoading ? (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: 500,
                }}
              >
                <Spin />
              </div>
            ) : (
              <>
                {allConversations?.map((conversation: any) => {
                  return (
                    <div
                      key={conversation._id}
                      style={{
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      <Space
                        style={{
                          alignItems: "flex-end",
                        }}
                      >
                        <Avatar
                          size={30}
                          style={{
                            backgroundColor: getColor(
                              conversation?.from?.name &&  conversation?.from?.name[0].toLowerCase()
                            ),
                            borderRadius: "50%",
                            color: "#fff",
                          }}
                        >
                          {         conversation?.from?.name &&  conversation?.from?.name[0]}
                        </Avatar>

                        <Space direction="vertical">
                          {conversation?.images && (
                            <Space>
                              {conversation?.images.map(
                                (image: any, index: number) => {
                                  return (
                                    <Image
                                      key={index}
                                      alt="example"
                                      width={100}
                                      height={100}
                                      style={{
                                        borderRadius: "10px",
                                        objectFit: "cover",
                                      }}
                                      src={image}
                                    />
                                  );
                                }
                              )}
                            </Space>
                          )}
                          <Space
                            style={{
                              backgroundColor: "#05705D",
                              padding: "8px 16px",
                              borderRadius: "8px 8px 8px 0px",
                              color: "#fff",
                              maxWidth: 500,
                            }}
                          >
                            <Typography.Text
                              style={{
                                color: "#fff",
                              }}
                            >
                              {GetLink(conversation?.message)}
                            </Typography.Text>
                          </Space>
                        </Space>
                        <Dropdown
                          placement="bottomLeft"
                          arrow
                          menu={{ items }}
                          trigger={["click"]}
                        >
                          <MenuOutlined
                            onClick={() => {
                              setSelectedConversation(conversation);
                            }}
                          />
                        </Dropdown>
                      </Space>
                      <Space
                        style={{
                          marginLeft: 38,
                        }}
                      >
                        <Typography.Text type="secondary">
                          {moment(conversation.created_at).format(
                            "DD/MM/YYYY HH:mm"
                          )}
                        </Typography.Text>
                        <Button
                          type="text"
                          onClick={() => {
                            form.setFieldsValue({
                              user: conversation?.from?._id,
                            });
                          }}
                          size="small"
                        >
                          {conversation?.from?.name}
                        </Button>
                        <Button
                          type="text"
                          onClick={() => {
                            form.setFieldsValue({
                              ip: conversation?.ip?._id,
                            });
                          }}
                          size="small"
                        >
                          {conversation?.ip?.ip}
                        </Button>
                        <Button
                          type="text"
                          onClick={() => {
                            form.setFieldsValue({
                              group: conversation?.roomId?._id,
                            });
                          }}
                          size="small"
                        >
                          {conversation?.roomId?.isGroup
                            ? conversation?.roomId?.name
                            : "presonal"}
                        </Button>
                      </Space>
                    </div>
                  );
                })}
              </>
            )}
          </>
        </Space>
      </Card>
    </div>
  );
};

export default AllMessage;

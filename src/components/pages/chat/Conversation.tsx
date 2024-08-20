import { CheckCircleFilled, CheckCircleOutlined } from "@ant-design/icons";
import {
  Dropdown,
  Image,
  MenuProps,
  Popconfirm,
  Space,
  Typography,
} from "antd";
import moment from "moment";
import React from "react";
import { useAuth } from "../../../contexts/AuthContext";
import { useConversation } from "../../../contexts/ConversationContext";
import { useSocket } from "@/contexts/SocketContext";
import { useRouter } from "next/router";

const propsInterface = {
  conversation: [],
  currentRoom: {
    isGroup: false,
    roomId: false,
  },
  images: [],
};

const Conversation = ({
  conversation,
  currentRoom,
  images,
}: typeof propsInterface = propsInterface) => {
  const { deleteConversation, isConversationLoading } = useConversation();
  const { user } = useAuth();
  const [selectedMessage, setSelectedMessage] = React.useState<any>(null);
  const { infoImageApprovalData, notifyMessageOfImagesData, showModal } =
    useSocket();
  const router = useRouter();
  const items: MenuProps["items"] = [
    // {
    //   label: "Contact Info",
    //   key: "1",
    // },
    // {
    //   label: "Clear Messages",
    //   key: "2",
    // },
    {
      label: (
        <Space>
          <Popconfirm
            title="Are you sure to delete this message?"
            okText="Delete"
            cancelText="Cancel"
            onConfirm={() => {
              deleteConversation(selectedMessage._id);
            }}
          >
            <Typography.Text>Delete</Typography.Text>
          </Popconfirm>
        </Space>
      ),
      key: "3",
    },
    {
      label: "Report",
      key: "4",
    },
  ];

  console.log(66, showModal, infoImageApprovalData);
  console.log(67, notifyMessageOfImagesData);
  const handleApproveImagePermission = () => {
    // approveImagePermission(
    //   currentRoom?.roomId || infoImageApprovalData?.roomId,
    //   notifyMessageOfImagesData?.senderID || infoImageApprovalData?.senderId,
    //   notifyMessageOfImagesData?.recieverId || infoImageApprovalData?.recieverId
    // );

    router.push("/image-approval-list");
  };

  return (
    <div
      style={{
        scrollSnapType: "y mandatory",
        overflowY: "auto",
        overflowX: "hidden",
        height:
          images.length > 0 ? "calc(100vh - 162px)" : "calc(100vh - 122px)",
        minHeight:
          images.length > 0 ? "calc(100vh - 162px)" : "calc(100vh - 122px)",
        display: "flex",
        flexDirection: "column-reverse",
        backgroundColor: "#EFEAE2",
      }}
    >
      <div
        style={{
          margin: "30px 0px",
        }}
      >
        {conversation?.length === 0 && (
          <div
            style={{
              textAlign: "center",
              marginBottom: "20px",
            }}
          >
            <Typography.Text>No messages yet</Typography.Text>
          </div>
        )}
        {currentRoom?.roomId ? (
          conversation?.length > 0 ? (
            conversation?.map((item: any) => {
              return (
                <div key={item._id}>
                  {item.from?._id === user?._id ? (
                    <div
                      style={{
                        scrollSnapType: "y mandatory",
                        overflowY: "auto",
                        padding: "20px",
                        width: "100%",
                        margin: "-30px 0px",
                      }}
                    >
                      <Space
                        style={{
                          display: "flex",
                          justifyContent: "flex-end",
                          margin: "0px 10px",
                          alignItems: "flex-end",
                        }}
                      >
                        <Space
                          direction="vertical"
                          style={{
                            display: "flex",
                            justifyContent: "flex-end",
                            alignItems: "flex-end",
                            gap: 0,
                          }}
                        >
                          {item.deletedByAdmin ? (
                            <Space
                              style={{
                                padding: "5px 10px 20px 10px",
                                borderRadius: "10px 10px 0px 10px",
                                maxWidth: 400,
                                minWidth: 100,
                                position: "relative",
                                border: "1px solid #028069",
                              }}
                            >
                              <Typography.Text type="secondary">
                                Deleted by Admin
                              </Typography.Text>
                              <Typography.Text
                                style={{
                                  textAlign: "right",
                                  fontSize: 10,
                                  lineHeight: 0,
                                  position: "absolute",
                                  bottom: 8,
                                  right: 10,
                                }}
                              >
                                {moment(item?.created_at).format("hh:mm a")}
                              </Typography.Text>
                            </Space>
                          ) : (
                            <>
                              {" "}
                              {item?.images && (
                                <Space>
                                  {item?.images.map(
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
                              <Dropdown
                                onOpenChange={(open) => {
                                  if (open) {
                                    setSelectedMessage(item);
                                  } else {
                                    setSelectedMessage(null);
                                  }
                                }}
                                menu={{ items }}
                                trigger={["contextMenu"]}
                              >
                                <Space
                                  style={{
                                    backgroundColor: "#028069",
                                    padding: "5px 10px 20px 10px",
                                    borderRadius: "10px 10px 0px 10px",
                                    maxWidth: 400,
                                    minWidth: 100,
                                    position: "relative",
                                  }}
                                >
                                  <Typography.Text
                                    style={{
                                      color: "#fff",
                                    }}
                                  >
                                    {item.message}
                                  </Typography.Text>
                                  <Typography.Text
                                    style={{
                                      color: "#fff",
                                      textAlign: "right",
                                      fontSize: 10,
                                      lineHeight: 0,
                                      position: "absolute",
                                      bottom: 8,
                                      right: 10,
                                    }}
                                  >
                                    {moment(item?.created_at).format("hh:mm a")}

                                    {item?.status === "seen" && (
                                      <CheckCircleFilled
                                        style={{
                                          marginLeft: "5px",
                                          fontSize: 10,
                                        }}
                                      />
                                    )}
                                    {item?.status === "sent" && (
                                      <CheckCircleOutlined
                                        style={{
                                          marginLeft: "5px",
                                          fontSize: 10,
                                        }}
                                      />
                                    )}
                                  </Typography.Text>
                                </Space>
                              </Dropdown>
                            </>
                          )}
                        </Space>
                      </Space>
                    </div>
                  ) : (
                    <div
                      style={{
                        scrollSnapType: "y mandatory",
                        overflowY: "auto",
                        padding: "20px",
                        width: "100%",
                        margin: "-30px 0px",
                      }}
                    >
                      <Space
                        style={{
                          display: "flex",
                          justifyContent: "flex-start",
                          margin: "0px 10px",
                          alignItems: "flex-end",
                        }}
                      >
                        <Space
                          direction="vertical"
                          style={{
                            display: "flex",
                            justifyContent: "flex-start",
                            alignItems: "flex-start",
                            gap: 1,
                          }}
                        >
                          {item.deletedByAdmin ? (
                            <Space
                              style={{
                                padding: "5px 10px 20px 10px",
                                borderRadius: "10px 10px 10px 0px",
                                maxWidth: 400,
                                minWidth: 100,
                                position: "relative",
                                border: "1px solid #028069",
                              }}
                            >
                              <Typography.Text type="secondary">
                                Deleted by Admin
                              </Typography.Text>
                              <Typography.Text
                                style={{
                                  textAlign: "right",
                                  fontSize: 10,
                                  lineHeight: 0,
                                  position: "absolute",
                                  bottom: 8,
                                  right: 10,
                                }}
                              >
                                {moment(item?.created_at).format("hh:mm a")}
                              </Typography.Text>
                            </Space>
                          ) : (
                            <>
                              {item?.images && (
                                <Space>
                                  {item?.images.map(
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
                              <Dropdown
                                onOpenChange={(open) => {
                                  if (open) {
                                    setSelectedMessage(item);
                                  } else {
                                    setSelectedMessage(null);
                                  }
                                }}
                                menu={{ items }}
                                trigger={["contextMenu"]}
                              >
                                <Space
                                  style={{
                                    backgroundColor: "#fff",
                                    padding: "5px 10px 15px 10px",
                                    borderRadius: "10px 10px 10px 0px",
                                    maxWidth: 400,
                                    minWidth: 100,
                                    position: "relative",
                                  }}
                                >
                                  <Typography.Text>
                                    {item.message}
                                  </Typography.Text>
                                  <Typography.Text
                                    style={{
                                      fontSize: 10,
                                      lineHeight: 0,
                                      position: "absolute",
                                      bottom: 10,
                                      right: 10,
                                    }}
                                  >
                                    {item.updated_at &&
                                      moment(item.created_at).format("h:mm a")}
                                  </Typography.Text>
                                </Space>
                              </Dropdown>
                              <Typography.Text
                                style={{
                                  fontSize: 10,
                                }}
                              >
                                {item?.from?._id === user?._id
                                  ? "Sent from you "
                                  : `sent from ${item?.from?.nickName}`}
                              </Typography.Text>
                            </>
                          )}
                        </Space>
                      </Space>
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                fontSize: "50px",
                color: "black",
                textAlign: "center",
              }}
            >
              <h1>Please Wait ...</h1>
            </div>
          )
        ) : null}

        {showModal ||
        (infoImageApprovalData && infoImageApprovalData?.status === false) ? (
          JSON.stringify(notifyMessageOfImagesData?.senderID) ===
            JSON.stringify(user?._id) ||
          JSON.stringify(infoImageApprovalData?.senderId) ===
            JSON.stringify(user?._id) ? (
            <>
              <p
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  color: "black",
                }}
              >
                You have sent an image sent request. Please, Wait for Approval.
              </p>
            </>
          ) : (
            <>
              <p
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  color: "black",
                }}
              >
                You have an image approval request
              </p>
              <span
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  textDecoration: "underline",
                  cursor: "pointer",
                  color: "black",
                }}
                onClick={handleApproveImagePermission}
              >
                {" "}
                See All
              </span>
            </>
          )
        ) : null}
      </div>
    </div>
  );
};

export default Conversation;

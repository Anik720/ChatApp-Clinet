import React, { useEffect, useState } from "react";
import AdminLayouts from "../../../src/components/layout/AdminLayouts";
import { Card, Col, Divider, Row, Space, Typography } from "antd";
import { MessageOutlined, UserOutlined } from "@ant-design/icons";
import Fetch from "../../../src/utils/axios";

const Home = () => {
  const [dashboardData, setDashboardData] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const getDashboardData = async () => {
      setLoading(true);
      try {
        const res = await Fetch.get("/admin/dashboard");
        setDashboardData(res?.data?.data);

        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };
    getDashboardData();
  }, []);

  console.log("dashboardData", dashboardData);

  return (
    <div>
      <Row gutter={[16, 16]}>
        <Col span={6}>
          <Card size="small">
            <Space
              style={{
                width: "100%",
                alignItems: "center",
              }}
            >
              <UserOutlined style={{ fontSize: "20px" }} />
              <Divider type="vertical" />
              <div
                style={{
                  lineHeight: "0px",
                }}
              >
                <Typography.Title
                  style={{
                    margin: 0,
                  }}
                  level={5}
                >
                  Total User
                </Typography.Title>
                <Typography.Title
                  style={{
                    margin: 0,
                  }}
                  level={5}
                >
                  {dashboardData.users}
                </Typography.Title>
              </div>
            </Space>
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small">
            <Space
              style={{
                width: "100%",
                alignItems: "center",
              }}
            >
              <UserOutlined style={{ fontSize: "20px" }} />
              <Divider type="vertical" />
              <div
                style={{
                  lineHeight: "0px",
                }}
              >
                <Typography.Title
                  style={{
                    margin: 0,
                  }}
                  level={5}
                >
                  Total Active Users
                </Typography.Title>
                <Typography.Title
                  style={{
                    margin: 0,
                  }}
                  level={5}
                >
                  {dashboardData.activeUsers}
                </Typography.Title>
              </div>
            </Space>
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small">
            <Space
              style={{
                width: "100%",
                alignItems: "center",
              }}
            >
              <UserOutlined style={{ fontSize: "20px" }} />
              <Divider type="vertical" />
              <div
                style={{
                  lineHeight: "0px",
                }}
              >
                <Typography.Title
                  style={{
                    margin: 0,
                  }}
                  level={5}
                >
                  Total Banned Users
                </Typography.Title>
                <Typography.Title
                  style={{
                    margin: 0,
                  }}
                  level={5}
                  type="danger"
                >
                  {dashboardData.bannedUsers}
                </Typography.Title>
              </div>
            </Space>
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small">
            <Space
              style={{
                width: "100%",
                alignItems: "center",
              }}
            >
              <UserOutlined style={{ fontSize: "20px" }} />
              <Divider type="vertical" />
              <div
                style={{
                  lineHeight: "0px",
                }}
              >
                <Typography.Title
                  style={{
                    margin: 0,
                  }}
                  level={5}
                >
                  Total Guest Users
                </Typography.Title>
                <Typography.Title
                  style={{
                    margin: 0,
                  }}
                  level={5}
                >
                  {dashboardData.guestUsers}
                </Typography.Title>
              </div>
            </Space>
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small">
            <Space
              style={{
                width: "100%",
                alignItems: "center",
              }}
            >
              <MessageOutlined style={{ fontSize: "20px" }} />
              <Divider type="vertical" />
              <div
                style={{
                  lineHeight: "0px",
                }}
              >
                <Typography.Title
                  style={{
                    margin: 0,
                  }}
                  level={5}
                >
                  Today Conversation
                </Typography.Title>
                <Typography.Title
                  style={{
                    margin: 0,
                  }}
                  level={5}
                >
                  {dashboardData.todayConversationCount}
                </Typography.Title>
              </div>
            </Space>
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small">
            <Space
              style={{
                width: "100%",
                alignItems: "center",
              }}
            >
              <MessageOutlined style={{ fontSize: "20px" }} />
              <Divider type="vertical" />
              <div
                style={{
                  lineHeight: "0px",
                }}
              >
                <Typography.Title
                  style={{
                    margin: 0,
                  }}
                  level={5}
                >
                  Last 7 Days Conversation
                </Typography.Title>
                <Typography.Title
                  style={{
                    margin: 0,
                  }}
                  level={5}
                >
                  {dashboardData.last7DaysConversationCount}
                </Typography.Title>
              </div>
            </Space>
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small">
            <Space
              style={{
                width: "100%",
                alignItems: "center",
              }}
            >
              <MessageOutlined style={{ fontSize: "20px" }} />
              <Divider type="vertical" />
              <div
                style={{
                  lineHeight: "0px",
                }}
              >
                <Typography.Title
                  style={{
                    margin: 0,
                  }}
                  level={5}
                >
                  Last 30 Days Conversation
                </Typography.Title>
                <Typography.Title
                  style={{
                    margin: 0,
                  }}
                  level={5}
                >
                  {dashboardData.last30DaysConversationCount}
                </Typography.Title>
              </div>
            </Space>
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small">
            <Space
              style={{
                width: "100%",
                alignItems: "center",
              }}
            >
              <MessageOutlined style={{ fontSize: "20px" }} />
              <Divider type="vertical" />
              <div
                style={{
                  lineHeight: "0px",
                }}
              >
                <Typography.Title
                  style={{
                    margin: 0,
                  }}
                  level={5}
                >
                  This Month Conversation
                </Typography.Title>
                <Typography.Title
                  style={{
                    margin: 0,
                  }}
                  level={5}
                >
                  {dashboardData.thisMonthConversationCount}
                </Typography.Title>
              </div>
            </Space>
          </Card>
        </Col>
      </Row>
    </div>
  );
};
Home.Layout = AdminLayouts;
export default Home;

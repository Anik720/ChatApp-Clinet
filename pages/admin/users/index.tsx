import React, { useContext, useEffect, useState } from "react";
import AdminLayouts from "../../../src/components/layout/AdminLayouts";
import {
  Button,
  Card,
  Dropdown,
  Menu,
  Popconfirm,
  Select,
  Space,
  Table,
  Tag,
  Tooltip,
  Typography,
} from "antd";
import { AdminUserContext } from "../../../src/contexts/admin/AdminUserContext";
import Link from "next/link";
import {
  DeleteOutlined,
  DownOutlined,
  DownloadOutlined,
  StopOutlined,
} from "@ant-design/icons";

const Users = () => {
  const {
    getUsers,
    adminUsers,
    isAdminUsersLoading,
    bannedUser,
    unBannedUser,
  } = useContext(AdminUserContext);
  const [status, setStatus] = useState<string>("");

  useEffect(() => {
    const data = {
      page: 1,
      limit: 10,
      status: status,
    };
    console.log("status", status);
    getUsers(data);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  const handleTableChange = (pagination: any, filters: any, sorter: any) => {
    const data = {
      page: pagination.current,
      limit: pagination.pageSize,
      status: status,
    };
    getUsers(data);
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={status === "active" ? "green" : "red"}>{status}</Tag>
      ),
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      render: (_: any, record: any) => (
        <Dropdown
          overlay={
            <Menu>
              <Menu.Item>
                {record?.status === "active" ? (
                  <Tooltip title="Ban User">
                    <Popconfirm
                      title="Are you sure？"
                      onConfirm={() => {
                        bannedUser(record._id);
                      }}
                    >
                      <Button
                        style={{ width: "100%", textAlign: "left" }}
                        type="text"
                        size="small"
                        danger
                        icon={<StopOutlined />}
                      >
                        Banned User
                      </Button>
                    </Popconfirm>
                  </Tooltip>
                ) : (
                  <Tooltip title="Ban User">
                    <Popconfirm
                      title="Are you sure？"
                      onConfirm={() => {
                        unBannedUser(record._id);
                      }}
                    >
                      <Button
                        style={{ width: "100%", textAlign: "left" }}
                        type="text"
                        size="small"
                        icon={<StopOutlined />}
                      >
                        unBanned User
                      </Button>
                    </Popconfirm>
                  </Tooltip>
                )}
              </Menu.Item>
              <Menu.Item>
                <Tooltip title="Delete">
                  <Popconfirm
                    title="Are you sure？"
                    onConfirm={() => {
                      console.log("first");
                    }}
                  >
                    <Button
                      style={{ width: "100%", textAlign: "left" }}
                      type="text"
                      size="small"
                      danger
                      icon={<DeleteOutlined />}
                    >
                      Delete
                    </Button>
                  </Popconfirm>
                </Tooltip>
              </Menu.Item>
            </Menu>
          }
          trigger={["click"]}
          arrow
          overlayStyle={{ width: 200 }}
          placement="bottomRight"
        >
          <a onClick={(e) => e.preventDefault()}>
            <Button size="small">
              Action
              <DownOutlined />
            </Button>
          </a>
        </Dropdown>
      ),
    },
  ];
  return (
    <div>
      <Card
        size="small"
        title="Users"
        style={{
          marginTop: "10px",
        }}
        extra={
          <Space
            style={{
              padding: "10px",
            }}
          >
            <Typography.Text type="secondary">
              Filter by status:
            </Typography.Text>
            <Select
              onChange={(value) => {
                setStatus(value);
              }}
              defaultValue="all"
              style={{ width: 120 }}
              options={[
                { value: "all", label: "All" },
                { value: "banned", label: "Banned" },
              ]}
            ></Select>
          </Space>
        }
      >
        <Table
          size="small"
          loading={isAdminUsersLoading}
          dataSource={adminUsers?.users}
          columns={columns}
          // pagination on change
          onChange={handleTableChange}
          rowKey={(record) => record._id}
          // show data total
          pagination={{
            total: adminUsers?.total,
            showSizeChanger: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} items`,
          }}
        />
      </Card>
    </div>
  );
};

Users.Layout = AdminLayouts;

export default Users;

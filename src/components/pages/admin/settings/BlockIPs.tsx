import {
  Button,
  Divider,
  Dropdown,
  Form,
  Input,
  Menu,
  Popconfirm,
  Space,
  Table,
  Tag,
  Tooltip,
  Typography,
} from "antd";
import React, { useContext, useEffect } from "react";
import { DeleteOutlined, DownOutlined, RedoOutlined } from "@ant-design/icons";
import { SettingsContext } from "../../../../contexts/admin/SettingsContext";

const BlockIPs = () => {
  const [form] = Form.useForm();
  const { blockIps, isBlockIpsLoading, getBlockIps, addNewBlockIP, DeleteIp } =
    useContext(SettingsContext);

  useEffect(() => {
    getBlockIps();
  }, []);

  const onFinish = (values: any) => {
    addNewBlockIP(values, form);
  };
  const columns = [
    {
      title: "SL",
      dataIndex: "sl",
      key: "sl",
      render: (text: any, record: any, index: number) => index + 1,
    },
    {
      title: "Ip",
      dataIndex: "ip",
      key: "ip",
    },
    {
      title: "Staus",
      dataIndex: "status",
      key: "status",
      render: (_: any, record: any) => (
        <Tag color={record.status === "active" ? "green" : "red"}>
          {record.status}
        </Tag>
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
                <Tooltip title="Release">
                  <Popconfirm
                    title="Are you sure？"
                    onConfirm={() => {
                      DeleteIp(record._id);
                    }}
                  >
                    <Button
                      style={{ width: "100%", textAlign: "left" }}
                      type="text"
                      size="small"
                      icon={<RedoOutlined />}
                    >
                      Release IP
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
      <Form
        form={form}
        name="basic"
        initialValues={{
          remember: true,
        }}
        onFinish={onFinish}
        layout="vertical"
      >
        <Form.Item
          label={<Typography.Text>Ip Address example(0.0.0.0)</Typography.Text>}
          name="ip"
          rules={[
            {
              required: true,
              message: "Please input your ip!",
            },
          ]}
        >
          <Input placeholder="Type here..." />
        </Form.Item>
        <Space
          style={{
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Space>
      </Form>
      <Divider orientation="left">Block List</Divider>{" "}
      <Table
        size="small"
        loading={isBlockIpsLoading}
        dataSource={blockIps}
        columns={columns}
      />
    </div>
  );
};

export default BlockIPs;

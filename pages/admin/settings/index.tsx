import React from "react";
import { Card, Space, Tabs, Typography } from "antd";
import type { TabsProps } from "antd";
import AdminLayouts from "../../../src/components/layout/AdminLayouts";
import FilterWord from "../../../src/components/pages/admin/settings/FilterWord";
import BlockDevice from "../../../src/components/pages/admin/settings/BlockDevice";
import BlockIPs from "../../../src/components/pages/admin/settings/BlockIPs";

const Settings = () => {
  const onChange = (key: string) => {
    console.log(key);
  };

  const items: TabsProps["items"] = [
    {
      key: "1",
      label: `Filter Words`,
      children: <FilterWord />,
    },
    {
      key: "2",
      label: `Block Devices`,
      children: <BlockDevice />,
    },
    {
      key: "3",
      label: `Block IPs`,
      children: <BlockIPs />,
    },
  ];
  return (
    <div>
      <Space
        style={{
          display: "flex",
          justifyContent: "center",
          width: "100%",
          flexDirection: "column",
          marginBottom: "20px",
        }}
      >
        <Typography.Title
          level={3}
          style={{
            lineHeight: 0,
          }}
        >
          Settings
        </Typography.Title>
        <Typography.Text type="secondary">Manage your settings</Typography.Text>
      </Space>
      <Card
        size="small"
        style={{
          maxWidth: 1200,
          margin: "0px auto",
        }}
        bodyStyle={{
          padding: "20px",
        }}
      >
        <Tabs centered defaultActiveKey="1" items={items} onChange={onChange} />
      </Card>
    </div>
  );
};

Settings.Layout = AdminLayouts;

export default Settings;

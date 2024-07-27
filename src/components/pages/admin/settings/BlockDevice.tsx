import { Divider, Form, Input, Table } from "antd";
import React, { useEffect } from "react";
import { SettingsContext } from "../../../../contexts/admin/SettingsContext";

const BlockDevice = () => {
  const { getDevices, devices, isDevicesLoading } =
    React.useContext(SettingsContext);

  useEffect(() => {
    getDevices();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const columns = [
    {
      title: "SL",
      dataIndex: "sl",
      key: "sl",
      render: (_: any, record: any, index: number) => {
        return <span>{index + 1}</span>;
      },
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (_: any, record: any) => {
        return <span>{record?.deviceInfo?.device?.brand}</span>;
      },
    },
    {
      title: "Age",
      dataIndex: "age",
      key: "age",
      render: (_: any, record: any) => {
        console.log("record", record);
        return <span>{record?.deviceInfo?.device?.brand}</span>;
      },
    },
    {
      title: "Brand",
      dataIndex: "address",
      key: "address",
      render: (_: any, record: any) => {
        console.log("record", record);
        return <span>{record?.deviceInfo?.device?.brand}</span>;
      },
    },
  ];
  return (
    <div>
      <Form>
        <Form.Item label="">
          <Input placeholder="Search" />
        </Form.Item>
      </Form>
      <Divider orientation="left">Block List</Divider>{" "}
      <Table dataSource={devices} columns={columns} />
    </div>
  );
};

export default BlockDevice;
<h1>Block Device</h1>;

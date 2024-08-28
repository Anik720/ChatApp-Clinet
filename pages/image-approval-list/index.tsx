import React, { useContext, useEffect, useState } from "react";
import {
  Button,
  Card,
  Modal,
  Select,
  Space,
  Table,
  Typography,
} from "antd";

import { AdminUserContext } from "@/contexts/admin/AdminUserContext";
import UserLayoutsApproval from "@/components/layout/UserLayoutsApproval";
import Fetch from "@/utils/axios";
import { useAuth } from "@/contexts/AuthContext";
import { useSocket } from "@/contexts/SocketContext";

const imageApproval = () => {
  const {
    getUsers,
    adminUsers,
    isAdminUsersLoading,
  } = useContext(AdminUserContext);
  const [allData, setAllData] = useState<any>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentApprovalData, setCurrentApprovalData] = useState<any>(null);
  const { user } = useAuth();
  const {

    approveImagePermission,

  } = useSocket();
  const func = async () => {
    if (user) {
      const result = await Fetch.get(
        `/room/get-image-approval-list?userId=${user?._id}`
      );

      setAllData(result?.data?.list);
    }
  };
  useEffect(() => {
    func();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user,allData]);

  const handleTableChange = (pagination: any, filters: any, sorter: any) => {
    const data = {
      page: pagination.current,
      limit: pagination.pageSize,
      status: status,
    };
    getUsers(data);
  };

  const handleApproveImagePermission = () => {
    func();
    if (currentApprovalData) {
      approveImagePermission(
        currentApprovalData.roomId,
        currentApprovalData.senderId._id,
        currentApprovalData.recieverId._id
      );
      setIsModalVisible(false);
    }
  };

  const showApproveModal = (record: any) => {
    setCurrentApprovalData(record);
    setIsModalVisible(true);
  };

  const columns = [
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (status ? "Approved" : "Pending"),
    },
    {
      title: "Sender Name",
      dataIndex: ["senderId", "name"],
      key: "senderId",
    },
    {
      title: "Receiver Name",
      dataIndex: ["recieverId", "name"],
      key: "recieverId",
    },
    {
      title: "Requested Date",
      dataIndex: "created_at",
      key: "created_at",
      render: (date) => new Date(date).toLocaleString(),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) =>
        record.status ? (
          <Button>Approved</Button>
        ) : (
          <Button type="primary" onClick={() => showApproveModal(record)}>
            Approve
          </Button>
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
              // onChange={(value) => {
              //   setStatus(value);
              // }}
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
          dataSource={allData?.length > 0 ? allData : []}
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

      <Modal
        title="Approve Image Permission"
        visible={isModalVisible}
        onOk={handleApproveImagePermission}
        onCancel={() => setIsModalVisible(false)}
      >
        <p>Are you sure you want to approve this image permission?</p>
      </Modal>
    </div>
  );
};

imageApproval.Layout = UserLayoutsApproval;
export default imageApproval;

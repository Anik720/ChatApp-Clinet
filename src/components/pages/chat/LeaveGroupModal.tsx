import { Modal } from "antd";
import React from "react";

const propsInterface = {
  leaveGroupModal: false,
  setLeaveGroupModal: (value: boolean) => {},
};

const LeaveGroupModal = ({
  leaveGroupModal,
  setLeaveGroupModal,
}: typeof propsInterface = propsInterface) => {
  return (
    <div>
      <Modal
        title="Basic Modal"
        open={leaveGroupModal}
        onCancel={() => setLeaveGroupModal(false)}
      >
        <p>Some contents...</p>
        <p>Some contents...</p>
        <p>Some contents...</p>
      </Modal>
    </div>
  );
};

export default LeaveGroupModal;

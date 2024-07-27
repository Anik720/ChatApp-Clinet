import React from "react";
import AdminLayouts from "../../../src/components/layout/AdminLayouts";
import { Tabs, TabsProps } from "antd";
import IndividualMessage from "../../../src/components/pages/admin/moderate/IndividualMessage";
import AllMessage from "../../../src/components/pages/admin/moderate/AllMessage";

const ModerateMessage = () => {
  const items: TabsProps["items"] = [
    {
      key: "1",
      label: `Individual`,
      children: <IndividualMessage />,
    },
    {
      key: "2",
      label: `all`,
      children: <AllMessage />,
    },
  ];
  const onChange = (key: string) => {
    console.log(key);
  };
  return (
    <div>
      <Tabs centered defaultActiveKey="1" items={items} onChange={onChange} />
    </div>
  );
};

ModerateMessage.Layout = AdminLayouts;

export default ModerateMessage;

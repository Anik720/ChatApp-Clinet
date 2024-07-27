import { Button, Result } from "antd";
import React from "react";

const Index = () => {
  return (
    <div
      style={{
        height: "100vh",
        width: "100wh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Result
        status="404"
        title="404"
        subTitle="Sorry, the page you visited does not exist."
        // extra={<Button type="primary">Back Home</Button>}
      />
    </div>
  );
};

export default Index;

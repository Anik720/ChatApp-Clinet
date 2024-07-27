import React from "react";
import Linkify from "react-linkify";

const GetLink = (data: any) => {
  return (
    <div>
      <Linkify
        properties={{
          target: "_blank",
          style: { color: "red" },
        }}
      >
        {data}
      </Linkify>
    </div>
  );
};

export default GetLink;

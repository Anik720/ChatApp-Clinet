import React, { useState } from "react";
import { Menu, Typography } from "antd";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  MessageOutlined,
  PieChartOutlined,
  SettingOutlined,
  UserOutlined,
  WindowsOutlined,
} from "@ant-design/icons";

const ImageApprovalMenuItem = () => {
  const router = useRouter();

  function getItem(
    label: React.ReactNode,
    key: React.Key,
    icon?: React.ReactNode,
    children?: any,
    type?: "group"
  ) {
    return {
      label,
      key,
      icon,
      children,
      type,
    };
  }

  const items = [
    getItem(
      "",
      "main",
      null,
      [

        getItem(
          <Link
            style={{
              fontSize: 14,
            }}
            href="/chat"
          >
            Moderate messages
          </Link>,
          "moderate-message",
          <MessageOutlined />
        ),
      ],
      "group"
    ),

  ];

  return (
    <div>
      <Menu mode="inline" theme="light" items={items} />
    </div>
  );
};

export default ImageApprovalMenuItem;

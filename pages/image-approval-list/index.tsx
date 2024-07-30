'use client'
import React, { useContext, useEffect } from "react";
import { Space, Layout, Card, Typography, Form, Input, Button } from "antd";
import { AuthContext, useAuth } from "../../src/contexts/AuthContext";
import Fetch from "@/utils/axios";

const imageApproval =  () => {
  const { user } = useAuth();
  // const res = await Fetch.get(`/get-image-approval-lis?userId=${user?._id}`);
  // console.log(16, res)
  useEffect(() => {

    const getDashboardData = async () => {

      try {
        if(user?._id){
          console.log(17,user?._id)
          const res = await Fetch.get(`/room/get-image-approval-list?userId=${user?._id}`);
          console.log(16, res)
        }


      } catch (error) {

      }
    };
    getDashboardData();
  }, [user]);

  return (
    <h1>Hello</h1>
  )
};

export default imageApproval;

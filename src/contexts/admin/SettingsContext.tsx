import React, { createContext, useState } from "react";
import Fetch from "../../utils/axios";
import { API } from "../../utils/api";
import NotoficationHandler from "../../utils/notificationHandler";

export const SettingsContext = createContext({
  blockIps: [],
  isBlockIpsLoading: false,
  getBlockIps: () => {},
  addNewBlockIP: (data: object, form: any) => {},
  DeleteIp: (id: string) => {},
  addFilterWord: (data: object) => {},
  getFilterWords: () => {},
  filters: [],
  isFilterWordsLoading: false,
  getDevices: () => {},
  devices: [],
  isDevicesLoading: false,
});

export default function SettingsContextProvider({ children }: any) {
  const [blockIps, setBlockIps] = useState([]);
  const [filters, setFilters] = useState([]);
  const [devices, setDevices] = useState([]);

  const [isBlockIpsLoading, setIsBlockIpsLoading] = useState<boolean>(false);
  const [isFilterWordsLoading, setIsFilterWordsLoading] =
    useState<boolean>(false);
  const [isDevicesLoading, setIsDevicesLoading] = useState<boolean>(false);

  const getBlockIps = async () => {
    setIsBlockIpsLoading(true);
    try {
      const result = await Fetch.get(API.admin.ip.IPs);
      setBlockIps(result.data.ips);
      setIsBlockIpsLoading(false);
    } catch (error: any) {
      setIsBlockIpsLoading(false);
      console.log(error);
    }
  };

  const addNewBlockIP = async (data: any, form: any) => {
    setIsBlockIpsLoading(true);
    try {
      const result = await Fetch.post(API.admin.ip.IPs, {
        ip: data.ip,
      });
      form.resetFields();
      setIsBlockIpsLoading(false);
      NotoficationHandler(result.data, "success");
      getBlockIps();
    } catch (error: any) {
      NotoficationHandler(error.response.data, "error");
      setIsBlockIpsLoading(false);
      console.log(error);
    }
  };

  const DeleteIp = async (id: string) => {
    setIsBlockIpsLoading(true);
    try {
      const result = await Fetch.delete(`${API.admin.ip.IPs}/${id}`);
      setIsBlockIpsLoading(false);
      NotoficationHandler(result.data, "success");
      getBlockIps();
    } catch (error: any) {
      NotoficationHandler(error?.response?.data, "error");
      setIsBlockIpsLoading(false);
      console.log(error);
    }
  };

  const getFilterWords = async () => {
    setIsFilterWordsLoading(true);
    try {
      const result = await Fetch.get(API.admin.filter.FILTERS);
      setFilters(result.data.filter);
      setIsFilterWordsLoading(false);
    } catch (error: any) {
      setIsFilterWordsLoading(false);
      console.log(error);
    }
  };

  const addFilterWord = async (data: any) => {
    console.log("data", data);
    setIsFilterWordsLoading(true);
    try {
      const result = await Fetch.post(API.admin.filter.FILTERS, {
        words: data.words,
      });
      setIsFilterWordsLoading(false);
      NotoficationHandler(result.data, "success");
    } catch (error: any) {
      NotoficationHandler(error.response.data, "error");
      setIsFilterWordsLoading(false);
      console.log(error);
    }
  };

  const getDevices = async () => {
    setIsDevicesLoading(true);
    try {
      const result = await Fetch.get(API.admin.device.DEVICE_URL);
      setDevices(result.data.device);
      setIsDevicesLoading(false);
    } catch (error: any) {
      console.log(error);
      setIsDevicesLoading(false);
    }
  };

  return (
    <SettingsContext.Provider
      value={{
        blockIps,
        isBlockIpsLoading,
        getBlockIps,
        addNewBlockIP,
        DeleteIp,
        addFilterWord,
        getFilterWords,
        filters,
        isFilterWordsLoading,
        getDevices,
        devices,
        isDevicesLoading,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

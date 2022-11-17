import axios from "axios";
import { ErrorInfo, useState } from "react";

const basicApi = () =>
  axios.create({
    headers: {
      "Content-Type": "application/json",
    },
  });
export default function useApi<T = any>(url: string) {
  const postApi = async (data: T) => {
    try {
      const result = await basicApi().post(url, data);
      return result.data;
    } catch (err: any) {
      throw err.response.data;
    }
  };
  const getApi = async () => {
    try {
      const result = await basicApi().get(url);
      return result.data;
    } catch (err: any) {
      throw err.response.data;
    }
  };

  const deleteApi = async (data: T) => {
    try {
      const result = await basicApi().delete(url, { data });
      return result.data;
    } catch (err: any) {
      throw err.response.data;
    }
  };
  const putApi = async (data: T) => {
    try {
      const result = await basicApi().put(url, data);
      return result.data;
    } catch (err: any) {
      throw err.response.data;
    }
  };
  return { postApi, getApi, deleteApi, putApi };
}

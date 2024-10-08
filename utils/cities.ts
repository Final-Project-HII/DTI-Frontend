import { City } from "@/types/cities";
import axios from "axios";
import { BASE_URL_DEV } from "./api";

const BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}api`;

export const getAllCity = async (): Promise<City[]> => {
  const response = await axios.get(`${BASE_URL}/cities`);
  return response.data.data;
};

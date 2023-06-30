import { API_URL } from "@/lib/config";
import axios from "axios";

export const getNewAccessToken = async (refreshToken: string) => {
  await axios
    .post(`${API_URL}/refresh`, { refreshToken: refreshToken })
    .then(async (res) => {
      return res.data.data;
    })
    .catch((err) => {
      console.log(err);
    });
};

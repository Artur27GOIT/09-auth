import axios from "axios";

const publicApiUrl = (
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000"
).replace(/\/$/, "");

export const api = axios.create({
  baseURL: `${publicApiUrl}/api`,
  withCredentials: true,
});

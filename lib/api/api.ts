import axios from "axios";

const normalizeUrl = (value: string) => value.replace(/\/$/, "");

const resolveServerBaseUrl = () => {
  if (process.env.NEXT_PUBLIC_API_URL) {
    return normalizeUrl(process.env.NEXT_PUBLIC_API_URL);
  }

  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${normalizeUrl(process.env.VERCEL_PROJECT_PRODUCTION_URL)}`;
  }

  if (process.env.VERCEL_URL) {
    return `https://${normalizeUrl(process.env.VERCEL_URL)}`;
  }

  return "http://localhost:3000";
};

const baseURL =
  typeof window === "undefined" ? `${resolveServerBaseUrl()}/api` : "/api";

export const api = axios.create({
  baseURL,
  withCredentials: true,
});

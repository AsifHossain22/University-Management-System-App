import { ofetch } from "ofetch";

const apiClient = ofetch.create({
  baseURL: "/api/backend",
  credentials: "include",
});

export default apiClient;

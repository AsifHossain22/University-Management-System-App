import { ofetch } from 'ofetch';
import { getAccessToken } from '@/lib/auth-storage';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const apiClient = ofetch.create({
  baseURL: BASE_URL,

  onRequest({ options }) {
    const accessToken = getAccessToken();

    if (!accessToken) {
      return;
    }

    const headers = new Headers(options.headers);

    headers.set('Authorization', `Bearer ${accessToken}`);

    options.headers = headers;
  },
});

export default apiClient;

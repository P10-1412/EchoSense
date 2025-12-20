import axios from 'axios';

const APP_ID = import.meta.env.VITE_APP_ID;

const apiClient = axios.create({
  timeout: 60000,
  headers: {
    'Content-Type': 'application/json',
    'X-App-Id': APP_ID,
  },
});

apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    console.error('API 请求错误:', error);
    if (error.response?.data?.status === 999) {
      throw new Error(error.response.data.msg);
    }
    return Promise.reject(error);
  }
);

const api = {
  // 网页内容总结
  webSummary: (webUrl: string, query: string) =>
    apiClient.post(
      'https://api-integrations.appmiaoda.com/app-8cr4d2k2ascg/api-1mELbNm0Lx8v/v2/components/c-wf-e1bc471f-1d33-4df1-ab42-87800e89c1ad',
      {
        parameters: {
          _sys_origin_query: query,
          web_url: [webUrl]
        }
      }
    ),
};

export default api;

// 文心大模型API端点
export const WENXIN_CHAT_ENDPOINT = 'https://api-integrations.appmiaoda.com/app-8cr4d2k2ascg/api-2bk93oeO9NlE/v2/chat/completions';

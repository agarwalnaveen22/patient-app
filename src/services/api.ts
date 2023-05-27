import axios from 'axios';

export const postRequest = async (url: string, body: any, headers?: any) => {
  try {
    const response = await axios.post(url, body, headers);
    return response;
  } catch (error) {
    return error;
  }
};

import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios'

const BaseUrl = process.env.REACT_APP_API

export const axiosClient = axios.create({
  baseURL: BaseUrl,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000
});

{/*
axiosClient.interceptors.request.use((config) => {
  if (config.headers !== undefined) {
    // ヘッダにアクセストークンを埋める
    // const accessToken = getAccessToken()
    // if (accessToken) {
    //   config.headers.Authorization = `Bearer ${accessToken}`
    // }
  }
  return config
})
*/}
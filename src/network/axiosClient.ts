import axios, { AxiosInstance } from 'axios';
import { useAppStore } from '../lib/store';
import appConfiguration from '../appconfig.json'

//export const baseServerUrl = appConfiguration.serverUrl

export const baseServerUrl = `https://localhost:7065/api`;
//export const baseServerUrl = `https://localhost:7093/api`;

export const axiosClient : AxiosInstance = axios.create({
    baseURL: baseServerUrl,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  }); 

  axiosClient.interceptors.request.use((config) => {
    const token = useAppStore.getState().token
    if(token !== undefined){
      config.headers.Authorization = `Bearer ${token}`
    }
    return config;
  })
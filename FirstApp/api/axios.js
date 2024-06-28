import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8000/api/v1.0/', 
});
axiosInstance.interceptors.request.use(
    async (config) => {
        
        if (!config.url.endsWith('/users/login/')) {
            const token = await AsyncStorage.getItem('accessToken');
            if (token) {
                config.headers['Authorization'] = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

  


axiosInstance.interceptors.response.use(
    response => response,
    async (error) => {
      const originalRequest = error.config;
      if (error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        const refreshToken = await AsyncStorage.getItem('refreshToken');
        if (refreshToken) {
          try {
            const refreshTokenResponse = await axiosInstance.post('/token/refresh/', {
              refresh: refreshToken
            });
  
            if (refreshTokenResponse.status === 200) {
              const { access } = refreshTokenResponse.data;
              await AsyncStorage.setItem('accessToken', access);
              axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${access}`;
              originalRequest.headers['Authorization'] = `Bearer ${access}`;
              return axiosInstance(originalRequest);
            }
          } catch (refreshError) {
            console.error("Unable to refresh token:", refreshError);
            return Promise.reject(refreshError);
          }
        }
      }
      return Promise.reject(error);
    }
  );
    

export default axiosInstance;

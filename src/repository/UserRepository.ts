import { AxiosRequestConfig } from "axios";
import requestBackEnd from "../utils/request";
const findMe = async () => {
  const config : AxiosRequestConfig={
    url:"/users/me",
    withCredentials:true
    
  }
    
    try {
      const response=await requestBackEnd(config)
      
      return response
    } catch (error) {
      console.error(error);
      throw error;
    }
  };
  export {findMe}
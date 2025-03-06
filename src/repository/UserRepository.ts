import { AxiosRequestConfig } from "axios";
import requestBackEnd from "../utils/request";
const findMe = async () => {
  const config : AxiosRequestConfig={
    url:"/users/me",
    withCredentials:true
    
  }
    
    try {
      const user=await requestBackEnd(config)
      console.log(user)
      return user
    } catch (error) {
      console.error(error);
      throw error;
    }
  };
  export {findMe}
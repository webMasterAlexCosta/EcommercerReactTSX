import requestBackEnd from "../utils/request";
import { TOKEN_KEY } from "../utils/system";
import * as credentialRespository from "./CredenciaisRepository"
const findMe = async () => {
    const headers={
        Authorization: "Bearer "+ credentialRespository.get(TOKEN_KEY)
    }
    
    try {
      const user=await requestBackEnd({url:`/users/me`,headers})
      console.log(user)
      return user
    } catch (error) {
      console.error(error);
      throw error;
    }
  };
  export {findMe}
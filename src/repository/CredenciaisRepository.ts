import { TOKEN_KEY } from "../utils/system"

const logout=()=>{
    return localStorage.removeItem(TOKEN_KEY)
}
const save=(token:string)=>{
    return localStorage.setItem(TOKEN_KEY,token)
}

const get=(TOKEN_KEY:string)=>{
    return localStorage.getItem(TOKEN_KEY)
}
export {logout,save,get}
import {storageCarrinho} from "../utils/system"

const getCarrinho=()=>{
    return localStorage.getItem(storageCarrinho)
  }
  
  const setCarrinho=(key:string , value:string)=>{
    return localStorage.setItem(key,value)
  }
  
  const removeCarrinho = (key:string)=>{
    return localStorage.removeItem(key)
  }
export {getCarrinho,setCarrinho,removeCarrinho}
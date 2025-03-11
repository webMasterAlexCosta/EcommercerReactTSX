import * as carrinhoRepository from "../repository/CarrinhoRepository"

const getCarrinho=()=>{
  const cart = carrinhoRepository.getCarrinho()
  if(cart){
    return cart
  }
    
  }
  
  const setCarrinho=(key:string , value:string)=>{
    return carrinhoRepository.setCarrinho(key,value)
  }
  
  const removeCarirnho = (key:string)=>{
    return carrinhoRepository.removeCarrinho(key)
  }
const enviarPedido = ()=>{
    
      return carrinhoRepository.enviarPedido()
}

  export {getCarrinho,setCarrinho,removeCarirnho,enviarPedido}
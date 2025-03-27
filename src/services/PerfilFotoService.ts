import * as fotoPerfilRepository from "../repository/FotoPerfilRepository"

const saveFoto = (foto: string) => {
  fotoPerfilRepository.saveFoto(foto);
  return;
};
const getFoto = () => {
  return fotoPerfilRepository.getFoto();
};
const deleteFoto = async () => {
  if (await fotoPerfilRepository.deleteFoto()) return true;
  return false;
};

const enviarFotoService= async(foto:File | string)=>{
  const response = await fotoPerfilRepository.enviarFotoRepository(foto)
  return response
}
const salvarFotoNoLocalStorage =async(url:string)=>{
  fotoPerfilRepository.salvarFotoNoLocalStorage(url)
}
export { saveFoto, getFoto, deleteFoto ,enviarFotoService,salvarFotoNoLocalStorage};

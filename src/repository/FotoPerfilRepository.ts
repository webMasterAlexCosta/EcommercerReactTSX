import {
  getAccessTokenPayload,
  isAuthenticated,
} from "../services/AuthService";
import requestBackEnd from "../utils/request";
import { API_IMGBB, FOTO_PERFIL_LINK, FOTO_PERFIL_LOCAL } from "../utils/system";

const dataURLtoBlob = (dataURL: string) => {
  const [meta, base64] = dataURL.split(",");
  const byteString = atob(base64);
  const mimeString = meta.split(";")[0].split(":")[1];
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  return new Blob([ab], { type: mimeString });
};

const saveFoto = (foto: string) => {
  localStorage.setItem(FOTO_PERFIL_LINK, foto);
};

const getFoto = () => {
  if (localStorage.getItem(FOTO_PERFIL_LOCAL)) {
    return localStorage.getItem(FOTO_PERFIL_LOCAL);
  } else {
    return localStorage.getItem(FOTO_PERFIL_LINK);
  }
};

const deleteFoto = async () => {
  if (await isAuthenticated()) {
    const usuario = await getAccessTokenPayload();

    if (usuario && usuario.sub) {
      await requestBackEnd({
        method: "DELETE",
        url: `/api/usuarios/${usuario.sub}/foto`,
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
    } else {
      throw new Error("Usuário não encontrado ou inválido.");
    }
    localStorage.removeItem(FOTO_PERFIL_LINK);
    localStorage.removeItem(FOTO_PERFIL_LOCAL);
    return true;
  }
  return false;
};

const enviarFotoRepository = async (foto: File | string) => {
  const usuario = await getAccessTokenPayload();
  if (usuario && await isAuthenticated()) {
    const formData = new FormData();

    if (typeof foto === "string") {
      const blob = dataURLtoBlob(foto);
      formData.append("image", blob);
    } else {
      formData.append("image", foto);
    }

    try {
      const response = await fetch(
        `https://api.imgbb.com/1/upload?key=${API_IMGBB}`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (data.success) {
        const urlFoto = data.data.url;
        saveFoto(urlFoto);
        salvarFotoNoLocalStorage(urlFoto);
        const userDTO = { fotoPerfil: urlFoto };

        const updateResponse = await requestBackEnd({
          method: "PUT",
          url: `/api/usuarios/${usuario.sub}/foto`,
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
          data: userDTO,
        });
        return updateResponse;
      }
    } catch (error) {
      console.error("Error uploading photo:", error);
      throw error;
    }
  }
};
const salvarFotoNoLocalStorage = async (url: string) => {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64data = reader.result as string;
      localStorage.setItem(FOTO_PERFIL_LOCAL, base64data); 
    };
    reader.readAsDataURL(blob); 
  } catch (error) {
    console.error("Erro ao salvar a foto no localStorage:", error);
  }
};

export {
  saveFoto,
  getFoto,
  deleteFoto,
  enviarFotoRepository,
  salvarFotoNoLocalStorage,
};

import CryptoJS from 'crypto-js';

export class CriptografiaAES {
  public static decrypt(encryptedData: string, chaveBase64: string): string {
    if (!encryptedData || !chaveBase64) {
      throw new Error("Dados criptografados ou chave ausentes.");
    }

    try {
      const chaveBytes = CryptoJS.enc.Base64.parse(chaveBase64);

      const encryptedDataBytes = CryptoJS.enc.Base64.parse(encryptedData);

      const ivBytes = CryptoJS.lib.WordArray.create(encryptedDataBytes.words.slice(0, 4)); 
      const dataBytes = CryptoJS.lib.WordArray.create(encryptedDataBytes.words.slice(4));

      const decrypted = CryptoJS.AES.decrypt(
        CryptoJS.lib.CipherParams.create({
          ciphertext: dataBytes,
        }),
        chaveBytes,
        {
          iv: ivBytes,
          mode: CryptoJS.mode.CBC,
          padding: CryptoJS.pad.Pkcs7,
        }
      );

      const decryptedData = decrypted.toString(CryptoJS.enc.Utf8);

      if (!decryptedData) {
        throw new Error("Falha ao descriptografar os dados ou dados vazios.");
      }

      return decryptedData; 
    } catch (error) {
      console.error("Erro ao descriptografar:", error);
      throw new Error("Erro durante a descriptografia");
    }
  }
}

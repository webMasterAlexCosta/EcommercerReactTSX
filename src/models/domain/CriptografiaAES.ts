export class CriptografiaAES {
  private static IV_SIZE = 12; // Tamanho recomendado para GCM
  private static TAG_SIZE = 128; // Autenticação de 128 bits

  public static async decrypt(DADOCIFRAFADO: string, CHAVECIFRADO: string): Promise<string> {
    if (!DADOCIFRAFADO || !CHAVECIFRADO) {
      throw new Error("Dados criptografados ou chave ausente.");
    }

    try {
      // Converte a chave e os dados criptografados de Base64 para Uint8Array
      const chaveBytes = this.base64ToUint8Array(CHAVECIFRADO);
      const encryptedBytes = this.base64ToUint8Array(DADOCIFRAFADO);

      // Extrai IV e dados criptografados
      const iv = encryptedBytes.slice(0, this.IV_SIZE); // IV é extraído da parte inicial dos bytes
      const encryptedData = encryptedBytes.slice(this.IV_SIZE); // Dados criptografados começam após o IV

      // Importa a chave para uso com a API Web Crypto
      const key = await window.crypto.subtle.importKey(
        "raw",
        chaveBytes,
        { name: "AES-GCM" },
        false,
        ["decrypt"]
      );

      // Descriptografa os dados
      const decryptedBuffer = await window.crypto.subtle.decrypt(
        {
          name: "AES-GCM",
          iv,
          tagLength: this.TAG_SIZE,
        },
        key,
        encryptedData
      );

      // Converte o buffer de volta para string (decodificando os dados)
      const decodedData = new TextDecoder().decode(decryptedBuffer);

      // Retorna os dados descriptografados como string
      return decodedData;
    } catch (error) {
      console.error("Erro ao descriptografar:", error);
      throw new Error("Erro durante a descriptografia");
    }
  }

  private static base64ToUint8Array(base64: string): Uint8Array {
    const binaryString = atob(base64);
    return new Uint8Array(binaryString.split("").map((char) => char.charCodeAt(0)));
  }
}


















//versao 1
/*export class CriptografiaAES {
  private static IV_SIZE = 12; // Tamanho recomendado para GCM
  private static TAG_SIZE = 128; // Autenticação de 128 bits

  public static async decrypt(encryptedDataBase64: string, chaveBase64: string): Promise<string> {
    if (!encryptedDataBase64 || !chaveBase64) {
      throw new Error("Dados criptografados ou chave ausente.");
    }

    try {
      const chaveBytes = Uint8Array.from(atob(chaveBase64), (c) => c.charCodeAt(0));
      const encryptedBytes = Uint8Array.from(atob(encryptedDataBase64), (c) => c.charCodeAt(0));

      const iv = encryptedBytes.slice(0, this.IV_SIZE); // Extrai o IV
      const encryptedData = encryptedBytes.slice(this.IV_SIZE); // Extrai os dados criptografados

      // Importa a chave no formato correto para a API Web Crypto
      const key = await window.crypto.subtle.importKey(
        "raw",
        chaveBytes,
        { name: "AES-GCM" },
        false,
        ["decrypt"]
      );

      // Descriptografar os dados
      const decryptedBuffer = await window.crypto.subtle.decrypt(
        {
          name: "AES-GCM",
          iv: iv,
          tagLength: this.TAG_SIZE,
        },
        key,
        encryptedData
      );

      return new TextDecoder().decode(decryptedBuffer); // Converte de volta para string UTF-8
    } catch (error) {
      console.error("Erro ao descriptografar:", error);
      throw new Error("Erro durante a descriptografia");
    }
  }
}
*/
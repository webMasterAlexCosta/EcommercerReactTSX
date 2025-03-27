export class CriptografiaAES {
  private static IV_SIZE = 12;
  private static TAG_SIZE = 128; 

  public static async deriveSecondKeyFromFirst(
    firstKeyBase64: string
  ): Promise<string> {
    const firstKeyBytes = this.base64ToUint8Array(firstKeyBase64);

    const salt = new TextEncoder().encode("derivation_salt"); 

    try {
      const hmacKey = await window.crypto.subtle.importKey(
        "raw",
        firstKeyBytes, 
        { name: "HMAC", hash: "SHA-512" }, 
        false,
        ["sign"]
      );

     
      const derivedKeyBuffer = await window.crypto.subtle.sign(
        { name: "HMAC" },
        hmacKey,
        salt 
      );

      const derivedKey = new Uint8Array(derivedKeyBuffer.slice(0, 16)); 
      return this.uint8ArrayToBase64(derivedKey); 
    } catch (error) {
      console.error("Erro ao derivar a segunda chave:", error);
      throw new Error("Erro ao derivar a segunda chave.");
    }
  }

  public static generateRandomKeyBase64(): string {
    const keyBytes = window.crypto.getRandomValues(new Uint8Array(16)); 
    return this.uint8ArrayToBase64(keyBytes);
  }

  private static uint8ArrayToBase64(array: Uint8Array): string {
    let binaryString = "";
    array.forEach((byte) => {
      binaryString += String.fromCharCode(byte);
    });
    return btoa(binaryString);
  }

  private static base64ToUint8Array(base64: string): Uint8Array {
    const binaryString = atob(base64); 
    return new Uint8Array(
      binaryString.split("").map((char) => char.charCodeAt(0))
    );
  }

  public static async encrypt(
    encryptedData: string,
    chaveBase64: string
  ): Promise<string> {
    if (!encryptedData || !chaveBase64) {
      throw new Error("Dados ou chave ausente.");
    }

    const chaveBytes = this.base64ToUint8Array(chaveBase64);
    const iv = window.crypto.getRandomValues(new Uint8Array(12)); 

    try {
      const key = await window.crypto.subtle.importKey(
        "raw", 
        chaveBytes,
        { name: "AES-GCM" },
        false, 
        ["encrypt"] 
      );

      const encryptedBuffer = await window.crypto.subtle.encrypt(
        { name: "AES-GCM", iv, tagLength: 128 },
        key, 
        new TextEncoder().encode(encryptedData)
      );

      return this.uint8ArrayToBase64(new Uint8Array(encryptedBuffer)); 
    } catch (error) {
      console.error("Erro ao criptografar os dados:", error);
      throw new Error("Erro ao criptografar os dados.");
    }
  }

  public static async decrypt(
    encryptedData: string,
    chaveBase64: string
  ): Promise<string> {
    if (!encryptedData || !chaveBase64) {
      throw new Error("Dados criptografados ou chave ausente.");
    }

    try {
      const chaveBytes = this.base64ToUint8Array(chaveBase64);
      const encryptedBytes = this.base64ToUint8Array(encryptedData);

      const iv = encryptedBytes.slice(0, this.IV_SIZE); 
      const encryptedPayload = encryptedBytes.slice(this.IV_SIZE); 

      const key = await window.crypto.subtle.importKey(
        "raw", 
        chaveBytes, 
        { name: "AES-GCM" }, 
        false, 
        ["decrypt"] 
      );

      const decryptedBuffer = await window.crypto.subtle.decrypt(
        { name: "AES-GCM", iv, tagLength: this.TAG_SIZE }, 
        key, 
        encryptedPayload 
      );

      const decodedData = new TextDecoder().decode(decryptedBuffer);
      return decodedData;
    } catch (error) {
      console.error("Erro ao descriptografar:", error);
      throw new Error("Erro durante a descriptografia");
    }
  }
}

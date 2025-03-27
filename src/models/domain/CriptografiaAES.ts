export class CriptografiaAES {
  private static IV_SIZE = 12; 
  private static TAG_SIZE = 128;

  public static async obfuscateKey(chaveBase64: string, secretKeyBase64: string): Promise<string> {
    const chaveBytes = this.base64ToUint8Array(chaveBase64);
    const secretKeyBytes = this.base64ToUint8Array(secretKeyBase64);

    try {
      const secretKey = await window.crypto.subtle.importKey(
        "raw",
        secretKeyBytes,
        { name: "AES-GCM" },
        false,
        ["encrypt", "decrypt"]
      );

      const iv = window.crypto.getRandomValues(new Uint8Array(12));

      const encryptedKey = await window.crypto.subtle.encrypt(
        { name: "AES-GCM", iv, tagLength: 128 },
        secretKey,
        chaveBytes
      );

      return this.uint8ArrayToBase64(new Uint8Array(encryptedKey));
    } catch  {
      throw new Error("Erro ao ofuscar a chave.");
    }
  }

  public static async deobfuscateKey(ofuscatedKeyBase64: string, secretKeyBase64: string): Promise<string> {
    const ofuscatedKey = this.base64ToUint8Array(ofuscatedKeyBase64);
    const secretKeyBytes = this.base64ToUint8Array(secretKeyBase64);

    try {
      const secretKey = await window.crypto.subtle.importKey(
        "raw",
        secretKeyBytes,
        { name: "AES-GCM" },
        false,
        ["decrypt"]
      );

      const iv = ofuscatedKey.slice(0, 12);
      const encryptedKey = ofuscatedKey.slice(12);

      const decryptedKeyBuffer = await window.crypto.subtle.decrypt(
        { name: "AES-GCM", iv, tagLength: 128 },
        secretKey,
        encryptedKey
      );

      return this.uint8ArrayToBase64(new Uint8Array(decryptedKeyBuffer));
    } catch  {
      throw new Error("Erro ao desofuscar a chave.");
    }
  }

  public static async encrypt(encryptedData: string, chaveBase64: string): Promise<string> {
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
    } catch  {
      throw new Error("Erro ao criptografar os dados.");
    }
  }

  public static async decrypt(encryptedData: string, chaveBase64: string): Promise<string> {
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
        {
          name: "AES-GCM",
          iv,
          tagLength: this.TAG_SIZE,
        },
        key,
        encryptedPayload
      );

      const decodedData = new TextDecoder().decode(decryptedBuffer);

      return decodedData;
    } catch  {
      throw new Error("Erro durante a descriptografia");
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
    return new Uint8Array(binaryString.split("").map((char) => char.charCodeAt(0)));
  }

 
}

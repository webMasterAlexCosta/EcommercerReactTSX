const CriptografiaAES = {
  IV_SIZE: 12,
  TAG_SIZE: 128,

  async deriveSecondKeyFromFirst(firstKeyBase64: string): Promise<string> {
    const firstKeyBytes = this.base64ToUint8Array(firstKeyBase64);
    const salt = new TextEncoder().encode("derivation_salt"); // Salt fixo (idealmente, deve ser aleatório)

    try {
      const baseKey = await window.crypto.subtle.importKey(
        "raw",
        firstKeyBytes,
        { name: "PBKDF2" },
        false,
        ["deriveBits"]
      );

      const derivedBits = await window.crypto.subtle.deriveBits(
        {
          name: "PBKDF2",
          salt,
          iterations: 100000,
          hash: "SHA-256",
        },
        baseKey,
        256
      );

      const derivedKey = new Uint8Array(derivedBits).slice(0, 16); // Pegando os primeiros 32 bytes (AES-256)
      return this.uint8ArrayToBase64(derivedKey);
    } catch (error) {
      console.error("Erro ao derivar a segunda chave:", error);
      throw new Error("Erro ao derivar a segunda chave.");
    }
  },

  generateRandomKeyBase64(): string {
    const keyBytes = window.crypto.getRandomValues(new Uint8Array(16)); // 32 bytes para AES-256
    return this.uint8ArrayToBase64(keyBytes);
  },

  uint8ArrayToBase64(array: Uint8Array): string {
    return btoa(String.fromCharCode(...array));
  },

  base64ToUint8Array(base64: string): Uint8Array {
    return Uint8Array.from(atob(base64), (char) => char.charCodeAt(0));
  },

  async encrypt(data: string, keyBase64: string): Promise<string> {
    if (!data || !keyBase64) {
      throw new Error("Dados ou chave ausente.");
    }

    const keyBytes = this.base64ToUint8Array(keyBase64);
    const iv = window.crypto.getRandomValues(new Uint8Array(this.IV_SIZE));

    try {
      const key = await window.crypto.subtle.importKey(
        "raw",
        keyBytes,
        { name: "AES-GCM" },
        false,
        ["encrypt"]
      );

      const encryptedBuffer = await window.crypto.subtle.encrypt(
        { name: "AES-GCM", iv, tagLength: this.TAG_SIZE },
        key,
        new TextEncoder().encode(data)
      );

      // Concatenar IV + Dados Criptografados
      const encryptedData = new Uint8Array([...iv, ...new Uint8Array(encryptedBuffer)]);
      return this.uint8ArrayToBase64(encryptedData);
    } catch (error) {
      console.error("Erro ao criptografar os dados:", error);
      throw new Error("Erro ao criptografar os dados.");
    }
  },

  async decrypt(encryptedData: string, keyBase64: string): Promise<string> {
    if (!encryptedData || !keyBase64) {
      throw new Error("Dados criptografados ou chave ausente.");
    }

    try {
      const keyBytes = this.base64ToUint8Array(keyBase64);
      const encryptedBytes = this.base64ToUint8Array(encryptedData);

      // Separar IV e Payload Criptografado
      const iv = encryptedBytes.slice(0, this.IV_SIZE);
      const encryptedPayload = encryptedBytes.slice(this.IV_SIZE);

      const key = await window.crypto.subtle.importKey(
        "raw",
        keyBytes,
        { name: "AES-GCM" },
        false,
        ["decrypt"]
      );

      const decryptedBuffer = await window.crypto.subtle.decrypt(
        { name: "AES-GCM", iv, tagLength: this.TAG_SIZE },
        key,
        encryptedPayload
      );

      return new TextDecoder().decode(decryptedBuffer);
    } catch (error) {
      console.error("Erro ao descriptografar:", error);
      throw new Error("Erro durante a descriptografia.");
    }
  }
};

export default CriptografiaAES;

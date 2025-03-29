class PedidoCriptografia {
  private static IV_SIZE = 12;
  private static TAG_SIZE = 128;

  static generateRandomKey(): string {
    const keyBytes = window.crypto.getRandomValues(new Uint8Array(32)); 
    return this.uint8ArrayToBase64(keyBytes);
  }

  private static uint8ArrayToBase64(array: Uint8Array): string {
    return btoa(String.fromCharCode(...array));
  }

  private static base64ToUint8Array(base64: string): Uint8Array {
    return Uint8Array.from(atob(base64), (char) => char.charCodeAt(0));
  }

  static async encrypt(data: string, keyBase64: string): Promise<string> {
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

      const encryptedData = new Uint8Array([...iv, ...new Uint8Array(encryptedBuffer)]);
      return this.uint8ArrayToBase64(encryptedData);
    } catch (error) {
      console.error("Erro ao criptografar os dados:", error);
      throw new Error("Erro ao criptografar os dados.");
    }
  }
}

export default PedidoCriptografia;

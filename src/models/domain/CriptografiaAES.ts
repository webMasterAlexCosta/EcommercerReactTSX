const CriptografiaAES = {
    IV_SIZE: 12, 
    SALT_SIZE: 16, 
    ITERATIONS: 1000,  // Aumentado para aumentar a segurança
    ALGORITHM: 'AES-GCM',
  
    async deriveSecondKeyFromFirst(firstKeyBase64: string): Promise<string> {
      const firstKeyBytes = this.base64ToUint8Array(firstKeyBase64);
      const salt = window.crypto.getRandomValues(new Uint8Array(this.SALT_SIZE)); // Salt aleatório agora
  
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
            iterations: this.ITERATIONS,
            hash: "SHA-512",
          },
          baseKey,
          256
        );
  
        const derivedKey = new Uint8Array(derivedBits).slice(0, 32); // Pegando os 32 bytes (AES-256)
        return this.uint8ArrayToBase64(derivedKey);
      } catch (error) {
        console.error("Erro ao derivar a segunda chave:", error);
        throw new Error("Erro ao derivar a segunda chave.");
      }
    },
  
    generateRandomKeyBase64(): string {
      const keyBytes = window.crypto.getRandomValues(new Uint8Array(32)); // 32 bytes para AES-256
      return this.uint8ArrayToBase64(keyBytes);
    },
  
    uint8ArrayToBase64(array: Uint8Array): string {
      return btoa(String.fromCharCode(...array));
    },
  
    base64ToUint8Array(base64: string): Uint8Array {
      return Uint8Array.from(atob(base64), (char) => char.charCodeAt(0));
    },
  
    async encrypt(data: string, password: string): Promise<string> {
      const passwordBuffer = new TextEncoder().encode(password);
      const salt = window.crypto.getRandomValues(new Uint8Array(this.SALT_SIZE));
  
      const keyMaterial = await window.crypto.subtle.importKey(
        'raw',
        passwordBuffer,
        { name: 'PBKDF2' },
        false,
        ['deriveKey']
      );
  
      const key = await window.crypto.subtle.deriveKey(
        {
          name: 'PBKDF2',
          salt: salt,
          iterations: this.ITERATIONS,
          hash: 'SHA-512'  
        },
        keyMaterial,
        { name: this.ALGORITHM, length: 256 },  
        false,
        ['encrypt']
      );
  
      const iv = window.crypto.getRandomValues(new Uint8Array(this.IV_SIZE));
  
      const encryptedData = await window.crypto.subtle.encrypt(
        {
          name: this.ALGORITHM,
          iv: iv
        },
        key,
        new TextEncoder().encode(data)
      );
  
      const combined = new Uint8Array([
        ...salt,
        ...iv,
        ...new Uint8Array(encryptedData)
      ]);
  
      return this.uint8ArrayToBase64(combined);
    },
  
    async decrypt(encryptedData: string, password: string): Promise<string> {
      const binaryString = atob(encryptedData);
      const combined = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        combined[i] = binaryString.charCodeAt(i);
      }
  
      const salt = combined.slice(0, this.SALT_SIZE);
      const iv = combined.slice(this.SALT_SIZE, this.SALT_SIZE + this.IV_SIZE);
      const data = combined.slice(this.SALT_SIZE + this.IV_SIZE);
  
      const passwordBuffer = new TextEncoder().encode(password);
      const keyMaterial = await window.crypto.subtle.importKey(
        'raw',
        passwordBuffer,
        { name: 'PBKDF2' },
        false,
        ['deriveKey']
      );
  
      const key = await window.crypto.subtle.deriveKey(
        {
          name: 'PBKDF2',
          salt: salt,
          iterations: this.ITERATIONS,
          hash: 'SHA-512'  
        },
        keyMaterial,
        { name: this.ALGORITHM, length: 256 }, 
        false,
        ['decrypt']
      );
  
      const decrypted = await window.crypto.subtle.decrypt(
        {
          name: this.ALGORITHM,
          iv: iv
        },
        key,
        data
      );
  
      return new TextDecoder().decode(decrypted);
    }
  };
  
  export default CriptografiaAES;
  
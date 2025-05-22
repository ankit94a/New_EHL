// encryption.service.ts
import { Injectable } from '@angular/core';
import { environment } from '../enviroments/environments.development';

@Injectable({ providedIn: 'root' })
export class EncryptionService {
  static encryptObjectValues(wing: any) {
    throw new Error('Method not implemented.');
  }
  private password = environment.encryptionKey;
  private iterations = 150000;
  private saltLength = 16;
  private ivLength = 12;

  private async deriveKey(salt: Uint8Array): Promise<CryptoKey> {
    const enc = new TextEncoder();
    const keyMaterial = await crypto.subtle.importKey(
      'raw',
      enc.encode(this.password),
      'PBKDF2',
      false,
      ['deriveKey']
    );
    return crypto.subtle.deriveKey(
      { name: 'PBKDF2', salt, iterations: this.iterations, hash: 'SHA-512' },
      keyMaterial,
      { name: 'AES-GCM', length: 256 },
      false,
      ['encrypt', 'decrypt']
    );
  }

  private bufferToBase64(buffer: ArrayBuffer): string {
    return btoa(String.fromCharCode(...new Uint8Array(buffer)));
  }

  private base64ToBuffer(base64: string): ArrayBuffer {
    const binary = atob(base64);
    return Uint8Array.from(binary, (char) => char.charCodeAt(0)).buffer;
  }

  public async encrypt(plainText: string): Promise<string> {
    const enc = new TextEncoder();
    const salt = crypto.getRandomValues(new Uint8Array(this.saltLength));
    const iv = crypto.getRandomValues(new Uint8Array(this.ivLength));
    const key = await this.deriveKey(salt);
    const cipher = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      key,
      enc.encode(plainText)
    );
    const combined = new Uint8Array([
      ...salt,
      ...iv,
      ...new Uint8Array(cipher),
    ]);
    return this.bufferToBase64(combined.buffer);
  }

  public async decrypt(encrypted: string): Promise<string> {
    const buffer = this.base64ToBuffer(encrypted);
    const bytes = new Uint8Array(buffer);
    const salt = bytes.slice(0, this.saltLength);
    const iv = bytes.slice(this.saltLength, this.saltLength + this.ivLength);
    const cipherText = bytes.slice(this.saltLength + this.ivLength);
    const key = await this.deriveKey(salt);
    const decrypted = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      key,
      cipherText
    );
    return new TextDecoder().decode(decrypted);
  }

  public async encryptObjectValues(obj: any): Promise<any> {
    const encrypted: any = {};
    for (const key in obj) {
      const val = obj[key];
      encrypted[key] =
        typeof val === 'string' || typeof val === 'number'
          ? await this.encrypt(String(val))
          : val;
    }
    return encrypted;
  }

  public async decryptObjectValues(obj: any): Promise<any> {
    const decrypted: any = {};
    for (const key in obj) {
      const val = obj[key];
      try {
        decrypted[key] = await this.decrypt(val);
      } catch {
        decrypted[key] = val;
      }
    }
    return decrypted;
  }

public async decryptResponseList(data: any[]): Promise<any[]> {
  return await Promise.all(
    data.map(async (item: any) => {
      const decryptedItem: any = {};

      for (const [key, value] of Object.entries(item)) {
        if (typeof value === 'string') {
          decryptedItem[key] = await this.safeDecrypt(value);
        } else {
          decryptedItem[key] = value;
        }
      }

      return decryptedItem;
    })
  );
}
private async safeDecrypt(value: string): Promise<string> {
  // Check if it "looks like" an encrypted base64 string (length + allowed chars)
  const base64Regex = /^[A-Za-z0-9+/=]{40,}$/;

  if (!base64Regex.test(value)) {
    return value; // Not encrypted, return as-is
  }

  try {
    return await this.decrypt(value); // Your real decrypt logic
  } catch (err) {
    console.warn('Failed to decrypt, returning plain value:', err);
    return value; // If decryption fails, treat as plain text
  }
}


}

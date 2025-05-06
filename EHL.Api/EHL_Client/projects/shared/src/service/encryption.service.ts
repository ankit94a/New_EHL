import { Injectable } from '@angular/core';
import { environment } from '../enviroments/environments.development';

@Injectable({
  providedIn: 'root'
})
export class EncryptionService {
  // Use the environment secret as the basis for key derivation.
  private password = environment.encryptionKey;
  // Recommended iterations for PBKDF2 (can be increased for extra security, at the cost of performance)
  private iterations = 150000;//100000
  // Lengths in bytes for salt and initialization vector (IV)
  private saltLength = 16; // 128-bit salt
  private ivLength = 12;   // 96-bit IV for AES-GCM

  // Derive a CryptoKey from the password and salt using PBKDF2
  private async deriveKey(salt: Uint8Array): Promise<CryptoKey> {
    const enc = new TextEncoder();
    // Import the password as a raw key for PBKDF2
    const keyMaterial = await crypto.subtle.importKey(
      'raw',
      enc.encode(this.password),
      'PBKDF2',
      false,
      ['deriveKey']
    );
    // Derive a 256-bit AES key using the provided salt and a high iteration count
    return crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: salt,
        iterations: this.iterations,
        hash: 'SHA-512'
      },
      keyMaterial,
      {
        name: 'AES-GCM',
        length: 256
      },
      false,
      ['encrypt', 'decrypt']
    );
  }

  // Helper: Convert an ArrayBuffer to a base64 string
  private bufferToBase64(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  }

  // Helper: Convert a base64 string back to an ArrayBuffer
  private base64ToBuffer(base64: string): ArrayBuffer {
    const binary = window.atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes.buffer;
  }

  // Encrypts plaintext and returns a base64 encoded string containing: salt | iv | ciphertext
  public async encrypt(plainText: string): Promise<string> {
    const enc = new TextEncoder();
    // Generate a random salt and IV
    const salt = crypto.getRandomValues(new Uint8Array(this.saltLength));
    const iv = crypto.getRandomValues(new Uint8Array(this.ivLength));

    // Derive an AES-256-GCM key from the password using the random salt
    const key = await this.deriveKey(salt);

    // Encrypt the plaintext using the derived key and IV
    const cipherBuffer = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv: iv },
      key,
      enc.encode(plainText)
    );

    // Combine salt, IV, and ciphertext into one ArrayBuffer
    const combinedBuffer = new Uint8Array(salt.byteLength + iv.byteLength + cipherBuffer.byteLength);
    combinedBuffer.set(salt, 0);
    combinedBuffer.set(iv, salt.byteLength);
    combinedBuffer.set(new Uint8Array(cipherBuffer), salt.byteLength + iv.byteLength);

    // Encode the combined buffer as base64 and return
    return this.bufferToBase64(combinedBuffer.buffer);
  }

  // Decrypt a base64 encoded string (which contains salt | iv | ciphertext)
  public async decrypt(encryptedData: string): Promise<string> {
    // Convert the base64 input back to an ArrayBuffer
    const combinedBuffer = this.base64ToBuffer(encryptedData);
    const combined = new Uint8Array(combinedBuffer);

    // Extract the salt, IV, and ciphertext based on their byte lengths
    const salt = combined.slice(0, this.saltLength);
    const iv = combined.slice(this.saltLength, this.saltLength + this.ivLength);
    const cipherText = combined.slice(this.saltLength + this.ivLength);

    // Re-derive the AES key using the extracted salt
    const key = await this.deriveKey(salt);

    // Decrypt the ciphertext using the same parameters
    const decryptedBuffer = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv: iv },
      key,
      cipherText
    );

    const dec = new TextDecoder();
    return dec.decode(decryptedBuffer);
  }
}

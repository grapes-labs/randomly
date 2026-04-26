import SparkMD5 from "spark-md5";
import { sha3_256, sha3_512 } from "@noble/hashes/sha3.js";
import { blake3 } from "@noble/hashes/blake3.js";
import { bytesToHex } from "@noble/hashes/utils.js";

export async function sha256(message: string): Promise<string> {
  const msgUint8 = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

export async function sha512(message: string): Promise<string> {
  const msgUint8 = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest("SHA-512", msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

export async function sha1(message: string): Promise<string> {
  const msgUint8 = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest("SHA-1", msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

export async function md5(message: string): Promise<string> {
  return SparkMD5.hash(message);
}

export async function sha3_256_func(message: string): Promise<string> {
  const msgUint8 = new TextEncoder().encode(message);
  return bytesToHex(sha3_256(msgUint8));
}

export async function sha3_512_func(message: string): Promise<string> {
  const msgUint8 = new TextEncoder().encode(message);
  return bytesToHex(sha3_512(msgUint8));
}

export async function blake3_func(message: string): Promise<string> {
  const msgUint8 = new TextEncoder().encode(message);
  return bytesToHex(blake3(msgUint8));
}

export async function hashFile(file: File, algorithm: string): Promise<string> {
  const buffer = await file.arrayBuffer();
  if (algorithm === "MD5") {
    return SparkMD5.ArrayBuffer.hash(buffer);
  }
  if (algorithm === "SHA3-256") {
    return bytesToHex(sha3_256(new Uint8Array(buffer)));
  }
  if (algorithm === "SHA3-512") {
    return bytesToHex(sha3_512(new Uint8Array(buffer)));
  }
  if (algorithm === "BLAKE3") {
    return bytesToHex(blake3(new Uint8Array(buffer)));
  }
  const hashBuffer = await crypto.subtle.digest(algorithm, buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

// AES-256 GCM helpers
export async function aesEncrypt(text: string, password: string): Promise<string> {
  const encoder = new TextEncoder();
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  
  const baseKey = await crypto.subtle.importKey(
    "raw",
    encoder.encode(password),
    "PBKDF2",
    false,
    ["deriveKey"]
  );
  
  const key = await crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt,
      iterations: 100000,
      hash: "SHA-256",
    },
    baseKey,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt"]
  );
  
  const encrypted = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    encoder.encode(text)
  );
  
  const result = new Uint8Array(salt.byteLength + iv.byteLength + encrypted.byteLength);
  result.set(salt, 0);
  result.set(iv, salt.byteLength);
  result.set(new Uint8Array(encrypted), salt.byteLength + iv.byteLength);
  
  return btoa(String.fromCharCode(...result));
}

export async function aesDecrypt(encryptedBase64: string, password: string): Promise<string> {
  const decoder = new TextDecoder();
  const data = new Uint8Array(atob(encryptedBase64).split("").map((c) => c.charCodeAt(0)));
  
  const salt = data.slice(0, 16);
  const iv = data.slice(16, 28);
  const encrypted = data.slice(28);
  
  const encoder = new TextEncoder();
  const baseKey = await crypto.subtle.importKey(
    "raw",
    encoder.encode(password),
    "PBKDF2",
    false,
    ["deriveKey"]
  );
  
  const key = await crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt,
      iterations: 100000,
      hash: "SHA-256",
    },
    baseKey,
    { name: "AES-GCM", length: 256 },
    false,
    ["decrypt"]
  );
  
  const decrypted = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv },
    key,
    encrypted
  );
  
  return decoder.decode(decrypted);
}

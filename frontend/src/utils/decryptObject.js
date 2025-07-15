import CryptoJS from "crypto-js";

export default function decryptObject(encryptedData, key) {
    const decrypted = CryptoJS.AES.decrypt(encryptedData, key);
    const jsonString = decrypted.toString(CryptoJS.enc.Utf8);
    return JSON.parse(jsonString);
  }
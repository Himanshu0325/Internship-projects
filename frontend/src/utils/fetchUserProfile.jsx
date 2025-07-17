import decryptObject from '../utils/decryptObject';

export const fetchUserProfile = async () => {
    const secretKey = import.meta.env.VITE_SECRET_KEY;
    const encrypted = localStorage.getItem('user');
    const decrypted = decryptObject(encrypted, secretKey);
    console.log(decrypted);
    
   return decrypted;
  };
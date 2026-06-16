import CryptoJS from 'crypto-js'

const SECRET_KEY = process.env.ENCRYPTION_KEY || 'default-key-change-in-prod'

export function encryptToken(token: string): string {
  return CryptoJS.AES.encrypt(token, SECRET_KEY).toString()
}

export function decryptToken(encryptedToken: string): string {
  const decrypted = CryptoJS.AES.decrypt(encryptedToken, SECRET_KEY)
  return decrypted.toString(CryptoJS.enc.Utf8)
}

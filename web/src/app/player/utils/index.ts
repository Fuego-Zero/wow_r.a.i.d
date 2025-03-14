import CryptoJS from "crypto-js";

const FRONTEND_SALT = "wow_raid_frontend_salt";

export function hashPassword(password: string) {
  return CryptoJS.SHA256(password + FRONTEND_SALT).toString();
}

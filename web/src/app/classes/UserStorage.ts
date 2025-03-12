import { UserInfo } from "../player/types";

const key = "USER_STORAGE";

class UserStorage {
  private data: UserInfo | null = null;

  setUser(data: UserInfo) {
    this.data = data;
    localStorage.setItem(key, JSON.stringify(data));
  }

  getUser(): UserInfo | null {
    const data = localStorage.getItem(key);

    if (data) {
      this.data = JSON.parse(data);
    } else {
      this.data = null;
    }

    return this.data;
  }

  clear() {
    this.data = null;
    localStorage.removeItem(key);
  }
}

const storage = new UserStorage();

export default storage;

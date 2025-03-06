import { Data } from "@/app/types";

const key = "DATA";

class Storage {
  private data: Data = [];

  setData(data: Data) {
    this.data = data;
    localStorage.setItem(key, JSON.stringify(data));
  }

  getData(): Data {
    const data = localStorage.getItem(key);

    if (data) {
      this.data = JSON.parse(data);
    } else {
      this.data = [];
    }

    return this.data;
  }
}

const storage = new Storage();

export default storage;

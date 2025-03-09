import { PlayersData } from "@/app/types";

const key = "PLAYERS_DATA";

class Storage {
  private data: PlayersData = [];

  setData(data: PlayersData) {
    this.data = data;
    localStorage.setItem(key, JSON.stringify(data));
  }

  getData(): PlayersData {
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

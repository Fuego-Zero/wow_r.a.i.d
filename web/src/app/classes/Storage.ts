import { PlayersData } from "../raid-roster/types";

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
      this.data = JSON.parse(data).map((item: any) => {
        item.name = `${item.pname} (${item.cname})`;
        return item;
      });
    } else {
      this.data = [];
    }

    return this.data;
  }

  clear() {
    this.data = [];
    localStorage.removeItem(key);
  }
}

const storage = new Storage();

export default storage;

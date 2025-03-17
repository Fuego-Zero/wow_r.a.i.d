import requests
import datetime
from pymongo import MongoClient

from config import MONGO_CONN_STRING, ACCESS_TOKEN

API_URL = 'https://classic.warcraftlogs.com/api/v2/client'

WCL_QUERY = """
query getCharacterRanking($name: String!, $serverSlug: String!, $serverRegion: String!, $zoneID: Int!, $metric: CharacterRankingMetricType!, $specName: String!) {
  characterData {
    character(name: $name, serverSlug: $serverSlug, serverRegion: $serverRegion) {
      zoneRankings(zoneID: $zoneID, metric: $metric, specName: $specName)
    }
  }
}
"""

mongo_client = MongoClient(MONGO_CONN_STRING)
db = mongo_client["wow_raid"]

# ActorMap到WCL英文天赋名映射
ACTOR_MAP_TO_SPEC = {
    "FQ": "Protection",
    "CJQ": "Retribution",
    "NQ": "Holy",

    "DKT": "Blood",
    "XDK": "Unholy",
    "BDK": "Frost",

    "DS": "Elemental",
    "NS": "Restoration",
    "ZQS": "Enhancement",

    "AM": "Shadow",
    "JLM": "Discipline",

    "HF": "Fire",
    "EMS": "Demonology",
    "TKS": "Affliction",

    "SCL": "Survival",
    "ZDZ": "Combat",

    "AC": "Balance",
    "YD": "Feral",
    "ND": "Restoration",

    "KBZ": "Fury",
}

SPEC_TYPE = {
    "FQ": "tank",
    "DKT": "tank",

    "NQ": "healer",
    "NS": "healer",
    "JLM": "healer",
    "ND": "healer",
}

headers = {
    'Authorization': f'Bearer {ACCESS_TOKEN}',
    'Content-Type': 'application/json'
}


def query_wcl(name, server_slug, server_region, zone_id, metric, spec_name):
    response = requests.post(API_URL, headers=headers, json={
        'query': WCL_QUERY,
        'variables': {
            "name": name,
            "serverSlug": server_slug,
            "serverRegion": server_region,
            "zoneID": zone_id,
            "metric": metric,
            "specName": spec_name
        }
    })
    response.raise_for_status()
    return response.json()


# 计算排除某场战斗后的平均排名（50637排除），且rankPercent为null时不参与计算
def calculate_average_ranking(rankings):
    valid_encounters = [
        r for r in rankings
        if r["encounter"]["id"] != 50637 and r["rankPercent"] is not None
    ]
    if not valid_encounters:
        return None

    total_rank = sum(r["rankPercent"] for r in valid_encounters)
    return total_rank / len(valid_encounters)


# 主逻辑函数
def query_and_save_rankings():
    roles = db.role.find({})

    for role in roles:
        char_name = role["role_name"]
        server_slug = "法琳娜"
        server_region = "CN"
        zone_id = 1032  # 具体副本ID

        talents = role.get("talent", [])
        for talent in talents:
            spec_name = ACTOR_MAP_TO_SPEC.get(talent)
            if not spec_name:
                continue  # 跳过无效天赋

            # 根据SPEC_TYPE确定查询指标
            spec_role_type = SPEC_TYPE.get(talent, "dps")
            metric = "hps" if spec_role_type == "healer" else "dps"

            try:
                result = query_wcl(char_name, server_slug, server_region, zone_id, metric, spec_name)

                if talent == 'FQ':
                    all_stars = result["data"]["characterData"]["character"]["zoneRankings"]["allStars"]
                    if not all_stars:
                        print(f"查询 {char_name} ({spec_name}-{metric}) 时出错: 没有allStars数据")
                        continue
                    avg_rank_percent = all_stars[0].get("rankPercent")
                    avg_rank_percent = round(avg_rank_percent, 1)
                    server_rank = all_stars[0].get("serverRank")
                else:
                    rankings = result["data"]["characterData"]["character"]["zoneRankings"]["rankings"]
                    all_stars = result["data"]["characterData"]["character"]["zoneRankings"]["allStars"]
                    if not all_stars:
                        print(f"查询 {char_name} ({spec_name}-{metric}) 时出错: 没有allStars数据")
                        continue
                    avg_rank_percent = calculate_average_ranking(rankings)
                    avg_rank_percent = round(avg_rank_percent, 1)
                    all_stars = result["data"]["characterData"]["character"]["zoneRankings"]["allStars"]
                    server_rank = all_stars[0].get("serverRank")

                query = {
                    "zone_id": zone_id,
                    "role_name": char_name,
                    "talent": talent
                }

                update_operation = {
                    "$set": {
                        "average_rank_percent": avg_rank_percent,
                        "server_rank": server_rank,
                        "update_time": datetime.datetime.now()
                    },
                    "$setOnInsert": {
                        "create_time": datetime.datetime.now(),
                        "zone_id": zone_id,
                        "role_name": char_name,
                        "talent": talent
                    }
                }

                db.wcl_rankings.update_one(query, update_operation, upsert=True)

                print(f"保存成功：{char_name}-{spec_name}-{metric}，平均分：{avg_rank_percent:.2f}")

            except Exception as e:
                print(f"查询 {char_name} ({spec_name}-{metric}) 时出错: {e}")


if __name__ == "__main__":
    query_and_save_rankings()

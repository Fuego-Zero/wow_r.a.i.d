from enum import Enum

from flask import Blueprint, json, Response
from pymongo import MongoClient
import copy
from collections import defaultdict
import random
from bson import ObjectId
import datetime

from config import MONGO_CONN_STRING

allocation_api = Blueprint('allocation_api', __name__)

# 连接mongoDB
mongo_client = MongoClient(MONGO_CONN_STRING)
db = mongo_client["wow_raid"]

# 常量定义：
TANK_NEED = {'防骑': 2, '血DK': 1}
HEALER_MAX = 4
HEALER_MIN = 4
HEALER_MUST_HAVE = {'奶骑': 2, '戒律牧': 1}

DPS_LIMIT = {
    '增强萨': (1, 1), '盗贼': (1, 1),
    '惩戒骑': (1, 1), '暗牧': (1, 1), '痛苦术': (1, 2), '恶魔术': (1, 1), '鸟德': (1, 2),
    '猎人': (2, 3), '邪DK': (1, 2), '冰DK': (0, 1),
    '猫德': (0, 1), '电萨': (1, 1), '法师': (2, 3),
    '战士': (1, 2),
}

HEALER_LIMIT = {
    '奶骑': 2,  # 奶骑人数上限（不超过2）
    '戒律牧': 2,  # 戒律牧人数上限（不超过2）
    '奶德': 1,
    '奶萨': 1
}

ROLES = {
    "防骑": "坦克", "血DK": "坦克",
    "战士": "近战输出", "增强萨": "近战输出", "惩戒骑": "近战输出",
    "盗贼": "近战输出", "猫德": "近战输出", "邪DK": "近战输出", "冰DK": "近战输出",
    "猎人": "远程输出", "电萨": "远程输出", "暗牧": "远程输出",
    "痛苦术": "远程输出", "恶魔术": "远程输出", "法师": "远程输出", "鸟德": "远程输出",
    "奶萨": "治疗", "奶骑": "治疗", "戒律牧": "治疗", "奶德": "治疗"
}

# 稀缺职业
SCARCE_ROLES = []

# 颜色映射定义（职业名->颜色）
CLASS_COLORS = {
    '战士': 'CD853F',  # 棕色
    '防骑': 'FFC0CB', '惩戒骑': 'FFC0CB', '奶骑': 'FFC0CB',  # 粉色
    '增强萨': '1E90FF', '电萨': '1E90FF', '奶萨': '1E90FF',  # 蓝色
    '猎人': '98FB98',  # 绿色
    '暗牧': '000000', '戒律牧': '000000',  # 黑色
    '痛苦术': 'DA70D6', '恶魔术': 'DA70D6',  # 紫色
    '盗贼': 'FFFF00',  # 黄色
    '法师': '00BFFF',  # 浅蓝色
    '猫德': 'FFA500', '鸟德': 'FFA500', '奶德': 'FFA500',  # 橙色
    '邪DK': 'FF4500', '冰DK': 'FF4500', '血DK': 'FF4500'  # 红色
}


class ActorMap(Enum):
    FQ = "防骑"  # 防骑
    CJQ = "惩戒骑"  # 惩戒骑
    NQ = "奶骑"  # 奶骑

    XDK = "邪DK"  # 邪DK
    DKT = "血DK"  # 血DK
    BDK = "冰DK"  # 冰DK

    DS = "电萨"  # 电萨
    NS = "奶萨"  # 奶萨
    ZQS = "增强萨"  # 增强萨

    AM = "暗牧"  # 暗牧
    JLM = "戒律牧"  # 戒律牧

    HF = "法师"  # 法师
    BF = "BF"
    AF = "AF"

    EMS = "恶魔术"  # 恶魔术
    TKS = "痛苦术"  # 痛苦术

    SWL = "SWL"
    SCL = "猎人"  # 猎人

    CSZ = "CSZ"
    ZDZ = "盗贼"  # 盗贼

    AC = "鸟德"  # 鸟德
    ND = "奶德"  # 奶德
    XT = "XT"
    YD = "猫德"  # 猫德

    KBZ = "战士"  # 战士
    FZ = "FZ"


class Player:
    def __init__(self, player_name, characters, available_times):
        self.player_name = player_name
        self.characters = characters  # [{'name':角色名, 'class':职业名},...]
        self.available_times = available_times


# 从mongoDB中加载用户和角色数据
def load_players_from_db():
    players_dict = defaultdict(lambda: {"characters": [], "available_times": set()})

    signup_collection = db["signup_record"]
    user_collection = db["user"]
    group_info_collection = db["group_info"]

    # Talent 英文缩写到中文职业名的映射
    talent_enum_to_class = {e.name: e.value for e in ActorMap}

    # group_info 的time_key到title的映射
    time_key_map = {
        record["time_key"]: record["title"]
        for record in group_info_collection.find({})
    }

    # 一次批量查询所有有效报名记录
    signup_records = signup_collection.find({"delete_time": None})

    # 记录所有有效用户ID，之后一次性进行查询
    user_ids_set = set()

    for signup in signup_records:
        user_id = signup.get("user_id")
        user_name = signup.get("user_name")
        role_name = signup.get("role_name")
        talents = signup.get("talent", [])

        # 解析有效职业（过滤无效天赋）
        valid_classes = {
            talent_enum_to_class.get(talent)
            for talent in talents
            if talent_enum_to_class.get(talent) in ROLES
        }

        if not valid_classes:
            continue  # 无有效职业跳过此记录

        character = {
            "name": role_name,
            "class": "+".join(sorted(valid_classes))
        }

        players_dict[user_id]["characters"].append(character)
        players_dict[user_id]["user_name"] = user_name
        user_ids_set.add(user_id)

    # 批量查询所有用户的play_time
    user_records = user_collection.find({"_id": {"$in": list(user_ids_set)}})

    # 批量赋值每个用户的available_times信息
    for user_record in user_records:
        user_id = user_record["_id"]
        play_times_raw = user_record.get("play_time", [])
        available_slots = {
            time_key_map[time_key]
            for time_key in play_times_raw if time_key in time_key_map
        }
        players_dict[user_id]["available_times"] = available_slots

    # 最终构造players对象列表返回
    players = [
        Player(
            pdata["user_name"],
            pdata["characters"],
            list(pdata["available_times"])
        )
        for pdata in players_dict.values()
        if pdata["characters"]  # 至少有一个有效角色
    ]

    all_users_cursor = user_collection.find({})
    all_user_names = set(user_record['user_name'] for user_record in all_users_cursor)
    # 已报名玩家的用户集合（从前面的players中提取即可）
    signed_up_user_names = set(player.player_name for player in players)

    # 计算未报名玩家（全部用户 - 已经报名玩家）
    unsigned_users = all_user_names - signed_up_user_names

    print("\n本次报名未参与排团的玩家有以下：")
    for user_name in unsigned_users:
        print(user_name)
    print(f"共计 {len(unsigned_users)} 名\n")

    return players


# 在第一次排团开始前构建本次CD周期总角色池
def build_cd_role_pool(players):
    role_pool = dict()
    for player in players:
        role_pool[player.player_name] = copy.deepcopy(player.characters)
    return role_pool


def parse_available_times(available_str):
    slots = []
    time_map = {
        '周四': ['周四-19:30', '周四-20:30', '周四-21:30'],
        '周五': ['周五-19:30', '周五-20:30', '周五-21:30'],
        '周六': ['周六-19:30', '周六-20:30'],
        '周日': ['周日-19:30', '周日-20:30'],
        '周一': ['周一-19:30', '周一-20:30']
    }
    parts = available_str.split('、')
    for part in parts:
        part = part.strip()
        if '第一车' in part:
            day = part.replace('第一车', '').strip()
            if day in time_map:
                slots.append(time_map[day][0])  # 第一车（19:30）
        elif '第二车' in part:
            day = part.replace('第二车', '').strip()
            if day in time_map:
                slots.append(time_map[day][1])  # 第二车（20:30）
        elif '第三车' in part:
            day = part.replace('第三车', '').strip()
            # 只有周四周五有第三车
            if day in ['周四', '周五']:
                slots.append(time_map[day][2])  # 第三车（21:30）
        else:
            # 如果没有注明哪一车，就是当天所有车次可参加
            if part in time_map:
                slots.extend(time_map[part])
    return slots


# 获取该角色所有职业(双修支持)
def get_classes(char_class):
    return char_class.strip().split("+")


# 检查团本配置合法性
def validate_roster(roster):
    tank = defaultdict(int)
    heal = defaultdict(int)
    dps = defaultdict(int)
    for player, char, cls in roster:
        role = ROLES[cls]
        if role == '坦克':
            tank[cls] += 1
        elif role == '治疗':
            heal[cls] += 1
        else:
            dps[cls] += 1

    # 检查坦克是否满足
    for cls, num in TANK_NEED.items():
        if tank[cls] != num:
            return False

    # 检查治疗数量和必须职业
    if not (HEALER_MIN <= sum(heal.values()) <= HEALER_MAX):
        return False
    for cls, num in HEALER_MUST_HAVE.items():
        if heal[cls] < num:
            return False

    # 检查输出职业限制条件
    for cls, (min_n, max_n) in DPS_LIMIT.items():
        if dps[cls] < min_n or dps[cls] > max_n:
            return False

    # 检查远程近战尽可能均衡
    melee_count = sum([v for k, v in dps.items() if ROLES[k] == "近战输出"])
    ranged_count = sum([v for k, v in dps.items() if ROLES[k] == "远程输出"])
    if abs(melee_count - ranged_count) > 2:  # 允许小幅偏差
        return False

    return True


# 排团函数
def create_group(players, cd_role_pool, time_slot, required_players_levels):
    available_pool = {}
    player_dict = {p.player_name: p for p in players}
    for pname, chars in cd_role_pool.items():
        player = player_dict[pname]
        if time_slot in player.available_times and chars:
            available_pool[pname] = copy.deepcopy(chars)

    selected_roles = []

    def pick_role(pname, cls_needed):
        if pname not in available_pool:
            return False
        for char in available_pool[pname]:
            if cls_needed in get_classes(char['class']):
                selected_roles.append((pname, char['name'], cls_needed))
                del available_pool[pname]
                return True
        return False

    def pick_with_dualspec_priority(cls_needed):
        items = list(available_pool.items())
        random.shuffle(items)
        for pname, chars in items:
            char_list = chars[:]
            random.shuffle(char_list)
            for char in char_list:
                classes = get_classes(char['class'])
                roles_set = set(ROLES[c] for c in classes)
                if cls_needed in classes and len(roles_set) == 1:
                    return pick_role(pname, cls_needed)
        for pname in random.sample(list(available_pool), len(available_pool)):
            if pick_role(pname, cls_needed):
                return True
        return False

    def get_remaining_counts():
        remaining_count = {}
        for player in players:
            remaining_count[player.player_name] = len([slot for slot in player.available_times if slot != time_slot])
        return remaining_count

    remaining_counts = get_remaining_counts()

    priority_classes = list(TANK_NEED.keys()) + \
                       list(HEALER_MUST_HAVE.keys()) + ['奶德', '奶萨'] + \
                       SCARCE_ROLES + \
                       list(DPS_LIMIT.keys())

    dps_selected = defaultdict(int)
    healer_counts = defaultdict(int)  # 职业计数器（治疗）
    total_healers = 0  # 治疗总计数器

    # 治疗职业优先明确顺序处理，且玩家随机排序（奶骑2 > 戒律牧1 > 其他）
    treatment_priority_order = [
        ('奶骑', HEALER_MUST_HAVE['奶骑']),
        ('戒律牧', HEALER_MUST_HAVE['戒律牧']),
        ('奶德', HEALER_LIMIT['奶德']),
        ('奶萨', HEALER_LIMIT['奶萨'])
    ]

    dk_classes = ['邪DK', '冰DK']

    # 已选中的玩家名单，防止重复选择
    used_players = set()

    # 遍历治疗职业，优先池随机顺序分配治疗职业
    for heal_cls, required_number in treatment_priority_order:
        current_cls_count = len([r for r in selected_roles if r[2] == heal_cls])
        while current_cls_count < required_number and total_healers < HEALER_MAX:
            found = False
            # 把单个的require_players改成多个level VIP分级
            for vip_level in required_players_levels:
                shuffled_require_players = [p for p in vip_level if p in available_pool and p not in used_players]
                random.shuffle(shuffled_require_players)  # ⭐随机玩家顺序⭐
                for pname in shuffled_require_players:
                    if pick_role(pname, heal_cls):
                        healer_counts[heal_cls] += 1
                        total_healers += 1
                        used_players.add(pname)
                        found = True
                        break
                if found:
                    break  # 内层vip循环一旦找到，外层vip循环就直接跳出
            if not found:
                # 若遍历全部玩家都没找到匹配的治疗，则终止当前治疗职业选择
                break
            current_cls_count += 1

    # 后续的坦克和DPS选择，保持原有剔除已选玩家逻辑
    # 改进为支持分级别VIP处理
    for vip_level in required_players_levels:
        for pname in vip_level:
            if pname not in available_pool or pname in used_players:
                continue
            picked = False
            shuffled_priority_classes = priority_classes[:]
            random.shuffle(shuffled_priority_classes)
            for cls in shuffled_priority_classes:
                role = ROLES.get(cls)

                if role == '治疗':
                    continue  # 治疗前面已经明确地选完了，不再重复

                elif role == '坦克':
                    current_tank_count = len([r for r in selected_roles if r[2] == cls])
                    if current_tank_count >= TANK_NEED.get(cls, 0):
                        continue
                    if pick_role(pname, cls):
                        picked = True
                        used_players.add(pname)
                        break

                else:  # DPS选择严格检查数量 + 输出DK总数≤2
                    current_dps_count = len([r for r in selected_roles if r[2] == cls])
                    max_dps_limit = DPS_LIMIT.get(cls, (0, 99))[1]
                    if current_dps_count >= max_dps_limit:
                        continue
                    if cls in dk_classes and sum(dps_selected[dk] for dk in dk_classes) >= 2:
                        continue
                    if pick_role(pname, cls):
                        dps_selected[cls] += 1
                        picked = True
                        used_players.add(pname)
                        break

            if picked and pname in available_pool:
                del available_pool[pname]

    # 坦克选择
    for tank_cls, num in TANK_NEED.items():
        count = len([role for role in selected_roles if role[2] == tank_cls])
        while count < num:
            items = list(available_pool.items())
            random.shuffle(items)
            found = False
            for pname, _ in items:
                if pick_with_dualspec_priority(tank_cls):
                    found = True
                    break
            if not found:
                selected_roles.append(("", "", tank_cls))
            count += 1

    # 治疗选择完美优化版（易读+强制顺序明确版）

    items_healers = list(available_pool.items())
    random.shuffle(items_healers)

    total_healers = len([r for r in selected_roles if ROLES.get(r[2]) == '治疗'])

    # 第一步：严格按照先奶骑2人，再戒律牧1人的顺序，明确选择必须治疗
    ordered_healers_must_have = [('奶骑', HEALER_MUST_HAVE['奶骑']), ('戒律牧', HEALER_MUST_HAVE['戒律牧'])]
    for heal_cls, required_num in ordered_healers_must_have:
        current_count = len([r for r in selected_roles if r[2] == heal_cls])
        while current_count < required_num:
            found = False
            for pname, _ in items_healers:
                current_cls_count = len([r for r in selected_roles if r[2] == heal_cls])
                if current_cls_count >= HEALER_LIMIT.get(heal_cls, HEALER_MAX):
                    continue
                if pick_with_dualspec_priority(heal_cls):
                    total_healers += 1
                    found = True
                    break
            if not found:
                selected_roles.append(("", "", heal_cls))
                total_healers += 1
            current_count += 1

    # 第二步：补充额外治疗直到满4人
    additional_healers = ['奶德', '戒律牧', '奶萨']
    while total_healers < HEALER_MIN:
        # random.shuffle(additional_healers)
        found = False
        for heal_cls in additional_healers:
            current_heal_cls_count = len([r for r in selected_roles if r[2] == heal_cls])
            if current_heal_cls_count >= HEALER_LIMIT.get(heal_cls, HEALER_MAX):
                continue
            if pick_with_dualspec_priority(heal_cls):
                total_healers += 1
                found = True
                break
        if not found:
            selected_roles.append(("", "", "治疗"))
            total_healers += 1

    # 第三步：如果意外超过HEALER_MAX(4)，用空缺替代多余治疗
    if total_healers > HEALER_MAX:
        actual_heal_count = 0
        fixed_roles = []
        for role in selected_roles:
            if ROLES.get(role[2]) == '治疗':
                if actual_heal_count < HEALER_MAX:
                    fixed_roles.append(role)
                    actual_heal_count += 1
                else:
                    fixed_roles.append(("", "", "治疗"))  # 超额治疗改为空位
            else:
                fixed_roles.append(role)
        selected_roles = fixed_roles

    # DK特殊处理 (修复版本，严格检查 DPS_LIMIT并确保输出DK不超过2人)
    dk_selected = {'邪DK': 0, '冰DK': 0}
    dk_classes = ['邪DK', '冰DK']

    # 先挑选邪DK玩家
    xiedk_candidates = []
    for pname in available_pool:
        if any('邪DK' in get_classes(c['class']) for c in available_pool[pname]):
            xiedk_candidates.append((remaining_counts[pname], pname))
    random.shuffle(xiedk_candidates)

    max_xiedk = DPS_LIMIT['邪DK'][1]  # 获取邪DK的上限人数

    for _, pname in xiedk_candidates:
        # 增添额外总数检查条件
        if dps_selected['邪DK'] >= max_xiedk or sum(dps_selected[dk] for dk in dk_classes) >= 2:
            break
        if pick_role(pname, '邪DK'):
            dps_selected['邪DK'] += 1
            dk_selected['邪DK'] += 1

    # 如果未选到足够的邪DK，则采用占位补充，但严格检查当前DK总数，确保不超过2
    while dps_selected['邪DK'] < DPS_LIMIT['邪DK'][0]:
        # 👇再增加一次总人数检查！这是第二个关键防护措施！
        if sum(dps_selected[dk] for dk in dk_classes) >= 2:
            break
        selected_roles.append(("", "", "邪DK"))
        dps_selected['邪DK'] += 1

    # DPS基础需求
    dps_min_requirements = {cls: limit[0] for cls, limit in DPS_LIMIT.items() if limit[0] > 0}
    for dps_cls, min_num in dps_min_requirements.items():
        while dps_selected[dps_cls] < min_num:
            found = False
            player_list = list(available_pool.keys())
            random.shuffle(player_list)  # 随机打乱玩家顺序
            for pname in player_list:
                if pick_role(pname, dps_cls):
                    dps_selected[dps_cls] += 1
                    found = True
                    break
            if not found:
                selected_roles.append(("", "", dps_cls))
                dps_selected[dps_cls] += 1

    vacancy_count = 25 - len(selected_roles)
    selected_players = set(pname for pname, _, _ in selected_roles if pname)
    dk_classes = ['邪DK', '冰DK']
    exclude_classes = dk_classes + ['增强萨', '电萨']  # 增加排除增强萨和电萨
    available_dps_classes = [cls for cls, role in ROLES.items() if
                             role in ['近战输出', '远程输出'] and cls not in exclude_classes]

    available_dps_characters = []
    for pname, chars in available_pool.items():
        if pname in selected_players:
            continue
        for char in chars:
            char_classes = get_classes(char['class'])
            dps_classes = [cls for cls in char_classes if cls in available_dps_classes]
            if dps_classes:
                available_dps_characters.append((pname, char['name'], dps_classes))

    random.shuffle(available_dps_characters)

    for _ in range(vacancy_count):
        success = False
        while available_dps_characters:
            pname, char_name, dps_classes = available_dps_characters.pop()
            random.shuffle(dps_classes)
            picked = False
            for dps_cls in dps_classes:
                if pick_role(pname, dps_cls):
                    selected_players.add(pname)
                    if pname in cd_role_pool:
                        cd_role_pool[pname] = [c for c in cd_role_pool[pname] if c['name'] != char_name]
                    available_pool.pop(pname, None)
                    success = True
                    picked = True
                    break
            if picked:
                break

        if not success:
            random_cls = random.choice(available_dps_classes)
            selected_roles.append(("", "", random_cls))

    while len(selected_roles) < 25:
        selected_roles.append(("", "", ""))

    for pname, char_name, _ in selected_roles:
        if pname and char_name:
            cd_role_pool[pname] = [c for c in cd_role_pool[pname] if c['name'] != char_name]

    return selected_roles


# 定义按ROLES顺序排序的辅助函数
def sort_roles(roster):
    tanks = [r for r in roster if ROLES.get(r[2]) == '坦克']
    melee = [r for r in roster if ROLES.get(r[2]) == '近战输出']
    ranged = [r for r in roster if ROLES.get(r[2]) == '远程输出']
    heals = [r for r in roster if ROLES.get(r[2]) == '治疗']
    return tanks + melee + ranged + heals


@allocation_api.route("/api/roster", methods=["GET"])
def roster():
    players = load_players_from_db()
    cd_role_pool = build_cd_role_pool(players)

    time_slots = ["周四-19:30", "周四-20:30", "周四-21:30",
                  "周五-19:30", "周五-20:30", "周五-21:30",
                  "周六-19:30", "周六-20:30",
                  "周日-19:30", "周日-20:30",
                  "周一-19:30", "周一-20:30"]

    required_players_level = [
        ["炸酱面", "薄荷", "古子哥", "戴森", "大力", "伊欧玟", "故事"],
        ["大哥", "老四", "可美", "菲兹", "甜思思"],
        ["白胖", "张三", "狗哥", "老K", "小K", "待雪", "羊掉", "外卡", "小元", "佛爷"]
    ]

    class_to_enum = {e.value: e.name for e in ActorMap}

    # Weekday and time mapping
    time_key_map = {
        "周四-19:30": "4-1", "周四-20:30": "4-2", "周四-21:30": "4-3",
        "周五-19:30": "5-1", "周五-20:30": "5-2", "周五-21:30": "5-3",
        "周六-19:30": "6-1", "周六-20:30": "6-2",
        "周日-19:30": "7-1", "周日-20:30": "7-2",
        "周一-19:30": "1-1", "周一-20:30": "1-2",
    }

    # 计算order
    day_order_map = {
        "4-1": 0, "4-2": 1, "4-3": 2,
        "5-1": 3, "5-2": 4, "5-3": 5,
        "6-1": 6, "6-2": 7,
        "7-1": 8, "7-2": 9,
        "1-1": 10, "1-2": 11,
    }

    schedule_coll = db["schedule"]
    schedule_coll.delete_many({})

    signup_coll = db["signup_record"]
    user_coll = db["user"]

    # 一次性全量查询缓存数据，避免循环中逐条检索数据库
    signup_records_cursor = signup_coll.find({"delete_time": None})
    user_records_cursor = user_coll.find({})

    # 缓存signup_record: (user_name, role_name) -> signup数据
    signup_cache = {}
    for signup in signup_records_cursor:
        key = (signup["user_name"], signup["role_name"])
        signup_cache[key] = signup

    # 缓存user_record: user_name -> user数据
    user_cache = {}
    for user in user_records_cursor:
        user_cache[user["user_name"]] = user

    schedule_result = {}
    insert_documents = []  # 统一批量插入用的列表

    for slot in time_slots:
        roster = create_group(players, cd_role_pool, slot, required_players_level)
        sorted_roster = sort_roles(roster)

        group_time_key = time_key_map[slot]

        roster_json = []
        for idx, (user_name, role_name, cls) in enumerate(sorted_roster):
            enum_class = class_to_enum.get(cls.strip()) if cls else ""

            if user_name:  # 有用户正常处理
                signup_info = signup_cache.get((user_name, role_name))
                user_info = user_cache.get(user_name)

                if signup_info is None or user_info is None:
                    continue

                role_id = signup_info.get("role_id")
                talent_list = signup_info.get("talent", [])
                classes = signup_info.get("classes")
                user_id = signup_info.get("user_id")
                play_time = user_info.get("play_time", [])

                schedule_document = {
                    "_id": ObjectId(),
                    "role_id": role_id,
                    "role_name": role_name,
                    "classes": classes,
                    "talent": talent_list,
                    "user_id": user_id,
                    "user_name": user_name,
                    "play_time": play_time,
                    "group_time_key": group_time_key,
                    "group_time_order": day_order_map.get(group_time_key),
                    "group_title": slot,
                    "is_publish": False,
                    "create_time": datetime.datetime.utcnow()
                }

                insert_documents.append(schedule_document)

                roster_json.append({
                    "user_name": user_name,
                    "role_name": role_name,
                    "class": enum_class
                })
            else:  # 没有用户则标记“空缺”
                roster_json.append({
                    "user_name": "空缺",
                    "role_name": "空缺",
                    "class": enum_class if enum_class else "空缺"
                })

        schedule_result[slot] = {
            "roster": roster_json
        }

    # 批量DB插入
    if insert_documents:
        schedule_coll.insert_many(insert_documents)

    result = {
        "schedule": schedule_result
    }

    response_json = json.dumps(result, ensure_ascii=False)
    return Response(response_json, mimetype='application/json; charset=utf-8')

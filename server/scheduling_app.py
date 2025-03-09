import os
import re
import json
import random
import string
import openpyxl
from datetime import datetime
from enum import Enum
from auto_wow_allocation import main
from loguru import logger
from flask import Flask, render_template, request, redirect, url_for, flash, send_file
from werkzeug.utils import secure_filename


def get_random_str(length: int = 8) -> str:
    return ''.join(random.sample(string.ascii_letters + string.digits, length))


# 初始化Flask应用
app = Flask(__name__)
app.secret_key = 'some_secret_key'  # 用于消息闪现

# 设置上传文件夹和允许的扩展名
UPLOAD_FOLDER = os.path.join(os.getcwd(), "filestorage", "scheduling")
ALLOWED_EXTENSIONS = {'txt', 'pdf', 'png', 'jpg', 'jpeg', 'gif', 'xlsx'}

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# 确保上传目录存在
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)


def allowed_file(filename):
    """检查文件扩展名是否合法"""
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


class Weekday(Enum):
    周一 = 1
    周二 = 2
    周三 = 3
    周四 = 4
    周五 = 5
    周六 = 6
    周日 = 7


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


def add_timestamp_to_filename(filename, timestamp):
    # 获取当前时间并格式化为字符串（例如：202503071455）
    # timestamp = datetime.now().strftime("%Y%m%d%H%M")

    # 分离文件路径、文件名和扩展名
    base_dir, filename_with_ext = os.path.split(filename)
    name, ext = os.path.splitext(filename_with_ext)

    # 构造新的文件名
    new_filename = f"{name}_{timestamp}{ext}"

    # 如果源文件所在目录不是当前工作目录，则需要完整路径
    if base_dir:
        new_file_path = os.path.join(base_dir, new_filename)
    else:
        new_file_path = new_filename

    return new_file_path


def save_file(file):
    timestamp = datetime.now().strftime("%Y%m%d%H%M%S")

    filename = add_timestamp_to_filename(file.filename, timestamp)
    input_file = os.path.join(UPLOAD_FOLDER, filename)
    # logger.info(input_file)
    file.save(input_file)

    xlsx_file = os.path.join(UPLOAD_FOLDER, '团本排表结果' + timestamp + '.xlsx')
    json_file = os.path.join(UPLOAD_FOLDER, '团本排表结果' + timestamp + '.json')
    return main(input_file, xlsx_file), input_file, xlsx_file, json_file


def convert_weekday_to_number(tm):
    '''
    将星期几转换为数字
    '''
    weekday = tm.split("-")[0]
    # logger.info(weekday)
    return Weekday[weekday].value


def extract_weekday(text):
    # 定义正则表达式模式
    pattern = r'(周一|周二|周三|周四|周五|周六|周日)'

    # 使用findall方法查找所有匹配项
    matches = re.findall(pattern, text)

    return matches


def convert_ttp(tv):
    '''
    将时间转换为数值
    '''
    weekdays = tv.split("、")

    final_result = []

    # 遍历测试字符串并提取信息
    for text in weekdays:
        result = extract_weekday(text)
        if result:
            # logger.info(f"提取到的星期信息: {result}")
            final_result.append(Weekday[result[0]].value)
        else:
            logger.warning(f"原始文本: {text}，未找到匹配的星期信息")

    return final_result


def process_character_name_and_occupation(text):
    '''
    处理角色名称和职业名称
    '''
    result = []
    lines = text.splitlines()

    for line in lines:
        character_name = ''
        occupation = []

        character_name, occupation = line.split("/")
        occupation = occupation.split("+")
        result.append({'char': character_name.strip(), 'occu': occupation})

    return result


def process_file(file):
    '''
    将得到的文件进行处理
    '''
    result, input_file, xlsx_file, json_file = save_file(file)
    # logger.info(input_file)
    # logger.info(json_file)
    logger.info(result)

    output_result = []

    for item in result:
        _players = []
        for player in item['players']:
            logger.info(player)

            actor = ActorMap(player['cls'])
            # logger.info(actor)
            _players.append({
                "name": "{}({})".format(player['pname'], player['cname']) if player['pname'] else "空缺-{}".format(get_random_str(6)),
                "actor": actor.name
            })

        output_result.append({
            "time": item['time'],
            "players": _players
        })

    with open(json_file, "w+", encoding="utf-8") as f:
        json.dump(output_result, f, ensure_ascii=False)

    return json_file


def process_file2(file):
    '''
    将得到的文件进行处理
    '''
    result, input_file, xlsx_file, json_file = save_file(file)
    # logger.info(input_file)
    # logger.info(json_file)
    logger.info(result)

    output_result = []

    # 从原始xlsx文件中，根据名称获取排版时间

    # 加载Excel文档
    wb = openpyxl.load_workbook(input_file)

    # 选择活动的工作表（或指定名称）
    sheet = wb.active
    # 或者通过名称选择特定的工作表
    # sheet = wb['Sheet1']

    # 打印工作表名称
    logger.info(f"当前工作表名称: {sheet.title}")

    # 遍历所有行和列
    # schedule_table = []
    for row in sheet.iter_rows(values_only=True):
        pn = row[0].strip()
        cnao = row[1].strip()
        ttp = row[2].strip()
        # logger.info(row)
        # for cell in row:
        #     logger.info(cell)

        # 过滤掉第一行
        if '玩家名称' in pn or '角色名和职业' in cnao or '可以玩的时间' in ttp:
            continue

        _cnao = process_character_name_and_occupation(cnao)

        # person_row = {
        #     'player_name': pn,
        #     'character_name_and_occupation': _cnao,
        #     'time_to_play': ttp,
        #     '_ttp': convert_ttp(ttp)
        # }
        # schedule_table.append(person_row)

        for item in _cnao:
            for subitem in item['occu']:
                name = "{}({})".format(pn, subitem.strip())
                # logger.info(subitem.strip())
                actor = ActorMap(subitem.strip())
                empty = False if name else True
                _name = name if name else "空缺-{}".format(get_random_str(6))
                output_result.append({
                    "pname": pn,
                    "cname": item['char'],
                    "cls": subitem.strip(),
                    "time": convert_ttp(ttp),
                    "group": (),
                    "name": _name,
                    "actor": actor.name,
                    "empty": empty
                })

    for item in result:
        for player in item['players']:
            for sche in output_result:
                # 比较条件，有待确认
                if sche['pname'] == player['pname'] and sche['cls'] == player['cls'] and sche['cname'] == player['cname']:
                    sche['group'] = (convert_weekday_to_number(
                        item['time']), item['time'])
                if sche['empty'] and len(sche['group']) > 0:
                    sche['time'] = sche['group'][0]

    with open(json_file, "w+", encoding="utf-8") as f:
        json.dump(output_result, f, ensure_ascii=False)

    return json_file


@app.route('/api/v2/roster', methods=['GET', 'POST'])
def upload_file2():
    if request.method == 'POST':
        # 检查请求中是否包含文件部分
        if 'file' not in request.files:
            flash('没有文件部分')
            return redirect(request.url)
        file = request.files['file']
        # 如果用户没有选择文件，则浏览器也会提交一个空的文件名
        if file.filename == '':
            flash('未选择任何文件')
            return redirect(request.url)
        if file and allowed_file(file.filename):
            # filename = secure_filename(file.filename)
            download_filepath = process_file2(file)
            flash('文件上传成功')
            return send_file(download_filepath, as_attachment=True)
            # return redirect(url_for('upload_file'))
    return '''
    <!doctype html>
    <title>上传新文件</title>
    <h1>上传新文件</h1>
    <form action="/v2" method="post" enctype="multipart/form-data">
        <input type=file name=file>
        <input type=submit value=上传>
    </form>
'''


@app.route('/api/roster', methods=['GET', 'POST'])
def upload_file():
    if request.method == 'POST':
        # 检查请求中是否包含文件部分
        if 'file' not in request.files:
            flash('没有文件部分')
            return redirect(request.url)
        file = request.files['file']
        # 如果用户没有选择文件，则浏览器也会提交一个空的文件名
        if file.filename == '':
            flash('未选择任何文件')
            return redirect(request.url)
        if file and allowed_file(file.filename):
            # filename = secure_filename(file.filename)
            download_filepath = process_file(file)
            flash('文件上传成功')
            return send_file(download_filepath, as_attachment=True)
            # return redirect(url_for('upload_file'))
    return '''
    <!doctype html>
    <title>上传新文件</title>
    <h1>上传新文件</h1>
    <form action="/" method="post" enctype="multipart/form-data">
        <input type=file name=file>
        <input type=submit value=上传>
    </form>
'''


def start_application():
    app.run(debug=True, host='0.0.0.0', port=7000)


if __name__ == '__main__':
    start_application()

import os
import logging

# 创建logs目录用于存储日志文件
LOGS_DIR = "logs"
if not os.path.exists(LOGS_DIR):
    os.makedirs(LOGS_DIR)


# 配置logging
def setup_logger(log_file="app.log"):
    """
    设置全局日志配置
    :param log_file: 指定日志文件名，默认是 app.log
    """
    logging.basicConfig(
        level=logging.INFO,  # 日志默认级别
        format="%(asctime)s - %(levelname)s - %(message)s",  # 日志记录格式
        handlers=[
            logging.FileHandler(os.path.join(LOGS_DIR, log_file)),  # 日志写入到文件
            logging.StreamHandler()  # 日志同时输出到控制台
        ]
    )


# 初始化日志配置
setup_logger()

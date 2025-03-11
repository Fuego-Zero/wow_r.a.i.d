import os
from flask import Flask,  request, redirect,  flash, send_file
from scheduling_app import UPLOAD_FOLDER, allowed_file, process_file, process_file2

app = Flask(__name__)
app.secret_key = 'some_secret_key'  # 用于消息闪现

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# 确保上传目录存在
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)
    
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
    app.run(debug=False, host='0.0.0.0', port=7000)


if __name__ == '__main__':
    start_application()
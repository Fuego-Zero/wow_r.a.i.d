from flask import Flask
from flask_cors import CORS
from auto_wow_allocation import allocation_api

app = Flask(__name__)
CORS(app)
app.register_blueprint(allocation_api)

if __name__ == '__main__':
    app.run(debug=False, port=7000)

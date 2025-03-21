from flask import Flask
from flask_cors import CORS
from auto_wow_allocation import allocation_api
from wcl_service import wcl_api

app = Flask(__name__)
CORS(app)
app.register_blueprint(allocation_api)
app.register_blueprint(wcl_api)

if __name__ == '__main__':
    app.run(debug=False, host="0.0.0.0", port=7000)

from flask import Flask
from flask import request
import json
app = Flask(__name__, static_folder='public', static_url_path='')

@app.route('/', methods=['GET'])
def save():
    pass
        # serve index page

if __name__ == "__main__":
    app.run(port=8888, debug=True)

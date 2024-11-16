from flask import Flask, jsonify
from flask_cors import CORS
from reddit_api import fetch_reddit_posts

app = Flask(__name__)
CORS(app)

@app.route('/api/posts', methods=['GET'])
def get_posts():
    return jsonify(fetch_reddit_posts(25))

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
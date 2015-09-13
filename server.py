from flask import Flask, request, jsonify, redirect, send_from_directory, \
    render_template, session, send_file, Response
import logging
from flask.ext.triangle import Triangle
import hiddenmsg
import base64
import shutil

app = Flask(__name__, static_url_path='')
logger = logging.getLogger()
Triangle(app)

@app.route('/static/<path:path>')
def send_static(path):
    return send_from_directory('static', path)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/img/post', methods=['POST', 'GET'])
def img_posted():
    if request.method == 'POST':
        resp = Response(status=200)
        print request.files #Bug fix : https://github.com/mitsuhiko/flask/issues/904
        return resp


@app.route('/api', methods=['POST', 'GET'])
def api():
    if request.method == 'POST':
        msg_b64 = request.get_json()["message"]
        #msg = base64.b64decode(msg_b64)
        e = hiddenmsg.Encode(base64_data = msg_b64)#, output_dir="/home/greg/Desktop/projects/hidden-msg-webapp/encoded/", images_to_encode="/home/greg/Desktop/projects/hidden-msg-webapp/images/")
        encoded_images = e.encode()
        for i in encoded_images:
            shutil.copy2('encoded/' + i, 'static/img/')

    return jsonify({"encoded_images": encoded_images})

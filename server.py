from flask import Flask, request, jsonify, redirect, send_from_directory, \
    render_template, session, send_file, Response
import logging
from flask.ext.triangle import Triangle
import hiddenmsg
import base64
import shutil
import tempfile
from werkzeug import secure_filename
import uuid
import os
import glob
import random

app = Flask(__name__, static_url_path='')
logger = logging.getLogger()
Triangle(app)

image_dir = "images/"
image_subreddits = ["aww", "botanicalporn", "earthporn", "norwaypics"]

@app.route('/static/<path:path>')
def send_static(path):
    return send_from_directory('static', path)

@app.route('/')
def index():
    return render_template('index.html')


@app.route('/img/post', methods=['POST', 'GET'])
def img_posted():
    if request.method == 'POST':
        #TODO: prevent user from creating large amount of tmpfiles...

        random_suffix = str(uuid.uuid4().get_hex().upper()[0:12])
        tmpdir = tempfile.mkdtemp(dir="uploaded_images")

        file = request.files["file"]
        filename = secure_filename(random_suffix + "." + file.filename)
        file.save(tmpdir + "/" + filename)

        try:
            hm = hiddenmsg.Decode(images_dir=tmpdir + "/")
            decoded_data = hm.get_data()
        except ValueError:
            return Response(status=500, response="Are you sure this file is encoded with data?")
        except Exception:
            return Response(status=500, response="Ooops, something went wrong!")

        return Response(status=200, response=decoded_data)


@app.route('/api', methods=['POST', 'GET'])
def api():
    if request.method == 'GET':
        action = request.args.get('action', '')
        if action == "image_sources":
            image_sources = []
            for idx, item in enumerate(image_subreddits):
                if os.path.isdir(image_dir + item):
                    image_sources.append({ "id" : idx, "subreddit" : item })
                else:
                    logging.critical("%s directory does not exist" % (image_dir + item))
            return jsonify({"images" : image_sources})

    if request.method == 'POST':

        subreddit = request.get_json()["subreddit"]
        msg_b64 = request.get_json()["message"]

        image = glob.glob(image_dir + subreddit + "/*")
        random.shuffle(image)
        image = image[0:10]

        e = hiddenmsg.Encode(base64_data = msg_b64, images_to_encode=image)#, output_dir="/home/greg/Desktop/projects/hidden-msg-webapp/encoded/", images_to_encode="/home/greg/Desktop/projects/hidden-msg-webapp/images/")
        encoded_images = e.encode()
        for i in encoded_images:
            shutil.copy2('encoded/' + i, 'static/img/')

    return jsonify({"encoded_images": encoded_images})

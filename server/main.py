from flask import Flask, request, jsonify
from flask_cors import CORS

import torch
import numpy as np
import matplotlib.pyplot as plt
from neo4j import GraphDatabase
import os
from sentence_transformers import SentenceTransformer, util
import pandas as pd

app = Flask(__name__)
CORS(app)

model = SentenceTransformer('all-MiniLM-L6-v2')
@app.route('/chat', methods=['POST'])
def chat():
    data = request.json
    text = data['text']

    return jsonify(data)
if __name__ == "__main__":
    app.run(host='0.0.0.0', port=1234)
from neo4j import GraphDatabase
from flask import Flask, request, jsonify, Response
from flask_cors import CORS
from sentence_transformers import SentenceTransformer, util
import numpy as np
import pandas as pd
import json
import time


app = Flask(__name__)
CORS(app)

# Load the pre-trained MiniLM model
model = SentenceTransformer('all-MiniLM-L6-v2')

def rank_words_in_question(question, threshold=0.25):
    """Rank the words in a question based on their importance using SentenceTransformer embeddings and apply a threshold."""

    # Remove question marks from the question
    question = question.replace('?', '')

    # Tokenize the question into words
    tokens = question.split()

    # Generate the embedding for the entire question
    question_embedding = model.encode(question)

    # Generate embeddings for each word in the question
    word_embeddings = [model.encode(word) for word in tokens]

    # Compute cosine similarity between each word's embedding and the question's embedding
    similarities = [np.dot(question_embedding, word_embedding) / (np.linalg.norm(question_embedding) * np.linalg.norm(word_embedding))
                    for word_embedding in word_embeddings]

    # Combine words with their similarity scores
    word_similarity_pairs = list(zip(tokens, similarities))

    # Rank words by similarity score and apply the threshold
    ranked_words = [pair for pair in word_similarity_pairs if pair[1] >= threshold]
    ranked_words = sorted(ranked_words, key=lambda x: x[1], reverse=True)

    return ranked_words


# Initialize connection to Neo4j with hardcoded credentials
def init_driver():
    uri = "bolt://localhost:7687"  
    username = "neo4j"         
    password = "Security.4u"  
    return GraphDatabase.driver(uri, auth=(username, password))

# Run a Cypher query and return the results
def run_query(driver, query):
    with driver.session() as session:
        result = session.run(query)
        # Convert the result to a list of dictionaries
        records = [record.data() for record in result]
    return records


def rank_documents_by_summary(related_topic_documents, query):
    # Extract titles and summaries from the result
    titles = [doc['title'] for doc in related_topic_documents]
    texts = [doc['text'] for doc in related_topic_documents]

    # Combine title and summary into a single text field for each document
    combined_texts = [f"{title} {text}" for title, text in zip(titles, texts)]

    # Generate embeddings for the query and combined document texts
    all_texts = [query] + combined_texts
    embeddings = model.encode(all_texts, convert_to_tensor=True)

    # Compute cosine similarity between the query embedding and document embeddings
    query_embedding = embeddings[0]
    document_embeddings = embeddings[1:]
    cosine_similarities = util.pytorch_cos_sim(query_embedding, document_embeddings).squeeze().cpu().numpy()

    # Create a DataFrame for easier handling
    df = pd.DataFrame({
        'title': titles,
        'text': texts,
        'similarity': cosine_similarities
    })

    # Rank documents based on similarity scores
    df_sorted = df.sort_values(by='similarity', ascending=False).reset_index(drop=True)

    return df_sorted

def generate_nodes_stream(question):
    try:
        if not question:
            return jsonify({"data": {"ERROR": "No question provided"}})
            

        driver = init_driver()

        ranked_words = rank_words_in_question(question)
        ranked_words = list(map(lambda x: x[0], ranked_words))

        query = f"""
        MATCH (n:Document)-[r]-(m)
        WHERE m.id IN {ranked_words}
        RETURN n.title as title, n.text as text
        """
        result = run_query(driver, query)
        nodes = set()
        for i in result:
            nodes.add((i['title'], i['text']))

        relevant_documents = [{'title': record[0], 'text': record[1]} for record in nodes]  

        # relevant_documents = [record['text'] for record in n]

        titles = rank_documents_by_summary(relevant_documents, question).head(3)["title"]

        subgraph_query = f"""MATCH (n:Document)-[r]-(m)
                        WHERE n.title IN {list(titles)} AND NOT m:Document
                        RETURN id(n) as source_id, n.title as source_title, id(m) as target_id, m.id as target_title, r as rel_type;
                        """
        finalgraph_n = run_query(driver, subgraph_query)

        final_nodes=[]

        for i in finalgraph_n:
            final_nodes.append({
                'source_id': i['source_id'],
                'source_title': i['source_title'],
                'target_id': i['target_id'],
                'target_title': i['target_title'],
                'rel_type': i['rel_type'][1]
            })

        driver.close()
        return final_nodes 
            

        # phi3_response = call_phi3(relevant_documents, question)
        # for chunk in phi3_response:
        #     yield f"data: {chunk}\n\n"


    except Exception as ex:
        return jsonify({"data":ex})

@app.route('/getNodes', methods=['POST'])
def get_nodes():
    question = request.json.get('question') # This can be dynamic, e.g., from request.args
    return jsonify({"data":generate_nodes_stream(question)}) 

# @app.route('/phiRequirements', methods=['POST'])
# def call_phi3():
#     data = request.get_json()
#     relevant_documents = data.get('relevant_documents')
#     question = data.get('question')

#     if not relevant_documents or not question:
#         return jsonify({"ERROR": "Missing relevant_documents or question"}), 400

#     phi3_output = f"Processed {len(relevant_documents)} documents with question: {question}"

#     # Stream the response if needed
    # return Response(f"data: {phi3_output}\n\n", mimetype='text/event-stream')

@app.route('/getSummaries', methods=['GET'])
def get_summaries():
    # Extract the node ID from query parameters
    node_id = request.args.get('id')

    if not node_id:
        return jsonify({"ERROR": "Node ID is required"}), 400

    try:
        driver = init_driver()
        query = f"""
        MATCH (n:Document)
        WHERE id(n) = {node_id}
        RETURN n.title AS title, n.text AS text
        """
        result = run_query(driver, query)

        if not result:
            return jsonify({"ERROR": "Node not found"}), 404

        node_data = result
        summary = {
            "title": node_data.get("title"),
            "text": node_data.get("text")
        }

        driver.close()
        return jsonify(summary)

    except Exception as ex:
        return jsonify({"ERROR": str(ex)}), 500

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=8000, debug=True)
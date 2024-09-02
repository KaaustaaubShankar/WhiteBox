from neo4j import GraphDatabase
from flask import Flask, request, jsonify
from flask_cors import CORS
from sentence_transformers import SentenceTransformer
import numpy as np

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
    uri = "bolt://localhost:7687"  # Replace with your Neo4j URI
    username = "neo4j"         # Replace with your Neo4j username
    password = "Security.4u"  # Replace with your Neo4j password
    return GraphDatabase.driver(uri, auth=(username, password))

# Run a Cypher query and return the results
def run_query(driver, query):
    with driver.session() as session:
        result = session.run(query)
        
        nodes = set()
        edges = []

        for record in result:
            # Extract node properties and relationship type
            node1 = record['n'].get('title') or record['n'].get('id') 
            node2 = record['m'].get('title') or record['m'].get('id')
            relation = record['r'].type

            if node1 is None or node2 is None:
                print(f"Missing node names in record: {record}")

            nodes.add(node1)
            nodes.add(node2)
            edges.append((node1, node2, relation))

        return list(nodes), edges

@app.route('/userquestion', methods=['POST'])
def get_question():
    data = request.get_json()
    question = data.get('question')

    return str(question)

@app.route('/answernodes', methods=['POST'])
def main():
    data = request.get_json()
    question = data.get('question')

    # Automatically connect to Neo4j using hardcoded credentials
    driver = init_driver()

    ranked_words = rank_words_in_question(question)
    ranked_words = list(map(lambda x: x[0], ranked_words))

    # Build the dynamic Cypher query based on filters
    query = f"""
    MATCH (n:Document)-[r]-(m)
    WHERE m.id IN {ranked_words}
    """

    # Limit results for performance
    query += " RETURN n, r, m LIMIT 1000"


    # Now that the query is defined, use these at your will
    nodes, links = run_query(driver, query)
   
    driver.close()

    return jsonify({'nodes': nodes, 'links': links})


if __name__ == "__main__":
    main()

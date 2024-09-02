from neo4j import GraphDatabase
from flask import Flask, request, jsonify
from flask_cors import CORS
from sentence_transformers import SentenceTransformer, util
import numpy as np
import pandas as pd


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
        n = set()
        edges = []

        for record in result:
            # Extract node properties and relationship type
            node1 = record['n']
            node2 = record['m']
            relation = record['r'].type

            # print('\n',node1.get('title'))
            if node1 is None or node2 is None:
                print(f"Missing node names in record: {record}")

            n.add(node1)
            edges.append(
                {'source':{
                    'title': node1.get('title'),
                    'summary': node1.get('summary'),
                    'label': 'Document'
                    },
                'target':{
                    'title': node2.get('id'),
                    'label': 'Entity'
                },
                'relationship': relation
                }
            )

        return n, edges

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

@app.route('/answernodes', methods=['GET'])
def answernodes():
    try: 
            
        question = "What are the symptoms of lung cancer" #data.get('question')

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
        n = run_query(driver, query)[0]
        titles=rank_documents_by_summary(n,question).head(5)["title"]


        subgraph_query = f"""MATCH (n:Document)-[r]-(m)
                        WHERE n.title IN {list(titles)} AND NOT m:Document
                        RETURN n,r, m
                        """
        finalgraph_n, finalgraph_r= run_query(driver, subgraph_query)
        
        #this is for the llm
        finalgraph_n_text = [elem["text"] for elem in finalgraph_n]
        driver.close()

        #this is for the visualization
        return jsonify(finalgraph_r)

    

    except Exception as ex:
        return jsonify({"ERROR":str(ex)})


if __name__ == "__main__":
    app.run(host='0.0.0.0', port=1234)
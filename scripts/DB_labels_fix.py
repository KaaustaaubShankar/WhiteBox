from fuzzywuzzy import fuzz
from neo4j import GraphDatabase

LABELS_QUERY="CALL db.labels() YIELD label RETURN label"

uri = "INSTANCE_URI"  
username = "USERNAME"         
password = "PASSWORD"  
driver = GraphDatabase.driver(uri, auth=(username, password))

def checkUnderscore(word):
    if '_' in word:
        word.replace('_',' ')
    return word

with driver.session() as session:
    labels = [record['label'] for record in session.run(LABELS_QUERY)]

similarity_threshold = 89

for i in range(4):
    similar_labels = []
    for i in range(len(labels)):
        for j in range(i + 1, len(labels)):
            label1 = checkUnderscore(labels[i])
            label2 = checkUnderscore(labels[j])
            
            similarity = fuzz.ratio(label1, label2)
            if similarity >= similarity_threshold:
                similar_labels.append((label1, label2, similarity))

    for label1, label2, similarity in similar_labels:
        with driver.session() as session:
            query = f"""
            MATCH (n) 
            WHERE (n:`{label1}`) OR (n:`{label2}`) 
            SET n:`{label1}` 
            REMOVE n:`{label2}`
            """
            session.run(query)
            print(f"Merged '{label2}' into '{label1}' and removed '{label2}'")
    
    print(F"\n\n *****ROUND {i} DONE*****")
    
print("Done!")

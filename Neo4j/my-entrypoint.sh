#!/bin/bash

# Load the database from the dump file
neo4j-admin load --from=/backups/neo4j.dump --database=neo4j --force

# Ensure the neo4j user owns the data directory
chown -R neo4j:neo4j /data

# Start Neo4j
exec /docker-entrypoint.sh neo4j
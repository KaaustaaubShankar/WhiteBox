#!/bin/bash

# Create directories
mkdir -p /data
mkdir -p /backups

# Copy the dump file
cp /backups/neo4j.dump /data/

# Load the database
neo4j-admin database load --database=neo4j --from=/data/neo4j.dump --overwrite-destination=true

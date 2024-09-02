# Use the official Neo4j image as the base image
FROM neo4j:5.23.0

# Set environment variables
ENV NEO4J_AUTH=none
ENV NEO4J_dbms_directories_data=/data
ENV NEO4J_dbms_security_auth__enabled=false

# Create necessary directories
RUN mkdir -p /data /backups

# Copy the Neo4j dump file into the container
COPY --chown=neo4j:neo4j neo4j.dump /backups/neo4j.dump

# Copy custom entrypoint script
COPY my-entrypoint.sh /my-entrypoint.sh
RUN chmod +x /my-entrypoint.sh

# Set the entrypoint
ENTRYPOINT ["/my-entrypoint.sh"]

# Expose necessary ports
EXPOSE 7474 7687

# Set default command to start Neo4j
CMD ["neo4j"]
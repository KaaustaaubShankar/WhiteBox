# Use the official Neo4j image as the base image
FROM neo4j:5.23.0

# Create directories in the container
RUN mkdir -p /data 
RUN mkdir -p /backups

# Copy the script into the container
COPY load-data.sh /scripts/load-data.sh

# Make the script executable
RUN chmod +x /scripts/load-data.sh

# Run the data loading script and start Neo4j
CMD ["/bin/bash", "-c", "/scripts/load-data.sh && neo4j"]

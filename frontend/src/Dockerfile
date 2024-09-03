# Use an official Node.js runtime as a parent image
FROM node:18-slim

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json into the container
COPY package*.json ./

# Install npm dependencies
RUN npm install

# Copy the rest of the application code into the container
COPY . .

# Set the default command to run the application
CMD ["npm", "start"]

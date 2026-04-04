# Use the official Node.js 20 image as a base
FROM node:20-alpine

# Install lsof for predev scripts
RUN apk add --no-cache lsof

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to install dependencies first (caching layer)
COPY package*.json ./

# Install dependencies (only devDependencies are needed for nodemon)
RUN npm install

# Copy the rest of the application source code
COPY . .

# Expose the port the server runs on
EXPOSE 5000

# Run the server directly to bypass problematic scripts
CMD ["node", "index.js"]
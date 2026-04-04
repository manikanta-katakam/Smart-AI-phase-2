# Use the official Node.js 20 image as a base
FROM node:20-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to install dependencies first (caching layer)
COPY package*.json ./

# Install dependencies (development dependencies are required for building and running VITE)
RUN npm install

# Copy the rest of the application source code
COPY . .

# Expose the port the Vite dev server runs on (default: 5173)
EXPOSE 5173

# Run the frontend in development mode using Vite
# Specifying host 0.0.0.0 is crucial to make it accessible outside the container
CMD ["npm", "run", "dev", "--", "--host"]
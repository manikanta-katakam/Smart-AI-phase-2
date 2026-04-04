# Use the official Python 3.9 image as a base
FROM python:3.9-slim

# Set the working directory inside the container
WORKDIR /app

# Copy requirements.txt first for faster Docker builds (caching layer)
COPY requirements.txt ./

# Install Python dependencies from requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application source code
COPY . .

# Expose the default port for the microservice
EXPOSE 5001

# Run the Flask app
# CMD ["python", "app.py"] is used here as it's a dev-focused microservice.
CMD ["python", "app.py"]

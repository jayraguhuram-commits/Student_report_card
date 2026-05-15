# Stage 1: Build the React frontend
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install --legacy-peer-deps
COPY . .
RUN npm run build

# Stage 2: Serve with Python Flask
FROM python:3.9-slim
WORKDIR /app

# Copy the built React app
COPY --from=build /app/dist /app/dist

# Copy the Flask backend
COPY backend /app/backend

# Install Python dependencies
WORKDIR /app/backend
RUN pip install flask flask-cors gunicorn

# Expose port (Cloud Run sets the PORT env variable, defaulting to 8080)
EXPOSE 8080

# Command to run Gunicorn
CMD gunicorn --bind 0.0.0.0:${PORT:-8080} app:app

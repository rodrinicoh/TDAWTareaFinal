# Use a base image
FROM node:14

# Set the working directory in the container
WORKDIR /app

# Copy the application files to the container
COPY package*.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Command to start the application
CMD ["npm", "start"]

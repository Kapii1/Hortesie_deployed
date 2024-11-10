# Stage 1: Build the React application
FROM node:18-alpine AS build

# Set working directory
WORKDIR /app

# Copy package.json and yarn.lock
COPY package.json yarn.lock ./
COPY ./package.json /package.json 
# Install dependencies
RUN yarn install --frozen-lockfile

# Copy the rest of the application source code
COPY . .


# Expose port 3000
EXPOSE 3000

CMD ["yarn", "start"]
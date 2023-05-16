FROM node:16

# Create app directory
WORKDIR /devicedata

RUN apt-get update && apt-get install -y vim

# Install app dependencies
COPY package*.json ./

# Install dependencies
RUN npm install --legacy-peer-deps

RUN npm i --location=global nodemon

# Copy source directory
COPY . .

CMD [ "npm", "run" ,"start" ]

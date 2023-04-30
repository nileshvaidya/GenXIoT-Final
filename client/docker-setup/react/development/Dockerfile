FROM node:16-slim

# Create app directory
WORKDIR /frontend

# Install app dependencies
COPY package.json package-lock.json ./

COPY . .

RUN npm install --legacy-peer-deps

ENV NODE_ENV=development

CMD [ "npm", "start" ]

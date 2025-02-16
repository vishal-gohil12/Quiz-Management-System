FROM node:16-alpine

# Set the working directory
WORKDIR /app

COPY package*.json ./


RUN npm install
COPY . .

EXPOSE 3000

CMD ["node", "src/index.js"]

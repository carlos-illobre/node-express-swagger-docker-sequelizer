FROM node:8.8.1

COPY . /app
WORKDIR /app

CMD ["npm", "start"]

FROM node:10-buster-slim

WORKDIR /app

COPY package.json ./
RUN npm install --loglevel=error

COPY . .

EXPOSE 4201

CMD ["./node_modules/.bin/gulp"]

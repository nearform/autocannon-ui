FROM node:18-alpine

RUN npm install -g autocannon-ui@latest

EXPOSE 3000

CMD ["npx", "autocannon-ui", "--port", "3000", "--host", "0.0.0.0"]

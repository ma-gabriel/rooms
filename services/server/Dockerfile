FROM node:current-slim
WORKDIR /var/npm-project
RUN apt-get update -y
RUN apt-get install -y openssl
EXPOSE 8080
COPY npm-project/. .
RUN npm install
RUN apt-get update
CMD ["npm", "run", "dev"]
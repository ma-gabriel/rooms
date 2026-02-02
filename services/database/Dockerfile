FROM node:current-slim
WORKDIR /var/npm-project
EXPOSE 8080
COPY npm-project/. .
RUN npm install
RUN apt-get update
CMD ["npm", "run", "dev"]
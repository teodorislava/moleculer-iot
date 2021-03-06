FROM node:latest
RUN mkdir /app
WORKDIR /app
ADD package*.json /app/
RUN npm install
ADD . /app/
CMD [ "npm", "start"]
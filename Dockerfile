FROM node:14
COPY . /node/app
WORKDIR /node/app
RUN npm install

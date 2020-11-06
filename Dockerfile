FROM node:12
COPY . /node/app
WORKDIR /node/app
RUN npm install

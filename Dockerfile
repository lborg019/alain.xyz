FROM node:latest
MAINTAINER Alain Galvan <hi@alain.xyz>
LABEL Name=alain.xyz Version=1.0.0 
COPY package.json /tmp/package.json
RUN cd /tmp && npm install --production
RUN mkdir -p /usr/src/app && mv /tmp/node_modules /usr/src
WORKDIR /usr/src/app
COPY . /usr/src/app
EXPOSE 3000
CMD npm run start

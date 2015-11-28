FROM node

MAINTAINER Adam Kerr, Jerridan Quiring

ADD . /src
WORKDIR /src

RUN npm install
EXPOSE 3000

CMD ["node", "/src/tin_can.js"]
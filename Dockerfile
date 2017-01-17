FROM node:7.4.0

WORKDIR /code

COPY package.json /code/package.json
RUN npm install

COPY src /code/src

EXPOSE 80

CMD ["node", "."]

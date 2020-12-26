## Node
FROM node:12.6.0

## Directory
WORKDIR /app

## Copy Files
COPY package.json .
COPY yarn.lock .

## Scrips
RUN npm install copyfiles -g
RUN yarn install:prod

## Copy folders
COPY . .

## Build app
RUN yarn build

## Remove src
RUN rm -rf src/

# Start the api server
CMD ["yarn", "start"]

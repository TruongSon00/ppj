FROM node:14-alpine AS develop

# Create app directory
WORKDIR /app

# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./

RUN npm cache clean --force

COPY package*.json ./

# Install app dependencies
RUN npm install

COPY . .

RUN npm run build

FROM node:14 as production
COPY package*.json ./

RUN npm cache clean --force

COPY package*.json ./
RUN npm install
COPY . .
COPY --from=develop /app/dist ./dist

CMD [ "npm", "run", "start:prod" ]
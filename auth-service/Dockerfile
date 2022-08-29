FROM node:16-alpine AS development

WORKDIR /app

COPY package*.json ./

# Install app dependencies
RUN npm install

COPY . .

RUN npm run build

FROM node:16-alpine As production

COPY package*.json ./

RUN npm install --production

COPY . .

COPY --from=development /app/dist ./dist

CMD [ "npm", "run", "start:prod" ]
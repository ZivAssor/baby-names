FROM node:18.5.0-alpine
WORKDIR /usr/app
COPY . .
RUN npm ci
RUN npm run build
CMD ["npm","start"]
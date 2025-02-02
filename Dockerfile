
FROM node:14
ENV NODE_ENV=production
WORKDIR /app
COPY package.json .
COPY yarn.lock .
RUN yarn install --production --silent
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
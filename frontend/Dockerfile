FROM node:18 as frontend-build
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
COPY .env .env

EXPOSE 3000

CMD ["npm", "run", "start"]



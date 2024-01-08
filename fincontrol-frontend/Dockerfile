FROM node:latest

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
copy package*.json ./
RUN npm install

# Bundle app source
COPY . .

EXPOSE 3000
CMD ["npm", "run", "dev"]
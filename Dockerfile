FROM node:24
# Setup the working directory
RUN mkdir /srv/github-actions-app
WORKDIR /srv/github-actions-app
# Send over the dependency definitions to the container
COPY package.json package-lock.json ./
RUN npm i
# Copy the whitelisted files
COPY . .


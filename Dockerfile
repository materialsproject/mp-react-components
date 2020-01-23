FROM node:12.14.1
# Setup the working directory
RUN mkdir /srv/github-actions-app
WORKDIR /srv/github-actions-app
# Send over the dependency definitions to the container
COPY package.json package-lock.json ./
RUN npm i
# Copy the whitelisted files
COPY . .
# Run the tests


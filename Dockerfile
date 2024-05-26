FROM ghcr.io/puppeteer/puppeteer:22.7.1

# Setting environment variables
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable

# Setting the working directory
WORKDIR /usr/src/app

# Copying package.json and package-lock.json files
COPY package*.json ./

# Switching to root user temporarily to install dependencies
USER root
RUN npm ci

# Switching back to the node user
USER node

# Copying the rest of the application files
COPY . .

# Running the application
CMD [ "node", "app.js" ]

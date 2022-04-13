FROM gitpod/workspace-full-vnc

# Install Cypress dependencies.
RUN sudo apt-get update  && sudo DEBIAN_FRONTEND=noninteractive apt-get install -y    libgtk2.0-0    libgtk-3-0    libnotify-dev    libgconf-2-4    libnss3    libxss1    libasound2    libxtst6    xauth    xvfb  && sudo rm -rf /var/lib/apt/lists/*


RUN npm i -g firebase-tools
RUN npm i -g @angular/cli

#set puppeteer chrome as chrome
#ENV CHROME_BIN=/workspace/starterkit/node_modules/puppeteer/.local-chromium/linux-938248/chrome-linux/chrome
#RUN gp env --export CHROME_BIN=/workspace/starterkit/node_modules/puppeteer/.local-chromium/linux-938248/chrome-linux/chrome
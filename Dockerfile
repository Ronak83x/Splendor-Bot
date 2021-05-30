FROM node:12.19-slim

ENV USER=Splendorbot

# install python and make
RUN apt-get update && \
	apt-get install -y python3 build-essential && \
	apt-get purge -y --auto-remove
	
# create Splendorbot user
RUN groupadd -r ${USER} && \
	useradd --create-home --home /home/Splendorbot -r -g ${USER} ${USER}
	
# set up volume and user
USER ${USER}
WORKDIR /home/Splendorbot

COPY package*.json ./
RUN npm install 
VOLUME [ "/home/Splendorbot" ]

COPY . .

ENTRYPOINT [ "node", "index.js" ]

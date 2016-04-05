#FROM ubuntu
#RUN apt-get update
#RUN apt-get install -y git nodejs npm
#RUN git clone git://github.com/DuoSoftware/DVP-HTTPProgrammingAPIDEBUG.git /usr/local/src/httpprogrammingapidebug
#RUN cd /usr/local/src/httpprogrammingapidebug; npm install
#CMD ["nodejs", "/usr/local/src/httpprogrammingapidebug/app.js"]

#EXPOSE 8825

FROM node:argon
RUN npm install npm -g
RUN git clone git://github.com/DuoSoftware/DVP-HTTPProgrammingAPIDEBUG.git /usr/local/src/httpprogrammingapidebug
RUN cd /usr/local/src/httpprogrammingapidebug;
WORKDIR /usr/local/src/httpprogrammingapidebug
RUN npm install
EXPOSE 8825
CMD [ "node", "/usr/local/src/httpprogrammingapidebug/app.js" ]

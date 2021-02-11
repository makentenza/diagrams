FROM quay.io/makentenza/drawio:14.3.0

COPY PreConfig.js /usr/local/tomcat/webapps/draw/js/
COPY PostConfig.js /usr/local/tomcat/webapps/draw/js/

COPY entrypoint.sh /

RUN chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]
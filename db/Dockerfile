FROM mysql:5.7

ENV MYSQL_DATABASE stormlight
ENV MYSQL_ROOT_PASSWORD supersecret
ENV MYSQL_USER mysql
ENV MYSQL_PASSWORD supersecret
ENV DATABASE_HOST db

EXPOSE 3306

# Add the content of the sql-scripts/ directory to your image
# All scripts in docker-entrypoint-initdb.d/ are automatically
# executed during container startup
COPY ./sql-scripts /docker-entrypoint-initdb.d/

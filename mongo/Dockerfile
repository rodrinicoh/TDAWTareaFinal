FROM mongo:4.2.0

COPY dbinit.js /docker-entrypoint-initdb.d/

ENV MONGO_INITDB_DATABASE=MyMovies

EXPOSE 27017
#!/bin/bash
set -e

# Usa las variables de entorno para crear el usuario y contraseña de forma segura.

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    DO
    \$do\$
    BEGIN
       IF NOT EXISTS (
          SELECT FROM pg_catalog.pg_roles
          WHERE  rolname = '$APP_DB_USER') THEN
          CREATE ROLE $APP_DB_USER LOGIN PASSWORD '$APP_DB_PASSWORD';
       END IF;
    END
    \$do\$;

    -- Permisos base para que pueda conectarse
    GRANT CONNECT ON DATABASE $POSTGRES_DB TO $APP_DB_USER;
    GRANT USAGE ON SCHEMA public TO $APP_DB_USER;
EOSQL
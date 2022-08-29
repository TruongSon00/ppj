#!/bin/bash

echo REACT_APP_HOST=$REACT_APP_HOST >> .env
echo REACT_APP_SOCKET_HOST=$REACT_APP_SOCKET_HOST >> .env
echo NODE_ENV=$NODE_ENV >> .env
echo SERVER_TIMEOUT=$SERVER_TIMEOUT >> .env
echo SERVER_PORT=$SERVER_PORT >> .env

echo DATABASE_HOST=$DATABASE_HOST >> .env
echo DATABASE_TYPE=postgres >> .env
echo DATABASE_PORT=$DATABASE_PORT >> .env
echo DATABASE_USERNAME=$DATABASE_USERNAME >> .env
echo DATABASE_PASSWORD=$DATABASE_PASSWORD >> .env
echo DATABASE_NAME=$DATABASE_NAME >> .env
echo DATABASE_CONNECTION_TIME_OUT=150000 >> .env
echo DATABASE_ACQUIRE_TIME_OUT=150000 >> .env
echo DATABASE_CONNECTION_LIMIT=20 >> .env

echo JWT_ACESS_TOKEN_SECRET=$JWT_ACESS_TOKEN_SECRET >> .env
echo JWT_ACESS_TOKEN_EXPIRES_IN=$JWT_ACESS_TOKEN_EXPIRES_IN >> .env
echo JWT_RESFRESH_TOKEN_SECRET=$JWT_RESFRESH_TOKEN_SECRET >> .env
echo JWT_RESFRESH_TOKEN_EXPIRES_IN=$JWT_RESFRESH_TOKEN_EXPIRES_IN >> .env


echo MAIL_HOST=$MAIL_HOST >> .env
echo MAIL_PORT=$MAIL_PORT >> .env
echo MAIL_USERNAME=$MAIL_USERNAME >> .env
echo MAIL_PASSWORD=$MAIL_PASSWORD >> .env
echo MAIL_NO_REPLY=$MAIL_NO_REPLY >> .env

echo OTP_MIN_NUMBER=$OTP_MIN_NUMBER >> .env
echo OTP_MAX_NUMBER=$OTP_MAX_NUMBER >> .env


echo USER_SERVICE_PORT=$USER_SERVICE_PORT >> .env
echo USER_SERVICE_HOST=$USER_SERVICE_HOST >> .env

echo WAREHOUSE_SERVICE_PORT=$WAREHOUSE_SERVICE_PORT >> .env
echo WAREHOUSE_SERVICE_HOST=$WAREHOUSE_SERVICE_HOST >> .env

echo ITEM_SERVICE_PORT=$ITEM_SERVICE_PORT >> .env
echo ITEM_SERVICE_HOST=$ITEM_SERVICE_HOST >> .env

echo SALE_SERVICE_PORT=$SALE_SERVICE_PORT >> .env
echo SALE_SERVICE_HOST=$SALE_SERVICE_HOST >> .env

echo SETTING_SERVICE_PORT=$SETTING_SERVICE_PORT >> .env
echo SETTING_SERVICE_HOST=$SETTING_SERVICE_HOST >> .env

echo PRODUCE_SERVICE_PORT=$PRODUCE_SERVICE_PORT >> .env
echo PRODUCE_SERVICE_HOST=$PRODUCE_SERVICE_HOST >> .env


echo CORS_ORIGINS=* >> .env
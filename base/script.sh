#!/bin/bash
set -a # automatically export all variables
source .env
set +a


docker-compose up -d

# curl --location --request POST `http://localhost:${KONG_ADMIN_PORT}/services/' \
# --header 'Content-Type: application/json' \
# --data-raw '{
#     "name": "admin-api",
#     "host": "localhost",
#     "port": ${KONG_ADMIN_PORT}
# }`

# curl --location --request POST `http://localhost:${KONG_ADMIN_PORT}/services/kong-admin/routes' \
# --header 'Content-Type: application/json' \
# --data-raw '{
#     "paths": ["/admin-api"]
# }`

# curl -X POST `http://localhost:${KONG_ADMIN_PORT}/services/kong-admin/plugins \
#     --data "name=key-auth"`

# curl --location --request POST `http://localhost:${KONG_ADMIN_PORT}/consumers/' \
# --form 'username=admin' \
# --form 'custom_id=cebd360d-3de6-4f8f-81b2-31575fe9846a`

# curl --location --request POST `http://localhost:${KONG_ADMIN_PORT}/consumers/e7b420e2-f200-40d0-9d1a-a0df359da56e/key-auth` >> kong.out


sleep 10

docker exec -it $ENV_CONTAINER-consul consul acl bootstrap > script.out

# docker exec -it local-consul consul acl policy create -name "agent-token" -description "Agent Token Policy" -rules @/etc/consul.d/agent-policy.hcl

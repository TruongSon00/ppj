STEP TO DEPLOY SYSTEM:

1. Deploy Kong api-gateway:

   - in `kong` folder: copy and change configuration of .env.sample
   - build container: docker-compose up -d --build

2. Deploy Consul:

   - Read the guide in `consul`

3. Deploy services:
   - clone the base-service repo
   - create .env file
   - build image with name that docker-compose use to run contaner (example: sample-service:1.0.0)
   - run docker-compose:
     - dev: ./scripts/compose-dev.script.sh
     - prod: ./scripts/compose-production.script.sh

###echo 226 >> /consul/data/acl-bootstrap-reset

#!/usr/bin/env bash

set -e

docker build --platform linux/amd64 -t ghcr.io/windbit/ion-dns-frontend-old .
docker push ghcr.io/windbit/ion-dns-frontend-old

ssh infra 'set -e
cd /srv/ion-dns
docker compose pull
docker compose up -d'

#!/usr/bin/env bash

set -eo pipefail

host_port="$DATABASE_HOST:$DATABASE_PORT"
echo "Waiting for $host_port"
./wait-for-it.sh $host_port --timeout=25

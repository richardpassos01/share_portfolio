#!/bin/bash
set -eo pipefail

./wait-for-db.sh
npm run migration:up
npm run dev

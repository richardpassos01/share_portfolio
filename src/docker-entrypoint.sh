#!/bin/sh

startup_app=${1:-web}

case $startup_app in
    "web")
        echo "starting web"
        ./startup-web.sh
        ;;
    "web-local")
        echo "starting web-local"
        ./startup-web-local.sh
        ;;
    *)
        echo "Running custom command: $@"
        exec $@
        ;;
esac

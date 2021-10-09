#!/bin/bash

rsync -av --progress base/ "$1" \
    --exclude node_modules \
    --exclude .parcel-cache \
    --exclude dist

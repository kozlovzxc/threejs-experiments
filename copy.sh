#!/bin/bash

rsync -av --progress _base/ "$1" \
    --exclude node_modules \
    --exclude .parcel-cache \
    --exclude dist

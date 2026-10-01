#!/bin/bash

SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )

pushd $SCRIPT_DIR 2>/dev/null

DONE=0

cleanup() {
  DONE=1
  docker compose down
}

trap cleanup INT
docker compose build &&
docker compose up -d &&
while [ $DONE -eq 0 ]; do
  cd ~/Nextcloud/NextCloud/src/Todo/todo-ui
  inotifywait -e modify,create -r --format \"%w%f\" src/ public/
  if [ $DONE -eq 0 ]; then
    cd ~/src/todo &&
    docker compose up -d --build
  fi
done

#TODO: Trap ctrl-c and shut down docker compose setup.

popd 2> /dev/null

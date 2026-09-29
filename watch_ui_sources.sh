#!/bin/bash

while true; do
  cd ~/Nextcloud/NextCloud/src/Todo/todo-ui
  inotifywait -e modify,create -r --format \"%w%f\" src/
  cd ~/src/todo &&
  docker compose up --build
done

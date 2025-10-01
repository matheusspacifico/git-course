#!/bin/bash

yarn build

if [ $? -eq 0 ]; then
  echo "Success. Starting development server."
  yarn dev
else
  echo "Error. Build failed."
  exit 1
fi
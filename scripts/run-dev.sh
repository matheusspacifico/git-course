#!/bin/bash

npm run build

if [ $? -eq 0 ]; then
  echo "Build concluído com sucesso. Iniciando servidor de desenvolvimento."
  npm run dev
else
  echo "Erro: O build falhou."
  exit 1
fi

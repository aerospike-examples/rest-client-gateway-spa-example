#!/usr/bin/env bash

PRJ_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null && pwd )/..";
cd ${PRJ_DIR}
yarn install
cd ${PRJ_DIR}/node_modules/ts-swagger-gen/
yarn install
yarn build
cd ${PRJ_DIR};
java -jar bin/swagger-codegen-cli.jar generate -i swagger/swagger.json -l typescript-fetch -o src/generated/core/api/
node_modules/ts-swagger-gen/bin/gen src/generated swagger/swagger.json

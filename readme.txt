STATUS CODE:
200 - OK
201 - CREATED
202 - ACCEPTED

400 - BAD REQUEST
401 - UNAUTHORIZED
403 - FORBIDDEN
404 - NOT FOUND

500 - INTERNAL SERVER ERROR


npm init -y

npm i -D eslint

npm i -S -E bcrypt-nodejs

./node_modules/.bin/eslint --init

./node_modules/.bin/eslint src/** test/** --fix

./node_modules/.bin/jest

Docker Container Test: e851d2be2c16e811612aa91a03e66c2f0df11b7e875465f55001ca676c5e04e5

Docker Container Prod: efd1f891c648a6637704141c791ff30c6f51b2e08c176325c81e11eafd5cdead

docker run --name SmartGymProd -e POSTGRES_USER=smartgymprod -e POSTGRES_PASSWORD=smartgymprod -p 6002:5432 -v "D:\Documents\IPCA\Computação Distribuída\Trabalho final\Postgres" -d postgres

docker run --name SmartGymTest -e POSTGRES_USER=smartgym -e POSTGRES_PASSWORD=smartgym -p 6003:5432 -v "D:\Documents\IPCA\Computação Distribuída\Trabalho final\Postgres" -d postgres

NODE_ENV=test 
NODE_ENV=prod 

Aplicar as migrações:
node_modules/.bin/knex migrate:latest --env test
node_modules/.bin/knex migrate:latest --env prod

Voltar nas migrações:
node_modules/.bin/knex migrate:rollback --env test


node_modules/.bin/knex migrate:make create_table_clientes --env test
node_modules/.bin/knex migrate:make create_table_aulas --env test
node_modules/.bin/knex migrate:make create_table_niveis_aula --env test
node_modules/.bin/knex migrate:make create_table_treinos --env test

Criação de seeds:
node_modules/.bin/knex seed:make niveis_aula --env test

Comando para preencher a base de dados com a seed:
node_modules/.bin/knex seed:run --env test
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

Docker Container : 6ae0349c6afde115e5e5d9567a1df72ad5bd489e5b9ca16d13756427c63e6e81

docker run --name SmartGym -e POSTGRES_USER=smartgym -e POSTGRES_PASSWORD=smartgym -p 6003:5432 -v "D:\Documents\IPCA\Computação Distribuída\Trabalho final\Postgres" -d postgres

Aplicar as migrações:
Comando: node_modules/.bin/knex migrate:latest --env test

Voltar nas migrações:
Comando: node_modules/.bin/knex migrate:rollback --env test


node_modules/.bin/knex migrate:make create_table_clientes --env test
node_modules/.bin/knex migrate:make create_table_aulas --env test

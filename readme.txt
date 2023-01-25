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

Docker Container Test: fd718b04207508fc33cc056e0e48bd4d2350d7469ed8748a3971adc4cc4bb669

Docker Container Prod: 28d123818c4f83f9c60a2ff763314227c86f96076db835a0610b68d89caf4bd1

docker run --name SmartGymProd -e POSTGRES_USER=smartgymprod -e POSTGRES_PASSWORD=smartgymprod -p 6002:5432 -v "D:\Documents\IPCA\Computação Distribuída\Trabalho final\Postgres" -d postgres

docker run --name SmartGym -e POSTGRES_USER=smartgym -e POSTGRES_PASSWORD=smartgym -p 6003:5432 -v "D:\Documents\IPCA\Computação Distribuída\Trabalho final\Postgres" -d postgres

NODE_ENV=test 
NODE_ENV=prod 

Aplicar as migrações:
Comando: node_modules/.bin/knex migrate:latest --env test
Comando: node_modules/.bin/knex migrate:latest --env prod

Voltar nas migrações:
Comando: node_modules/.bin/knex migrate:rollback --env test


node_modules/.bin/knex migrate:make create_table_clientes --env test
node_modules/.bin/knex migrate:make create_table_aulas --env test

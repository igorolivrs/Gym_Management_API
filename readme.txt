# Gym Management

Project developed in a team, for completion of the web development course, at the Instituto Politécnico do Cávado e do Ave - IPCA.

# API Smartgym

This project was generated with NodeJS.

## Pre-requisites

Before starting, you need to have installed on your machine:
Docker: https://docs.docker.com/get-docker/

## Creating the container with the application settings

In your terminal run the command:

- To create the test server:
docker run --name SmartGymTest -e POSTGRES_USER=smartgym -e POSTGRES_PASSWORD=smartgym -p 6003:5432 -d postgres

- To create the production server
docker run --name SmartGymProd -e POSTGRES_USER=smartgymprod -e POSTGRES_PASSWORD=smartgymprod -p 6002:5432 -d postgres

## After container created, apply migrations

- Apply Migrations to the test server
node_modules/.bin/knex migrate:latest --env test

- Apply Migrations to the production server
node_modules/.bin/knex migrate:latest --env prod

## Servers

Run `ng run serve_test` for a dev server. Navigate to `http://localhost:3001/`. 

Run `ng run serve` for a prod server. Navigate to `http://localhost:3001/`. 

## Running unit tests

Run `ng run test` to execute the unit tests via Jest.

## Documentation

Navigate to `http://localhost:3001/api-docs`.
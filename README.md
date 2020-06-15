![alt text](pb/GetNotedBigLogo.png)

> ### React.js + Express.js with Apollo GraphQl API + Redis

# GetNoted
![Node.js CI](https://github.com/grzes5003/GetNoted/workflows/Node.js%20CI/badge.svg?branch=master)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Organise, list and store all your tasks. Small React app with express.js backend made for WWWiJS. 
Based on GrapqhQl API implemented with Apollo. Basic JWT and Passport authentication. 

## Getting started
To get app running locally:

**With docker:**
- Clone repo
- Run `docker-compose.yml`
- `cd frontend-react`
- `npm install`
- `npm start`

**Witnout docker:**

- Clone repo
- Install `Redis`
- export address of running redis daemon as envirement variable `REDIS_URL`
- `cd frontend-react`
- `npm install`
- `npm start`
- `cd ../server-node`
- `npm install`
- `npm start`

## General overview 
This repo contains 3 main parts:
- `frontend-react`: React.js app
- `main-server-mock`: Mock server used in early development 
(should not work well with current frontend part)
- `server-node`: Node server based on Express.js

### Frontend
Inside `src` catalog are:
- `/components`: contains all React components used in app and a little more
- `/constatnts`: used for defining global variables
- `/localization`: used for to handle multiple website languages (currently Polish and English)
- `/styles`: SCSS catalog containing custom styles

and `index.js` where `Apollo Graphql client` is created and `App.js` as entry point for Application.
It uses `react-router` as form of website routing with additional `JWT` authentication carried by Node server.

### Backend
Backend (`server-node`) is divided into several parts:
- `/gql`: contains `scheme.graphql` and `resolvers.js` used as resolvers
- `/redis-client`: as name suggests it defines basic client for communication with Redis daemon
- `app.js`, `/bin/www`: defines Express.js server and Apollo Server


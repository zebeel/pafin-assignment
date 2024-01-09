# Tech Assignment - Backend Data Handling

## Objective

The objective of this assignment is to evaluate your skills in handling data on the backend using Node.JS and PostgreSQL.

This app uses Express and PostgreSQL to create APIs that handle CRUD operations. Jest is used for testing. Docker needs to be installed before running the app.

## Database

All database-related configurations are declared in the .env file. Refer to the .envSample file for more details.

#### Database schema

| Column | Type | Remark |
|---|---|---|
| id | varchar(36)  | unique UUID(36 characters) |
| name | varchar(30)  | non-empty string, max-length is 30 |
| email | text | a valid email |
| password | text | the string is hashed from the password |

## Run the app

Before running the app, rename the file ```env.Sample``` to ```.env```.

#### Start server

```
docker compose build
docker compose up
```

#### API list

| API | JWT required | Remark |
|---|---|---|
| GET ```/``` | no | a simple hompage |
| GET ```/getJWT``` | no | a simple way to get a valid JWT |
| POST ```/user/add``` | yes | create a new user |
| GET ```/users``` | yes | get all users |
| GET ```/user/:id``` | yes | retrieve a specified user |
| POST ```/user/change-password/:id``` | yes | change an user's password |
| GET ```/user/delete/:id``` | yes | delete an user |

I have defined the requests for the APIs in the api.rest file; please refer to it for more specific details about parameters and request bodies. Additionally, if you are using VSCode, install the 'Rest Client' extension. This allows you to send requests directly from the api.rest file.

#### Run test
```
docker compose run --rm api npm run test
```
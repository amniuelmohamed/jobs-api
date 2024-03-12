# Jobs API

### Introduction

Jobs API is an open source platform that enable users save and manage the jobs they applied for.

### Jobs API Features

-   Users can signup and login to their accounts
-   Only Authenticated users can access the jobs they applied for as well as create a new job, edit their created job and also delete what they've created.

### Installation Guide

-   Clone this repository [here](https://github.com/amniuelmohamed/jobs-api.git).
-   Run npm install to install all dependencies
-   Ensure that you have Typescript installed globally
-   You can create your own MongoDB and get the connection string to put it in the .env file.
-   Create an .env file in your project root folder and add your variables. See .env.sample for assistance.

### Usage

-   Run npm start:dev to start the application.
-   Connect to the API using Postman on port 5000.

### API Endpoints

| HTTP Verbs | Endpoints             | Action                                                 |
| ---------- | --------------------- | ------------------------------------------------------ |
| POST       | /api/v1/auth/register | To sign up a new user account                          |
| POST       | /api/v1/auth/login    | To login an existing user account                      |
| POST       | /api/v1/jobs          | To create a new job                                    |
| GET        | /api/v1/jobs          | To retrieve all jobs created by the authenticated user |
| GET        | /api/v1/jobs/:jobId   | To retrieve details of a single job                    |
| PATCH      | /api/v1/jobs/:jobId   | To edit the details of a single job                    |
| DELETE     | /api/v1/jobs/:jobId   | To delete a single job                                 |

### Technologies Used

-   [NodeJS](https://nodejs.org/) This is a cross-platform runtime environment built on Chrome's V8 JavaScript engine used in running JavaScript codes on the server. It allows for installation and managing of dependencies and communication with databases.

-   [ExpressJS](https://www.expresjs.org/) This is a NodeJS web application framework.

-   [MongoDB](https://www.mongodb.com/) This is a free open source NOSQL document database with scalability and flexibility. Data are stored in flexible JSON-like documents.

-   [Mongoose ODM](https://mongoosejs.com/) This makes it easy to write MongoDB validation by providing a straight-forward, schema-based solution to model to application data.

# Employee contact manager

This is a full-stack application with .NET Core API, SQL Server and React

## Tech Stack

### Front-End
React 19 VITE typescript project
React router used for navigation
Material UI with DataGrid for components
TanStack query for state management and mutations
React Hook Forms with zod used for validation
Gravatar API integration with md5 for avatars

### Back-End
.NET 9 Core Web API
EntityFrameworkCore db first scaffolding
Swagger docs

### Database
SQL Server database - mademployees
db/table_creation.sql


## Setup Instructions:

Connect to SQL server and execute teh db/table_creation script to create database, schema, and seed data

### Backend API
Load the API in the employee-contact-server\employee-contact-server folder, and run with the following commands:
```bash
dotnet restore
dotnet run
```
API will run on http://localhost:5249
Swagger docs available at http://localhost:5039/swagger/index.html
Secure sockets run on https://localhost:7120/swagger/index.html


### Frontend API
Open the front-end client in the employee-contact-client\client folder

Run the project using the following commands:

```bash
npm install
npm run dev
```

Front-end application will run on http://localhost:5173

## Key Features
Server-side pagination (default 10) dependent on change of front-end page size
Search bar for filters on name, email, job title
CRUD operations for listing, adding, editing, and deleting an employee
Toast notifications




Organization Tree API
This API manages an organization tree structure, allowing users to create and organize nodes representing locations, employees, and departments. 

Tech Stack
Node.js, 
Express, 
MySQL (or any other relational database), 
Sequelize (ORM for database interaction), 
Swagger (for API documentation), 
Docker (for containerization)

Prerequisites : 
Node.js (v14+), 
Docker and Docker Compose, 
Setup and Installation, 
Clone the Repository, 

bash
git clone <repository-url>

Install Dependencies
npm install

Setup Environment Variables

Create a .env file in the root directory of the project. Add the following variables (or customize them as needed)
PORT=3000
DB_URL=mysql://root:root@localhost:3306/org_hierarchy_db
Run the Project Locally

To start the server locally (without Docker), run:
npm run start

Start Docker Container
To run the project in Docker, use the following command:
docker-compose up

API Documentation
The API documentation is available via Swagger. Once the server is running, open your browser and go to:
http://localhost:3000/api-docs

Available Endpoints

POST /api/nodes: Create a new node in the organization tree.

GET /api/nodes/:id: Retrieve a node by its ID.

PUT /api/nodes/:id: Update a node's information.

DELETE /api/nodes/:id: Delete a node from the organization tree.
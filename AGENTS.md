# Project Architecture & Guidelines

## Architecture Overview
This project is a full-stack Todo list application consisting of a frontend, a backend, and an infrastructure layer.

- **Frontend**: A Single Page Application (SPA) built with **Vue.js 3** and **Vite**. It handles the user interface and interacts with the backend API via **Axios**.
- **Backend**: A **Java Spring Boot** application that provides the RESTful API. It uses **Spring Data JPA** for persistence and **Spring HATEOAS** for hypermedia-driven API design.
- **Database**: 
    - **PostgreSQL** is used as the primary relational database.
    - **H2** is used as an in-memory database for testing.
- **Infrastructure**:
    - **Nginx** serves as the reverse proxy and web server.
    - **Docker & Docker Compose** are used to containerize and orchestrate the entire stack (PostgreSQL, Backend, Nginx).

## Technology Stack
- **Frontend**: Vue.js, Vite, Axios, Vue Router.
- **Backend**: Java 25, Spring Boot 4.1.1, Maven, JPA, Hibernate, Lombok.
- **Database**: PostgreSQL, H2.
- **DevOps**: Docker, Docker Compose, Nginx.

## Build and Development
### Prerequisites
- Docker and Docker Compose
- Java Development Kit (JDK) 25
- Node.js and npm/yarn

### Running with Docker Compose
To start the entire stack in a development environment:
```bash
docker-compose up --build
```

### Local Development
1. **Frontend**:
   Navigate to `todo-ui/` and run:
   ```bash
   npm install
   npm run dev
   ```
2. **Backend**:
   Navigate to `todo/` and run:
   ```bash
   mvn clean install
   mvn spring-boot:run
   ```

## Coding Guidelines
To maintain high code quality, please adhere to the following principles:

- **Conciseness**: Write the minimum amount of code necessary to achieve the objective. Avoid "over-engineering" or unnecessary abstractions.
- **Readability**: Write code that is easy for others to understand. Use meaningful variable and function names.
- **Commentary**: 
    - Do not include overly verbose or "obvious" comments (e.g., `// increment i`).
    - Use comments to explain *why* something is done, not *what* is being done, especially for complex logic.
- **Consistency**: Follow the existing patterns and naming conventions found in the current codebase.
- **Testability**: Ensure new features include corresponding unit or integration tests where applicable.


## Maintenance
- Keep this file up to date if major library or architectural changes are made to the project.
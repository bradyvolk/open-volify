![Open Volify Logo](./src/assets/open-volify-logo-large.png)

An open-source platform for volunteer management

## Getting Started

### Prerequisites

Install the following system depedencies if not already installed:

- Bun - https://bun.com/docs/installation
- Docker - https://docs.docker.com/engine/install/

### Installation

1. Clone the repository and navigate to the cloned directory

2. Create an .env file from the .env.example file

```bash
cp .env.example .env
```

3. General a BETTER_AUTH_SECRET with openssl to add to your .env file

```bash
openssl rand -base64 32
```

4. Add other .env variable API keys and secrets if need needed

5. Start a docker container for the database

```bash
docker pull postgres:18
docker run --name open-volify-postgres -e POSTGRES_PASSWORD=password -d -p 5432:5432 postgres
```

6. Install dependencies

```bash
bun install
```

7. Run the frontend development server:

```bash
bun dev:frontend
```

8. In another terminal, run the server development server:

```bash
bun dev:server
```

Check out the frontend at http://localhost:3001 and the server at http://localhost:3006

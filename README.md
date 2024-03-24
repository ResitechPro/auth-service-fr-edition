# auth-service-fr-edition

This microservice provides authentication functionality for ResiTech Pro.

## Installation

To install and run the authentication microservice locally, follow these steps:

### 1. Clone the repository

```zsh
git clone git@github.com:ResitechPro/auth-service-fr-edition.git
```

### 2. Install dependencies

```zsh
cd auth-service-fr-edition
npm install
```

### 3. Set up environment variables

Create `.env` file from `.env.sample` then fill in the environment variables with the appropriate values.

```zsh
cp .env.sample .env
```

### 4. Generate keys

Run the following two commands to generate the private and public keys:

```zsh
openssl genrsa -out keys/private.pem 2048
```

```zsh
openssl rsa -in keys/private.pem -outform PEM -pubout -out keys/public.pem
```

### 5. Start the server

You can start the server running `dev` script from package.json:

```zsh
npm run dev
```

Or using `docker`:

```zsh
docker compose up
```

## Documentation

As you will notice from the logs when you start the server, the documentation is available at ` http://localhost:3001/api/docs`.

## Technologies Used

- Node.js
- Express.js
- MongoDB
- Mongoose
- JSON Web Tokens (JWT)

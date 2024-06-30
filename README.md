# NestJS Backend Internship Test Task

This project is a secure and well-documented RESTful API service using NestJS and TypeScript. It facilitates user registration, standard login, Telegram bot integration for login/actions, and leverages Mongoose for data persistence.

## Setup Instructions

1. Clone the repository
2. Install dependencies: `npm install`
3. Create a `.env` file based on `.env.example` and fill in the required variables
4. Start the MongoDB database (you can use Docker)
5. Run the application: `npm run start:dev`

## Features

- User registration
- Standard login with JWT authentication
- Telegram bot integration for login and actions
- GraphQL API (optional)


## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Testing

Run unit tests: `npm run test`
```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## API Documentation

GraphQL schema information: src\graphql\schema.gql

## Telegram Bot Setup

1. Create a new bot using BotFather on Telegram
2. Copy the bot token to the `TELEGRAM_BOT_TOKEN` environment variable
3. Start the application to activate the bot

## Technologies Used

- NestJS
- TypeScript
- Mongoose
- GraphQL (optional)
- Telegraf (for Telegram bot integration)
- Jest (for testing)



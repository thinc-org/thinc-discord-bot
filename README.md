# Thinc. Discord Bot <!-- omit in toc -->

Discord bot for the Thinc. Discord server.

# Table of Contents <!-- omit in toc -->

- [Available Commands](#available-commands)
  - [Prefix Commands](#prefix-commands)
  - [Slash Commands](#slash-commands)
- [Contributing](#contributing)
  - [Pre-requisites](#pre-requisites)
  - [Development](#development)
  - [Deployment](#deployment)
  - [Docker](#docker)
- [License](#license)

# Available Commands

## Prefix Commands

- `!start` - Initialize the bot in the current Discord's guild.

## Slash Commands

- `/ping` - Check if the bot is alive.
- `/register` - Register a new user to the Discord's guild.

# Contributing

## Pre-requisites

- [Node.js](https://nodejs.org/en/) (v16.6.0 or higher)
- [PNPM](https://pnpm.io/) (v7.12.0 or higher)
- [NestJS Basics][https://docs.nestjs.com/]

## Development

1. Clone the repository

   ```bash
   git clone https://github.com/thinc-org/thinc-discord-bot.git
   ```

2. Install dependencies

   ```bash
   pnpm install
   ```

3. Run PostgreSQL database using Docker Compose

   ```bash
   docker compose up -d
   ```

4. Prepare environment variables

   ```bash
   cp .env.sample .env
   ```

5. Create a new Discord Application to obtain Discord bot token, follow the [Writebots guide](https://www.writebots.com/discord-bot-token/)guide.
6. Invite the bot to your Discord server, follow the [Writebots guide](https://www.writebots.com/discord-bot-token/)
7. Run the bot in development mode

   ```bash
   pnpm start:dev
   ```

## Deployment

Push the code to the `main` branch, the bot will be automatically deployed to Thinc. server.

## Docker

To migrate the database, run the following command:

```bash
docker run -e DATABASE_URL=... --rm thinc-org/thinc-discord-bot pnpm run migrate dev
```

To run the bot in production mode, run the following command:

```bash
docker run --env-file .env thinc-org/thinc-discord-bot
```

> You need to provide the environment variables in `.env` file.

# License

MIT

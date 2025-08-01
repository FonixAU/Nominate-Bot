Blank Bot

Features::
Creates democratic ranking and voting system for discord servers

Also manages LFG Chats to reduce clutter by making threads for messages pinging roles

Contains a /timestamp function for creating universal timestamps

Also has code for handling reaction roles but currently not in use

---

## Running with Docker

This project includes a Docker setup for easy deployment.

- **Node.js version:** 22.13.1 (as specified in the Dockerfile)
- **Exposed port:** 3000 (not typically used for Discord bots, but included for completeness)
- **Environment variables:**
  - The bot requires a `.env` file in the project root. Make sure to provide all necessary Discord bot credentials and configuration in this file.

### Build and Run

1. Ensure you have Docker and Docker Compose installed.
2. Place your `.env` file in the project root (same directory as `Dockerfile`).
3. Build and start the bot:

   ```sh
   docker compose up --build
   ```

   This will build the image and start the bot in a container named `javascript-app`.

- The container will restart automatically unless stopped.
- No additional volumes or external services are required.

If you do not have a `.env` file, create one with the required environment variables for your Discord bot.

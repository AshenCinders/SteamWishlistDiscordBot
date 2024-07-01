# SteamWishlistDiscordBot

A self-growth project written in TypeScript, using the Discord.js library and a bit of MongoDB.
Tests (excluding database functionality and discord.js code) are written using Jest.

The Discord bot features commands to let a user look at a list of games in their or someone else's Steam wishlist.
By default only the titles of games will be displayed, but more information can be shown such as
  tags (categories), review score, release date, and date when user added the game to their wishlist.
Keep in mind that Discord limits messages to 2000 characters, so some games may not be shown in the lists.

The bot is normally run using ts-node (npm run start) and will connect to a local-host MongoDB instance which is automatically created.
It can also be started by running the bot.ts/js file if you compile/transpile another way.
You will need a .env file containing CLIENTID, SERVERID, TOKEN generated when registering the bot through the Discord Developer Portal.
Place the .env file in the project folder.
Before starting up the bot you also need to push the commands to Discord, by running 'npm run push' or running the deploy-commands.ts file.


If you plan on forking and editing the code you may want to add the following Prettier settings:
    Quote Props: preserve
    Single Quote: on
    Tab Width: 4 spaces
If you want to run the tests you may need to add to your TSconfig:
```ts
"compilerOptions": {
            "types": ["jest"]
```

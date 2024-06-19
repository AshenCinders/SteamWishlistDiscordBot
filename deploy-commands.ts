import { REST, Routes } from 'discord.js';
import { config } from 'dotenv';
import * as fs from 'node:fs';

// Adapted from discordjs.guide

config();

const commands: Array<Object> = [];
const commandFiles = fs
    .readdirSync('./src/commands')
    .filter((file) => file.endsWith('.ts'));

for (const file of commandFiles) {
    const command = require(`./src/commands/${file}`);
    // set a new item in the Collection
    // with the key as the command name and the value as the exported module
    if ('data' in command && 'execute' in command) {
        commands.push(command.data.toJSON());
    }
}

// Construct and prepare an instance of the REST module
const rest = new REST().setToken(process.env.TOKEN as string);

// Then deploy commands.
(async () => {
    try {
        console.log(
            `Started refreshing ${commands.length} application (/) commands.`
        );

        /* The put method is used to fully refresh all commands 
        in the guild with the current set */
        await rest.put(
            Routes.applicationGuildCommands(
                process.env.CLIENTID as string,
                process.env.SERVERID as string
            ),
            { body: commands }
        );

        console.log(
            // `Successfully reloaded ${data.length} application (/) commands.`
            'Finished reloading commands.'
        );
    } catch (err) {
        console.error(err);
    }
})();

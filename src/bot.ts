// Bot startup sequence courtesy of The Coding Train.
// https://www.youtube.com/@TheCodingTrain

import { Client, Events, GatewayIntentBits, Interaction } from 'discord.js';
import { config } from 'dotenv';
import * as ping from './commands/ping';
import * as wishlist from './commands/wishlist';

config();

const client = new Client({
    intents: [GatewayIntentBits.Guilds],
});

client.once(Events.ClientReady, () =>
    console.log(client.user!.tag + ' has logged in!')
);

client.login(process.env.TOKEN);

const tempFn = () => {
    console.log('Temp function was called');
};

type recordWithCommands = Record<string, Function>;
const commandRec: recordWithCommands = {
    ping: ping.execute,
    wishlist: wishlist.execute,
};

async function handleInteraction(interaction: Interaction) {
    if (!interaction.isCommand()) return;
    else {
        await commandRec[interaction.commandName as keyof recordWithCommands](
            interaction
        );
        console.log('Command used: ', interaction.commandName);
    }
}

// When user runs command.
client.on(Events.InteractionCreate, handleInteraction);

// Bot startup sequence courtesy of The Coding Train.
// https://www.youtube.com/@TheCodingTrain

import { Client, Events, GatewayIntentBits, Interaction } from 'discord.js';
import { config } from 'dotenv';
import mongoose from 'mongoose';
// User-facing commands.
import * as ping from './commands/ping';
import * as wishlist from './commands/wishlist';
// Utility interactions.
import * as onMyWLButton from './commands/utility/onMyWLButton';
import * as onElseWLButton from './commands/utility/onElseWLButton';

// Connect to localhost mongodb.
const url = 'mongodb://127.0.0.1:27017/wishlistbot';
mongoose
    .connect(url)
    .then(() => {
        console.log('Connected to mongoDB');
    })
    .catch((err: Error) => {
        console.log('MongoDB connection error. ' + err);
        //process.exit();
    });

// Connect to Discord server.
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
const auxButtonRec: recordWithCommands = {
    myWL: onMyWLButton.execute,
    elseWL: onElseWLButton.execute,
};

async function handleInteraction(interaction: Interaction) {
    if (interaction.isButton()) {
        await auxButtonRec[interaction.customId as keyof recordWithCommands](
            interaction
        );
    } else if (interaction.isCommand()) {
        await commandRec[interaction.commandName as keyof recordWithCommands](
            interaction
        );
        console.log(
            `Discord user ${interaction.user.displayName} used the command: ${interaction.commandName}`
        );
    } else return;
}

// When user runs command.
client.on(Events.InteractionCreate, handleInteraction);

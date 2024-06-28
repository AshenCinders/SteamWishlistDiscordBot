// Bot startup sequence courtesy of The Coding Train.
// https://www.youtube.com/@TheCodingTrain

import { Client, Events, GatewayIntentBits, Interaction } from 'discord.js';
import { config } from 'dotenv';
import mongoose from 'mongoose';
// User-facing commands.
import * as ping from './commands/ping';
import * as wishlist from './commands/wishlist';
import * as clearMyData from './commands/clearMyData';
// Utility interactions.
import { onMyWLButton } from './commands/utility/buttonMyWL';
import { onElseWLButton } from './commands/utility/buttonElseWL';
import { onRefetchButton } from './commands/utility/buttonRefetch';

// Connect to localhost mongodb.
const url = 'mongodb://127.0.0.1:27017/wishlistbot';
mongoose
    .connect(url)
    .then(() => {
        console.log('Bot connected to mongoDB');
    })
    .catch((err: Error) => {
        console.log('MongoDB connection error. ' + err);
        process.exit();
    });

// Connect to Discord server.
config();
const client = new Client({
    intents: [GatewayIntentBits.Guilds],
});
client.once(Events.ClientReady, () => {
    console.log(client.user!.tag + ' has logged in to Discord!');
    console.log('Ready to handle commands...\n');
});
client.login(process.env.TOKEN);

type recordWithCommands = Record<string, Function>;
const commandRec: recordWithCommands = {
    ping: ping.execute,
    wishlist: wishlist.execute,
    clearmydata: clearMyData.execute,
};
const auxButtonRec: recordWithCommands = {
    myWL: onMyWLButton,
    elseWL: onElseWLButton,
    refetch: onRefetchButton,
};

async function handleInteraction(interaction: Interaction) {
    const nameOfUser = interaction.user.displayName;
    if (interaction.isButton()) {
        console.log(
            `User ${nameOfUser} pressed a button: ${interaction.customId}`
        );
        const btnFn =
            auxButtonRec[interaction.customId as keyof recordWithCommands];
        if (btnFn !== undefined) btnFn(interaction);
    } else if (interaction.isCommand()) {
        console.log(
            `User ${nameOfUser} used a command: ${interaction.commandName}`
        );
        commandRec[interaction.commandName as keyof recordWithCommands](
            interaction
        );
    } else return;
}

// When user runs command or aux interaction is started.
client.on(Events.InteractionCreate, handleInteraction);

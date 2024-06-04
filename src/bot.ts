// Bot startup sequence courtesy of The Coding Train.
// https://www.youtube.com/@TheCodingTrain

import { Client, Events, GatewayIntentBits } from 'discord.js';
import { config } from 'dotenv';

config();

const client = new Client({
    intents: [GatewayIntentBits.Guilds],
});

client.once(Events.ClientReady, () =>
    console.log(client.user!.tag + ' has logged in!')
);

client.login(process.env.TOKEN);

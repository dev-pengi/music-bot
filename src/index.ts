console.clear();
import dotenv from 'dotenv';
dotenv.config();

//Discord
import { Client, GatewayIntentBits, Partials } from 'discord.js';

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.DirectMessageReactions,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
    ],
    partials: [Partials.Channel, Partials.Message, Partials.User]
});

//Events
import connections from './events/connection';
import handler from './handler';


//Errors handler
process.on("unhandledRejection", err => {
    console.log(err)
})
process.on("uncaughtException", (err, origin) => {
    console.log("Caught exception: " + err)
    console.log("🟥 Origin: " + origin)
})
process.on('uncaughtExceptionMonitor', (err, origin) => {
    console.log(err);
    console.log("🟥 Origin: " + origin)
});

// execute events
connections(client);
handler(client);
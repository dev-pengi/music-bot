console.clear();

//Events
import handler from './handler';
import connections from './events/connection';
import { Client, GatewayIntentBits, Partials } from 'discord.js';


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


import { tokens, MONGO_URI } from './settings.json';
connections(MONGO_URI);

for (const token of tokens) {

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
    // execute events
    handler(client, token);

}

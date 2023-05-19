console.clear();
require('dotenv').config()

//Discord
const { Client, GatewayIntentBits, Partials } = require('discord.js')

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
const connections = require('./events/connection')
const handler = require('./handler')


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
// process.on("multipleResolves", (type, promise, reason) => {
//     if (reason.toLocaleString() === "Error: Cannot perform IP discovery - socket closed") return;
// });
// process.on('multipleResolves', (type, promise, reason) => {
//     console.log(type + promise + reason)
// });

// execute events
connections(client)
handler(client);
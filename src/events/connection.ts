import { Client } from 'discord.js';
import 'colors';

export default async (client: Client) => {
    try {
        await client.login(process.env.TOKEN).catch(console.error);
        console.log(`\nConnected to the client : ${client.user?.username}`.cyan);
    } catch (err: any) {
        console.log(`${err.message}. exiting now...`);
        console.log(err.stack);
        process.exit(1);
    }
}

import { Client } from 'discord.js';
import 'colors';

export default async (client: Client): Promise<void> => {
    client.user?.setPresence({
        status: 'idle',
    })
}
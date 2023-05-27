import mongoose from 'mongoose';
import { Client } from 'discord.js';
import 'colors'

const { MONGO_URI, TOKEN } = process.env;

export default async function connect(client: Client): Promise<void> {
    try {
        await client.login(TOKEN).catch(console.error);
        console.log(`\nConnected to the client: ${client.user?.username}`.cyan);
        mongoose.set('strictQuery', false);
        const conn = await mongoose.connect(MONGO_URI!, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        } as mongoose.ConnectOptions);
        console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline);
    } catch (err: any) {
        console.log(`${err.message}. Exiting now...`);
        console.log(err.stack);
        process.exit(1);
    }
}

import mongoose from 'mongoose';
import 'colors'


export default async function connect(mongo_uri: string): Promise<void> {
    try {
        mongoose.set('strictQuery', false);
        const conn = await mongoose.connect(mongo_uri, {
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

import mongoose, { Document, Schema } from 'mongoose';

// Define the interface for the guild document
export interface IGuild extends Document {
    botId: string;
    prefix: string;
}

// Define the schema for the guild
const GuildSchema = new Schema<IGuild>({
    botId: { type: String, required: true, unique: true },
    prefix: { type: String, default: '$' }
});

// Create and export the guild model
const GuildModel = mongoose.model<IGuild>('Guild', GuildSchema);
export default GuildModel;

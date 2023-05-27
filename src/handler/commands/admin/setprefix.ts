import { Client, Message } from "discord.js";
import { embedReply } from "../../../events/tools";
import Bot from '../../../models/bot';

export default {
    name: "setprefix",
    description: "change the bot's prefix",
    permissions: {
        user: 'Administrator'
    },
    async run(message: Message, args: string[], client: Client): Promise<void> {
        const prefix = args.join('');
        try {
            if (!prefix)
                throw new Error('please provide the new prefix')
            if (prefix.length > 2)
                throw new Error('the prefix can\'t be more than 2 letter')

            await Bot.updateOne(
                {
                    botId: client.user?.id
                },
                {
                    prefix
                },
                {
                    upsert: true
                })
            client.prefix = prefix;

            embedReply({
                message,
                content: `the bot's prefix has changed to: ${client.prefix}`,
            });
        } catch (err: any) {
            embedReply({
                message,
                content: err.message,
                error: true,
            });
        }
    },
};

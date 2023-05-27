import { Client, Message } from "discord.js";
import { embedReply } from "../../../events/tools";

export default {
    name: "setname",
    description: "change the bot's name",
    permissions: {
        user: 'Administrator'
    },
    async run(message: Message, args: string[], client: Client): Promise<void> {
        const name = args.join(' ')
        try {
            if (!name)
                throw new Error('please provide the new name with the command')

            await client.user?.setUsername(name);
            embedReply({
                message,
                content: `the bot's name has changed.`,
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

import { Client, Message } from "discord.js";
import { embedReply } from "../../../events/tools";

export default {
    name: "setname",
    description: "change the bot's name",
    async run(message: Message, args: string[], client: Client): Promise<void> {
        const name = args.join(' ')
        try {
            if (!name)
                throw new Error('يرحى ارسال الاسم مع الامر')

            await client.user?.setUsername(name);
            embedReply({
                message,
                content: `تم تغيير اسم البوت بنجاح`,
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

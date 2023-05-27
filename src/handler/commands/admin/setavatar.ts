import { Client, Message } from "discord.js";
import { embedReply } from "../../../events/tools";
// import isImageUrl from 'is-image-url';

export default {
    name: "setavatar",
    description: "change the bot's avatar",
    async run(message: Message, args: string[], client: Client): Promise<void> {
        try {
            const attachment = message.attachments.first()?.url ?? null;
            if (!attachment)
                throw new Error('please attach the new avatar with the command');

            // if (!await isImageUrl(attachment))
            //     throw new Error('هذه الصورة غير قابلة للاستعمال');

            await client.user?.setAvatar(attachment);
            embedReply({
                message,
                content: `the bot's avatar has changed`,
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

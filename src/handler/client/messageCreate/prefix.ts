import { Client, Message } from "discord.js";
import { embedReply } from "../../../events/tools";

export default async (client: Client, message: Message): Promise<void> => {
    if (message.author.bot) return;
    if (!message.guild) return;

    const prefix = client.prefix;

    console.log(message.content)
    if (message.content != `<@!${client.user?.id}>` && message.content != `<@${client.user?.id}>`) return;

    console.log('exe 2')
    embedReply({
        message,
        content: `Hey. I'm ${client.user?.username} and my prefix is: \`${prefix}\``,
    });
}
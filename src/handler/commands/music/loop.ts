import { Client, Guild, GuildMember, Message, VoiceBasedChannel } from "discord.js";
import { Player } from "discord-player";
import { embedReply } from "../../../events/tools";

export default {
    name: "loop",
    description: "set the repeat mode for the queue",
    async run(message: Message, args: string[], client: Client): Promise<void> {
        try {
            const guild: Guild = message.guild as Guild;
            const member: GuildMember = message.member as GuildMember;

            const channel: VoiceBasedChannel | null | undefined = member.voice.channel;
            if (!channel)
                throw new Error("You need to be in a voice channel to use this command.");

            const player: Player = client.player;

            let queue = player.queues.get(guild.id);
            if (!queue)
                throw new Error('there\'s no queue playing for this server')

            const connection = queue.connection;

            if (!connection)
                await queue.connect(channel);
            else if (channel.id != queue.channel?.id)
                throw new Error(`you have to join the channel i\'m currently playing in: <#${queue.channel?.id}>`)

            const currentTrack = queue.currentTrack;
            if (!currentTrack)
                throw new Error('there\'s no song playing in the server');

            const status = queue.repeatMode != 2 ? true : false
            queue.setRepeatMode(status ? 2 : 0);

            const replyContent = status ? `the repeat mode for the queue has been enabled` : `the repeat mode for the queue has been disabled`;

            embedReply({ message, content: replyContent })

        } catch (err: any) {
            embedReply({
                message,
                content: err.message,
                error: true,
            });
        }
    },
};

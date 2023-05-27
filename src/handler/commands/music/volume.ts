import { Client, Guild, GuildMember, Message, VoiceBasedChannel } from "discord.js";
import { Player } from "discord-player";
import { embedReply } from "../../../events/tools";

export default {
    name: "volume",
    description: "show the current volume",
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
            const volume = queue.node.volume;

            embedReply({ message, content: `the current volume level is: \`${volume}%\`` })

        } catch (err: any) {
            embedReply({
                message,
                content: err.message,
                error: true,
            });
        }
    },
};

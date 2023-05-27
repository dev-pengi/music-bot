import { Client, ButtonInteraction, Guild, VoiceBasedChannel, GuildMember } from "discord.js";
import { interactionEmbedFollow } from "../../../events/tools";
import { Player, Track } from "discord-player";

export default {
    name: 'skip',
    category: 'Public',
    description: 'skip to the next song in the queue',
    run: async (client: Client, interaction: ButtonInteraction): Promise<void> => {
        await interaction.deferUpdate();
        try {
            const guild: Guild = interaction.guild as Guild;
            const member: GuildMember = interaction.member as GuildMember;

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

            const currentTrack: Track | null = queue.currentTrack;

            if (!currentTrack)
                throw new Error('there\'s no song playing for now');

            queue.node.skip();
        } catch (err: any) {
            interactionEmbedFollow({
                interaction,
                content: err.message,
                ephemeral: true,
                bold: true,
                error: true,
            });
        }
    }
};
import { Client, ButtonInteraction, Guild, VoiceBasedChannel, GuildMember } from "discord.js";
import { interactionEmbedEdit } from "../../../events/tools";
import { Player, Track } from "discord-player";

export default {
    name: 'songloop',
    category: 'Public',
    description: 'set the loop mode for the current playing song',
    run: async (client: Client, interaction: ButtonInteraction): Promise<void> => {
        await interaction.deferReply({ ephemeral: true });
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
                throw new Error(`you have to join the channel i\'m currently playing in.: <#${queue.channel?.id}>`)

            const currentTrack: Track | null = queue.currentTrack;
            if (!currentTrack) throw new Error('there\'s no song playing for now');

            const status = queue.repeatMode != 1 ? true : false
            queue.setRepeatMode(status ? 1 : 0);

            const replyContent = status ? `the repeat mode for the current track has been enabled` : `the repeat mode for the current track has been disabled`

            interactionEmbedEdit({ interaction, content: replyContent })
        } catch (err: any) {
            interactionEmbedEdit({
                interaction,
                content: err.message,
                bold: true,
                error: true,
            });
        }
    }
};
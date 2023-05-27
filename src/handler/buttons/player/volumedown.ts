import { Client, ButtonInteraction, Guild, VoiceBasedChannel, GuildMember } from "discord.js";
import { interactionEmbedEdit } from "../../../events/tools";
import { Player, Track } from "discord-player";

export default {
    name: 'volumedown',
    category: 'Public',
    description: 'decrease the current volume level',
    run: async (client: Client, interaction: ButtonInteraction): Promise<void> => {
        await interaction.deferReply();
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

            if (!currentTrack) throw new Error('there\'s no song playing for now');

            const currentVolume: number = queue.node.volume;
            const newVolume: number = clamp((currentVolume - 10), 0, 200);

            queue.node.setVolume(newVolume);

            interactionEmbedEdit({ interaction, content: `\`${interaction.user.tag}\` changed the volume to: \`${Math.floor(newVolume)}%\`` })
        } catch (err: any) {
            interactionEmbedEdit({
                interaction,
                content: err.message,
                error: true,
            });
        }
    }
};
function clamp(value: number, min: number, max: number): number {
    return Math.min(Math.max(value, min), max);
}
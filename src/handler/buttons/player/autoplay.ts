import { Client, ButtonInteraction, Guild, VoiceBasedChannel, GuildMember } from "discord.js";
import { interactionEmbedEdit } from "../../../events/tools";
import { Player } from "discord-player";

export default {
    name: 'autoplay',
    category: 'Public',
    description: 'Play related songs automatically based on the existing queue',
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

            const status = queue.repeatMode != 3 ? true : false
            queue.setRepeatMode(status ? 3 : 0);

            const replyContent = status ? `enabled` : `disabled`

            interactionEmbedEdit({ interaction, content: `\`${interaction.user.tag}\` has ${replyContent} the autoplay` })

        } catch (err: any) {
            interactionEmbedEdit({
                interaction,
                content: err.message,
                error: true,
            });
        }
    }
};
import { GuildQueue, Player, Track, useMetadata } from "discord-player";
import { APIEmbed, ActionRowBuilder, ButtonBuilder, ButtonStyle, Client, Message, TextChannel } from "discord.js";
import { emojis, prefix } from '../config/config.json';

interface Metadata {
    channel: TextChannel;
    controlMessage: Message;
}
function executeEvents(client: Client) {

    const player: Player = client.player

    player.events.on('playerStart', async (queue: GuildQueue, track: Track) => {
        const [getMetadata, setMetadata] = useMetadata<Metadata>(queue.guild.id);
        const embed: APIEmbed = {
            color: 0,
            title: `Now Playing`,
            description: [
                `[${track.title}](${track.url})`,
                `\`-\` requested by \`:\` <@!${track.requestedBy?.id}>`
            ].join('\n'),
            thumbnail: {
                url: `${track.raw.thumbnail}`,
            },
            footer: { text: `Volume: ${queue.node.volume}%・${track.duration}` }
        }

        const backward = new ButtonBuilder()
            .setCustomId('songloop')
            .setEmoji(emojis.replay)
            .setStyle(ButtonStyle.Primary);

        const pause = new ButtonBuilder()
            .setCustomId('autoplay')
            .setEmoji(emojis.play)
            .setStyle(ButtonStyle.Danger);

        const forward = new ButtonBuilder()
            .setCustomId('queueloop')
            .setEmoji(emojis.repeat)
            .setStyle(ButtonStyle.Primary);

        const topRow = new ActionRowBuilder<ButtonBuilder>()
            .addComponents(backward, pause, forward);

        const volumelow = new ButtonBuilder()
            .setCustomId('volumedown')
            .setEmoji(emojis.volumelow)
            .setStyle(ButtonStyle.Primary);

        const next = new ButtonBuilder()
            .setCustomId('skip')
            .setEmoji(emojis.next)
            .setStyle(ButtonStyle.Danger);

        const volumeup = new ButtonBuilder()
            .setCustomId('volumeup')
            .setEmoji(emojis.volumeup)
            .setStyle(ButtonStyle.Primary);

        const bottomRow = new ActionRowBuilder<ButtonBuilder>()
            .addComponents(volumelow, next, volumeup);

        let { channel, controlMessage } = getMetadata();
        controlMessage = await channel.send({ embeds: [embed], components: [topRow, bottomRow] });

        setMetadata({ channel, controlMessage })

    });

    player.events.on('playerSkip', (queue, track) => {
        console.log('skipped')
    });

    player.events.on('playerFinish', async (queue: GuildQueue, track: Track) => {
        console.log('finished')
        const [getMetadata] = useMetadata<Metadata>(queue.guild.id);
        let { controlMessage } = getMetadata();
        if (controlMessage) controlMessage.delete();
    });
    player.events.on('disconnect', async (queue: GuildQueue) => {
        console.log('finished')
        const [getMetadata] = useMetadata<Metadata>(queue.guild.id);
        let { controlMessage } = getMetadata();
        if (controlMessage) controlMessage.delete();
    });

    player.events.on('emptyQueue', async (queue: GuildQueue) => {
        console.log('finished')
        const [getMetadata] = useMetadata<Metadata>(queue.guild.id);
        let { channel, controlMessage } = getMetadata();
        if (controlMessage) controlMessage.delete();

        const embed: APIEmbed = {
            color: 0,
            title: `Queue Ended`,
            description: [
                `Wanna have more fun? you can play songs using \`${prefix}play [song name]\``,
            ].join('\n'),
        }
        const endMessage = await channel.send({ embeds: [embed] })

        setTimeout(() => {
            endMessage.delete();
        }, 90000);
    });
}

export default executeEvents;
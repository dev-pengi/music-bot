import { APIEmbed, ActionRowBuilder, ButtonBuilder, ButtonStyle, Client, Guild, Message, VoiceBasedChannel } from "discord.js";
import { Player, QueryType } from "discord-player";
import { embedReply } from "../../../events/tools";

import { emojis } from '../../../config/config.json';

export default {
  name: "play",
  description: "Play a song",
  async run(message: Message, args: string[], client: Client): Promise<void> {
    try {
      const guild: Guild = message.guild as Guild;
      const channel: VoiceBasedChannel | null | undefined = message.member?.voice.channel;
      if (!channel)
        throw new Error("You need to be in a voice channel to use this command.");

      const player: Player = client.player;
      const search: string = args.join(" ");

      if (!search)
        throw new Error('you have to provide a song name for the song');

      let queue = player.queues.get(guild.id);
      if (!queue) {
        queue = player.nodes.create(guild, {
          metadata: {
            channel,
          },
          leaveOnEmpty: false,
          leaveOnEnd: false,
        });
      }

      const connection = queue.connection;

      if (!connection)
        await queue.connect(channel);
      else if (channel.id != queue.channel?.id)
        throw new Error(`you have to join the channel i\'m currently playing in: <#${queue.channel?.id}>`)

      const song = await player.search(search, {
        requestedBy: message.author,
        searchEngine: QueryType.YOUTUBE_SEARCH,
      }).catch((e) => console.log(e));

      if (!song || !song.tracks.length) {
        throw new Error(`No results found for "${search}".`);
      }
      const track = song.tracks[0]
      queue.addTrack(track);

      const playing: boolean = queue.isPlaying();
      const currentTrack: boolean = queue.currentTrack ? true : false;

      if (!playing) await queue.node.play();

      const embed: APIEmbed = {
        color: 0,
        title: `${currentTrack ? 'Track queued' : 'Now Playing'}`,
        description: `[${track.title}](${track.url})`,
        thumbnail: {
          url: `${track.raw.thumbnail}`,
        },
        footer: { text: `by ${track.author}・${track.duration}` }
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

      message.reply({ embeds: [embed], components: [topRow, bottomRow] });

    } catch (err: any) {
      embedReply({
        message,
        content: err.message,
        error: true,
      });
    }
  },
};

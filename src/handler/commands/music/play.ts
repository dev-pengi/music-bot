import { Client, Guild, Message, TextChannel, VoiceBasedChannel } from "discord.js";
import { Player, QueryType } from "discord-player";
import { embedReply } from "../../../events/tools";

// import { emojis } from '../../../config/config.json';

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

      const queue = player.nodes.create(guild, {
        metadata: {
          channel: message.channel as TextChannel,
        },
        leaveOnEmpty: false,
        leaveOnEnd: false,
      });


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

      message.reply(`Added **${track.title} (\`${track.duration}\`)** ${currentTrack ? 'to the queue' : 'to start playing'}.`)

    } catch (err: any) {
      embedReply({
        message,
        content: err.message,
        error: true,
      });
    }
  },
};

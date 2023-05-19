const { QueryType } = require("discord-player");
const { embedReply } = require("../../../events/tools");
const { emojis } = require("../../../config/config.json");

module.exports = {
  name: "play",
  description: "Play a song",
  async run(message, args, client) {
    try {
      const channel = message.member.voice.channel;
      if (!channel)
        throw new Error("You need to be in a voice channel to use this command.");

      const player = client.player;
      const search = args.join(" ");

      if (!search)
        throw new Error('you have to provide a song name for the song');

      let queue = player.queues.get(message.guild.id);
      if (!queue) {
        queue = player.nodes.create(message.guild, {
          metadata: {
            channel,
          },
          leaveOnEmpty: false,
        });
      }

      const connection = queue.connection

      if (!connection)
        await queue.connect(channel);
      else if (channel.id != queue.channel.id)
        throw new Error(`you have to join the channel i\'m currently playing in.: <#${queue.channel.id}>`)

      const song = await player.search(search, {
        requestedBy: message.author,
        searchEngine: QueryType.YOUTUBE_SEARCH,
      }).catch((e) => console.log(e));

      if (!song || !song.tracks.length) {
        throw new Error(`No results found for "${search}".`);
      }
      const track = song.tracks[0]
      await queue.addTrack(track);
      if (!queue.isPlaying()) await queue.node.play();

      const embed = {
        color: '0',
        title: 'Now Playing',
        description: `[${track.title}](${track.url})`,
        thumbnail: {
          url: `${track.raw.thumbnail.url}`,
        },
        footer: { text: `by ${track.author}・${track.duration}` }
      }

      message.reply({ embeds: [embed] });

    } catch (err) {
      embedReply({
        message,
        content: err.message,
        bold: true,
        error: true,
        emoji: emojis.false,
      });
    }
  },
};

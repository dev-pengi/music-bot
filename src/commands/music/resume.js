const { QueryType } = require("discord-player");
const { embedReply } = require("../../../events/tools");
const { emojis } = require("../../../config/config.json");

module.exports = {
    name: "resume",
    description: "resume a song",
    async run(message, args, client) {
        console.log('stop');
        try {
            const channel = message.member.voice.channel;
            if (!channel)
                throw new Error("You need to be in a voice channel to use this command.");

            const player = client.player;

            let queue = player.queues.get(message.guild.id);
            if (!queue)
                throw new Error('there\'s no queue playing for this server')

            const connection = queue.connection;

            if (!connection)
                await queue.connect(channel);
            else if (channel.id != queue.channel.id)
                throw new Error(`you have to join the channel i\'m currently playing in.: <#${queue.channel.id}>`)

            if (queue.node.isPaused())
                await queue.node.resume();
            else
                throw new Error('The Track is not paused');

            const track = queue.currentTrack;

            const embed = {
                color: '0',
                title: 'Now Resuming',
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

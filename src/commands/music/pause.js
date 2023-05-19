const { QueryType } = require("discord-player");
const { embedReply } = require("../../../events/tools");
const { emojis } = require("../../../config/config.json");

module.exports = {
    name: "pause",
    description: "pause a song",
    async run(message, args, client) {
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
                throw new Error('there\'s no song playing')
            else if (channel.id != queue.channel.id)
                throw new Error(`you have to join the channel i\'m currently playing in.: <#${queue.channel.id}>`)

            if (queue.node.isPaused())
                throw new Error('The Track is already paused');
            else
                await queue.node.pause();

            const embed = {
                color: '0',
                description: `**Track paused**`,
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

// const { QueryType } = require("discord-player");
// const { embedReply } = require("../../../events/tools");
// const { emojis } = require("../../../config/config.json");

// module.exports = {
//     name: "skip",
//     description: "skip a song",
//     async run(message, args, client) {
//         try {
//             const channel = message.member.voice.channel;
//             if (!channel)
//                 throw new Error("You need to be in a voice channel to use this command.");

//             const player = client.player;
//             const search = args.join(" ");

//             if (!search)
//                 throw new Error('you have to provide a song name for the song');

//             let queue = player.queues.get(message.guild.id);
//             if (!queue) {
//                 queue = player.nodes.create(message.guild, {
//                     metadata: {
//                         channel,
//                     },
//                 });
//             }

//             const connection = queue.connection

//             if (!connection)
//                 await queue.connect(channel);

//             const song = await player.search(search, {
//                 requestedBy: message.author,
//                 searchEngine: QueryType.YOUTUBE_SEARCH,
//             }).catch((e) => console.log(e));

//             if (!song || !song.tracks.length) {
//                 throw new Error(`No results found for "${search}".`);
//             }
//             await queue.addTrack(song.tracks[0]);
//             if (!queue.isPlaying()) await queue.node.play();

//             embedReply({
//                 message,
//                 content: `**${song.tracks[0]}** has been added to the queue`,
//                 emoji: emojis.true,
//             });


//         } catch (err) {
//             embedReply({
//                 message,
//                 content: err.message,
//                 bold: true,
//                 error: true,
//                 emoji: emojis.false,
//             });
//         }
//     },
// };

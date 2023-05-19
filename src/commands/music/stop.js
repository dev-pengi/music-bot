const { QueryType } = require("discord-player");
const { embedReply } = require("../../../events/tools");
const { emojis } = require("../../../config/config.json");

module.exports = {
    name: "pause",
    description: "pause a song",
    async run(message, args, client) {
        try {
            throw new Error("تحت الصيانة, تم نقل الامر لـ \`${v2pause}\`.");
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

import { Client, GuildMember, Message } from 'discord.js';
import { emojis } from '../../../config/config.json';
import { embedReply } from '../../../events/tools';

export default async (client: Client, message: Message): Promise<void> => {
    if (message.author.bot) return;
    if (!message.guild) return;

    const prefix = client.prefix;

    const [commandName, ...args] = message.content.slice(0).trim().split(/ +/);

    const command = client.commands.find(cmd => (
        (prefix + cmd.name.toLowerCase() === commandName.toLowerCase()) || (cmd.aliases && cmd.aliases.includes(commandName.toLowerCase()))
    ));

    if (!command) return;

    const { id } = message.author;
    const { permissions, roles, specifics } = command;

    if (specifics) {
        if (specifics.includes(id))
            return runCommand();
        else
            return;
    }

    if (roles) {
        const hasRoleOrAdmin = message.guild.members.cache.get(id)?.roles.cache.some(role => roles.includes(role.id)) ||
            message.guild.members.cache.get(id)?.permissions.has('Administrator');
        if (!hasRoleOrAdmin) return;
    }
    if (permissions) {
        const member: GuildMember | null = message.member;
        if (permissions.user && !member?.permissions.has(permissions.user)) return;

    }
    if (!message.guild.members.me?.permissions.has('Administrator')) {
        embedReply({
            message,
            content: `احتاج الى صلاحية \`ADMINISTRATOR\` من اجل تنفيذ هذا الامر`,
            bold: true,
            emoji: emojis.false,
            error: true
        });
        return;
    }
    runCommand();


    function runCommand() {
        return command.run(message, args, client);
    }
}


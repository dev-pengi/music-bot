import {
    ButtonInteraction,
    SelectMenuInteraction,
    MessageComponentInteraction,
    ModalSubmitInteraction,
    CommandInteraction,
    Message,
    TextBasedChannel,
    GuildMember,
} from 'discord.js';

import config from '../config/config.json';

const hexToInt = (hex: string): number => parseInt(hex, 16)
const getColor = (error: boolean = false): number => {
    const color: number = error ? hexToInt(config.errorColor) : hexToInt(config.embedColor);
    return color;
}


type InteractionTypes = CommandInteraction | ButtonInteraction | SelectMenuInteraction | MessageComponentInteraction | ModalSubmitInteraction

interface InteractionEmbedOptions {
    interaction: InteractionTypes;
    content: string;
    ephemeral?: boolean;
    error?: boolean;
    bold?: boolean;
    emoji?: string;
}

interface InteractionEmbedEditOptions {
    interaction: InteractionTypes;
    content: string;
    error?: boolean;
    bold?: boolean;
    emoji?: string;
}

interface EmbedOptions {
    channel: TextBasedChannel;
    content: string;
    error?: boolean;
    bold?: boolean;
    emoji?: string;
}
interface embedMemberOptions {
    member: GuildMember;
    content: string;
    error?: boolean;
    bold?: boolean;
    emoji?: string;
}

interface EmbedReplyOptions {
    message: Message;
    content: string;
    error?: boolean;
    bold?: boolean;
    emoji?: string;
}

interface EmbedEditOptions {
    message: Message;
    content: string;
    error?: boolean;
    bold?: boolean;
    emoji?: string;
}

function interactionEmbed({ interaction, content, ephemeral, error, bold, emoji }: InteractionEmbedOptions): Promise<any> {
    if (!interaction) throw new Error('Invalid interaction');
    if (!content.trim().length) throw new Error('Message cannot be empty');
    if (emoji) content = `${emoji} | ${content}`;
    if (bold) content = `**${content}**`;


    const color: number = getColor(error);

    const embed: any = {
        description: content,
        color
    };

    try {
        return interaction.reply({ embeds: [embed], ephemeral: ephemeral });
    } catch (err: any) {
        throw new Error(err.message);
    }
}

function interactionEmbedEdit({ interaction, content, error, bold, emoji }: InteractionEmbedEditOptions): Promise<any> {
    if (!interaction) throw new Error('Invalid interaction');
    if (!content.trim().length) throw new Error('Message cannot be empty');
    if (emoji) content = `${emoji} | ${content}`;
    if (bold) content = `**${content}**`;



    const color: number = getColor(error);

    const embed: any = {
        description: content,
        color
    };

    try {
        return interaction.editReply({ embeds: [embed] });
    } catch (err: any) {
        throw new Error(err);
    }
}

async function embed({ channel, content = '', error, bold, emoji }: EmbedOptions): Promise<Message> {
    if (!channel) throw new Error('Invalid channel');
    if (!content.trim().length) throw new Error('Message cannot be empty');
    if (emoji) content = `${emoji} | ${content}`;
    if (bold) content = `**${content}**`;


    const color: number = getColor(error);

    const embed: any = {
        description: content,
        color
    };
    try {
        return channel.send({ embeds: [embed] });
    } catch (err: any) {
        throw new Error(err.message);
    }
}
async function embedMember({ member, content = '', error, bold, emoji }: embedMemberOptions): Promise<Message> {
    if (!member) throw new Error('Invalid member');
    if (!content.trim().length) throw new Error('Message cannot be empty');
    if (emoji) content = `${emoji} | ${content}`;
    if (bold) content = `**${content}**`;


    const color: number = getColor(error);

    const embed: any = {
        description: content,
        color
    };
    try {
        return member.send({ embeds: [embed] });
    } catch (err: any) {
        throw new Error(err.message);
    }
}

async function embedReply({ message, content, error, bold, emoji }: EmbedReplyOptions): Promise<Message> {
    if (!message) throw new Error('Invalid message');
    if (!content.trim().length) throw new Error('Message cannot be empty');
    if (emoji) content = `${emoji} | ${content}`;
    if (bold) content = `**${content}**`;



    const color: number = getColor(error);

    const embed: any = {
        description: content,
        color
    };
    try {
        return message.reply({ embeds: [embed] });
    } catch (err: any) {
        throw new Error(err.message);
    }
}

async function embedEdit({ message, content, error, bold, emoji }: EmbedEditOptions): Promise<Message> {
    if (!message) throw new Error('Invalid message');
    if (!content.trim().length) throw new Error('Message cannot be empty');
    if (emoji) content = `${emoji} | ${content}`;
    if (bold) content = `**${content}**`;


    const color: number = getColor(error);

    const embed: any = {
        description: content,
        color
    };

    try {
        return message.edit({ embeds: [embed] });
    } catch (err: any) {
        throw new Error(err.message);
    }
}

function wait(milliseconds: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
}

export {
    InteractionEmbedOptions,
    InteractionEmbedEditOptions,
    EmbedOptions,
    embedMember,
    EmbedReplyOptions,
    EmbedEditOptions,
    interactionEmbed,
    interactionEmbedEdit,
    embed,
    embedMemberOptions,
    embedReply,
    embedEdit,
    wait,
};

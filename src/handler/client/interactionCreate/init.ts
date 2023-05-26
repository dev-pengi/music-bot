import { Client, Interaction } from 'discord.js';

async function handleInteraction(client: Client, interaction: Interaction): Promise<void> {
    if (interaction.isButton()) {
        const cmd = client.buttons?.get(interaction.customId) ?? null;
        cmd && cmd.run(client, interaction);
    }
}

export default handleInteraction;
const { Events } = require("discord.js");

module.exports = {
    name: Events.InteractionCreate,
    once: false,
    async execute(interaction) {
        if (!interaction.isChatInputCommand()) return;

        const command = interaction.client.commands.get(interaction.commandName);
        if (!command) { console.error(`[WARNING] No command with name ${interaction.commandName} found!`)}

        try {
            await command.execute(interaction);
        } catch(error) {
            if (interaction.replied || interaction.deffered) {
                await interaction.followUp({ content: "error execute", ephemeral: true });
            } else {
                console.error(error)
                await interaction.reply({ content: "error 2", ephemeral: true });
            }
        };
    }
}
const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { bot } = require("../../config");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("help")
        .setDescription("Shows a list of the commands."),
    async execute(interaction) {
        let commandList = interaction.client.commands.sort(function(a, b) {
            let textA = a.data.name.toUpperCase();
            let textB = b.data.name.toUpperCase();

            return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
        });

        let helpEmbed = new EmbedBuilder()
        .setAuthor({ name: `${bot.name} | Help`, iconURL: bot.picture })
        .setTitle(`Showing commands:`)
        .setColor(bot.mainColor)
        .setFooter({ text: `Success | ${bot.fullName}`, iconURL: bot.successImage })
        .setTimestamp()

        commandList.forEach(c => {
            helpEmbed.addFields({ name: `;${c.data.name.toUpperCase()}`, value: `${c.data.description}` })
        });

        await interaction.reply({ embeds: [helpEmbed ]});
    }
}
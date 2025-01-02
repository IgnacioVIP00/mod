const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const noblox = require("noblox.js");
const { QuickDB } = require("quick.db");
const db = new QuickDB();
const { bot } = require("../../config");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("verify")
        .setDescription("Links your Roblox account with your Discord."),
    async execute(interaction) {
        let firstEmbed = new EmbedBuilder()
        .setAuthor({ name: `${bot.name} | Verify`, iconURL: bot.picture })
        .addFields({ name: `Success!`, value: `I'm glad to see you verifying! Could you tell me your Roblox **username**?\n\nNote that we use RoVer, so if you still aren't verified with it then verify [**here**](https://verify.eryn.io/)` })
        .setColor(bot.mainColor)
        .setFooter({ text: `Success | ${bot.fullName}`, iconURL: bot.successImage })
        .setTimestamp()
        
        let alrEmbed = new EmbedBuilder()
        .setAuthor({ name: `${bot.name} | Verify`, iconURL: bot.picture })
        .addFields({ name: `Error!`, value: `You are already verified!` })
        .setColor("#ff0033")
        .setFooter({ text: `Error | ${bot.fullName}`, iconURL: bot.failImage })
        .setTimestamp()

        if (await db.get(`vdiscord_${interaction.user.id}`) !== null) return interaction.reply({ embeds: [alrEmbed] });

        let a = await interaction.reply({ embeds: [firstEmbed] });

        let filter = m => interaction.user.id === interaction.user.id
        let collector = await interaction.channel.createMessageCollector({ filter, time: 30000 });

        collector.on("collect", async c => {
            collector.stop();
            let id = await noblox.getIdFromUsername(c.content).catch((e) => {});

            let errorEmbed = new EmbedBuilder()
            .setAuthor({ name: `${bot.name} | Verify`, iconURL: bot.picture })
            .addFields({ name: `Error!`, value: `That user doesn't exist!` })
            .setColor("#ff0033")
            .setFooter({ text: `Error | ${bot.fullName}`, iconURL: bot.failImage })
            .setTimestamp()

            if (!id) return interaction.channel.send({ embeds: [errorEmbed] });

            let nVerifyEmbed = new EmbedBuilder()
            .setAuthor({ name: `${bot.name} | Verify`, iconURL: bot.picture })
            .addFields({ name: `Error!`, value: `Looks like you aren't verified with RoVer! Verify [**here**](https://verify.eryn.io/)!` })
            .setColor("#ff0033")
            .setFooter({ text: `Error | ${bot.fullName}`, iconURL: bot.failImage })
            .setTimestamp()

            let successEmbed = new EmbedBuilder()
            .setAuthor({ name: `${bot.name} | Verify`, iconURL: bot.picture })
            .addFields({ name: `Success!`, value: `You have been verified as **${await noblox.getUsernameFromId(id)}**!` })
            .setColor("#17d47f")
            .setFooter({ text: `Success | ${bot.fullName}`, iconURL: bot.successImage })
            .setTimestamp()

            const fetch = (...args) => import("node-fetch").then(({ default: fetch}) => fetch(...args));
            let response = await fetch(`https://registry.rover.link/api/guilds/707117657538953336/discord-to-roblox/${interaction.user.id}`, {
                headers: new Headers({
                    "Authorization": `Bearer ${process.env.ROVERAPIKEY}`
                }),
            });
            let data = await response.json();

            if (data.robloxId === id) {
                db.set(`vid_${id}`, interaction.user.id);
                db.set(`vdiscord_${interaction.user.id}`, id);

                let mem = await interaction.client.guilds.cache.find(g => g.id === "707117657538953336").members.fetch(interaction.user.id);
                if (mem.manageable) {
                    mem.roles.add("846810305924694078");
                    mem.setNickname(await noblox.getUsernameFromId(id));
                };

                return interaction.channel.send({ embeds: [successEmbed] });
            } else return await interaction.channel.send({ embeds: [nVerifyEmbed] });
        });

        collector.on("end", async c => {
            if (c.size === 0) {
                let noEmbed = new EmbedBuilder()
                .setAuthor({ name: `${bot.name} | Verify`, iconURL: bot.picture })
                .addFields({ name: `Error!`, value: `You didn't answer in time` })
                .setColor("#ff0033")
                .setFooter({ text: `Error | ${bot.fullName}`, iconURL: bot.failImage })
                .setTimestamp()

                return await interaction.channel.send({ embeds: [noEmbed] });
            }
        });
    }
}
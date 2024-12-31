const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const noblox = require("noblox.js");
const { QuickDB } = require("quick.db");
const { bot } = require("../../config");
const db = new QuickDB();

module.exports = {
    data: new SlashCommandBuilder()
        .setName("check")
        .setDescription("Sends the information of a user.")
        .addStringOption(opt =>
            opt
                .setName("user")
                .setDescription("The user whose information is to be sent.")
                .setRequired(false)
        ),
    async execute(interaction) {
        let user = interaction.options.getString("user");
        let id;

        if (!user) {
            id = await db.get(`vdiscord_${interaction.author.id}`)
        } else
            id = await noblox.getIdFromUsername(user);

        let uData = await db.get(`${id}`);

        if (id === 1) uData = 0;
        if (uData === null) uData = 0;

        function getDate(seconds) {
            let t = new Date(1970, 0, 1)
            return t.setSeconds(seconds)
        }

        async function getBan(id) {
            let ban = await db.get(`ban_${id}`);
            if (ban) {
                console.log(ban.mod)
                if (getDate(ban.time) > new Date()) {
                    if (ban.mod === "SYSTEM") return `${ban.reason} (${ban.date} by SYSTEM)`
                    return `${ban.reason} (${ban.date} by <@${db.get(`vid_${ban.mod}`)}>)`
                } else {
                    await db.delete(`ban_${id}`);
                    return "-"
                }
            } else return "-"
        }

        let abcd;

        let jjjj = require("../../groups");
        let aosGroups = jjjj.AoS;
        let kosGroups = jjjj.KoS;

        for (groupK in kosGroups) {
            let group = kosGroups[groupK];

            let rank = await noblox.getRankInGroup(group.id, id);
            if (rank > 0) {
                abcd = `**KOS** - Group membership - ${group.name} (${group.id}) (NEVER BY SYSTEM)`
            }
        };

        for (groupK in aosGroups) {
            let group = aosGroups[groupK];

            let rank = await noblox.getRankInGroup(group.id, id);
            if (rank > 0) {
                abcd = `**AOS** - Group membership - ${group.name} (${group.id}) (NEVER BY SYSTEM)`
            }
        };

        async function getStatus(id) {
            let status = await db.get(`status_${id}`);
            if (status || abcd) {
                if (status) {
                    if (getDate(status.time) > new Date()) {
                        return `**${status.status}** - ${status.reason} (${status.date} by <@${db.get(`vid_${status.mod}`)}>)`
                    } else {
                        await db.delete(`status_${id}`)
                        return "-"
                    }
                } else return abcd
            } else return "-"
        }

        let checkEmbed = new EmbedBuilder()
        .setAuthor({ name: `${bot.name} | Check`, iconURL: bot.picture })
        .setTitle(`Showing user's information.`)
        .addFields(
          { name: 'Player', value: `${await noblox.getUsernameFromId(id)} (${id})` },
          { name: '\u200B', value: `**Moderation**` },
          { name: 'Ban', value: `${await getBan(id)}` },
          { name: 'Status', value: `${await getStatus(id)}` },
          { name: '\u200B', value: `**Contribution**` },
          { name: 'Donated', value: `${await uData}`, inline: true },
        )
        .setColor(bot.mainColor)
        .setFooter({ text: `Success | ${bot.fullName}`, iconURL: bot.successImage })
        .setTimestamp()
        .setThumbnail(`https://www.roblox.com/headshot-thumbnail/image?userId=${id}&width=420&height=420&format=png`)

        let nums = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        for (numK in nums) {
            let num = nums[numK];

            if (db.get(`${num}`).username === await noblox.getUsernameFromId(id)) {
                checkEmbed.addField(`Top`, `${num}`, true)
            }
        };

        checkEmbed.addFields({ name: '\u200B', value: `**Groups**` })

        let groups = [
            ["Shirts IgnacioVIP00", 3411992]
        ]

        for (groupK in groups) {
          let group = groups[groupK];

          let rank = await noblox.getRankInGroup(group[1], id);
          if (rank > 0) {
            let rankName = await noblox.getRankNameInGroup(group[1], id); 
            checkEmbed.addFields({ name: `${group[0]} (${group[1]})`, value: `${rankName} (${rank})`, inline: true })
          }
        };

        interaction.reply({ embeds: [checkEmbed ]});
    }
}
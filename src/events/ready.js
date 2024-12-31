const { Events, ActivityType } = require("discord.js");
const { QuickDB } = require("quick.db");
const db = new QuickDB();

module.exports = {
    name: Events.ClientReady,
    once: true,
    async execute(client) {
        client.user.setStatus("dnd");
        client.user.setActivity("hey!", { type: ActivityType.Playing });

        await db.set("robloxToken", "");

        let robloxToken = await db.get("robloxToken");
        const noblox = require("noblox.js");

        await noblox.setCookie(robloxToken).then(async function() {
            const cUser = await noblox.getCurrentUser().then(u => u.UserName);
            console.log(cUser);
        }).catch(function(e) {
            console.log(e);
        });

        console.log(`Logged in as ${client.user.tag}!`);
    }
}
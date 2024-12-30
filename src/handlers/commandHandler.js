import fs from "node:fs"
/*const fs = require('node:fs');
const path = require('node:path');*/
import path from "node:path"
const { Collection, REST, Routes } = require("discord.js");
const { token, botID, serverID } = require("../config.js");

module.exports = {
    name: "commandHandler",
    async execute(client) {
        client.commands = new Collection();
        const commands = [];
        const commandsToLog = [];

        const folderPath = path.join(__dirname, "../commands");
        const commandFolders = fs.readdirSync(folderPath);

        for (const folder of commandFolders) {
            const commandPath = path.join(folderPath, folder);
            const commandFiles = fs.readdirSync(commandPath).filter(file => file.endsWith(".js"));

            for (const file of commandFiles) {
                const filePath = path.join(commandPath, file);
                const command = require(filePath);

                if (command.data && command.execute) {
                    commands.push(command.data.toJSON());
                    commandsToLog.push({ name: command.data.name, type: folder });
                    client.commands.set(command.data.name, command);
                } else {
                    console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
                }
            }
        };

        const rest = new REST().setToken(token);

        (async () => {
          try {
            console.log(`Started refreshing ${commands.length} commands.`);

            await rest.put(
              //Routes.applicationGuildCommands(botID, serverID),
                    Routes.applicationCommands(botID),
              { body: commands },
            );

                console.table(commandsToLog);
          } catch (error) {
            console.error(error);
          }
        })();
    }
}
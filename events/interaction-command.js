const { Client, CommandInteraction, MessageEmbed, Collection } = require("discord.js")
const cooldowns = new Map();
const client = require('../client/discordBot')

module.exports = { name: "interaction-command",};
/**
* @param {CommandInteraction} interaction
*/
client.on("interactionCreate", async (interaction) => {
    // Slash Command Handling (type:CHAT_INPUT)
    if (interaction.isCommand()) {
        //Starts the command with a reply opened for 15mins to edit or followUp with the message botname is thinking...
        //Ruins the ephemeral system
        //await interaction.deferReply({ephemeral: false}).catch(() => {});

        const cmd = client.interactionCommands.get(interaction.commandName);

        ///If there is no command it will delete the command
        if (!cmd) return interaction.reply({
            embeds: [
                new MessageEmbed()
                    .setColor("BLUE")
                    .setDescription("‼️ - An error occurred while running the command")
            ], 
            ephemeral: true

        }) && client.interactionCommands.delete(interaction.commandName)

        ///CHECKING COOLDOWN
        if (!cooldowns.has(cmd.name)) 
        cooldowns.set(cmd.name, new Collection());

        const currentTime = Date.now()
        const timeStamps = cooldowns.get(cmd.name)
        const cooldownAmount = (cmd.cooldown) * 1000

        if (timeStamps.has(interaction.user.id)) {
            const expTime = timeStamps.get(interaction.user.id) + cooldownAmount
            if (currentTime < expTime) {
                const timeLeft = (expTime - currentTime) / 1000
                return interaction.reply({ embeds: [
                    new MessageEmbed()
                        .setColor("RED")
                        .setDescription(`❌ - Please wait \`${timeLeft.toFixed(1)}\` more seconds before using \`${command.name}\`!`)
                ], ephemeral: true })
            }
        }

        timeStamps.set(interaction.user.id, currentTime)

        setTimeout(() => {
            timeStamps.delete(interaction.user.id)
        }, cooldownAmount);

        ///MANAGING OPTIONS FROM THE COMMAND ???
        const args = [];
        for (let option of interaction.options.data) {
            if (option.type === "SUB_COMMAND") {
                if (option.name) 
                    args.push(option.name);
                option.options?.forEach((x) => {
                    if (x.value) args.push(x.value);
                });
            } else if (option.value) 
                args.push(option.value);
        }

        ///CHECKING GLOBAL(APPLICATION) COMMANDS PERMISSIONS
        if(!interaction.member.permissions.has(cmd.userPermissions || []))
            return interaction.reply({ content: "You do not have permissions to use this command!", });

        //STABLISHING PROPERTY MEMBER BECAUSE DISCORD ONLY ADDED PROPERTY USER (THIS IS JUST CANDY SYNTAX)
        interaction.member = interaction.guild.members.cache.get(interaction.user.id);

        //EXECUTING THE COMMAND FROM THE PROPERTY RUN        
        cmd.run(client, interaction, args);
    }

    // Context Menu Handling (type:MESSAGE,USER)
    if (interaction.isContextMenu()) {
        //Starts the command with a reply opened for 15mins to edit or followUp with the message botname is thinking...
        //Ruins the ephemeral system
        //await interaction.deferReply({ ephemeral: false });
        const command = client.interactionCommands.get(interaction.commandName);

        //EXECUTING THE COMMAND FROM THE PROPERTY RUN
        if (command) command.run(client, interaction);
    }
});    


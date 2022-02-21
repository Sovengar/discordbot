const { Client, Message, MessageEmbed, Collection } = require("discord.js");
const client = require('../client/discordBot')
const GuildSettings = require('../models/GuildSettings');
const cooldowns = new Map();

module.exports = {name: "message-command",}

/**
* @param {Message} message
* @param {Client} client
*/
client.on("messageCreate", async (message) => {
    if (message.author.bot || !message.guild ) return; 

    //GETTING GUILD SETTINGS
    const guildSettings = await GuildSettings.findOne({ guild_id: message.member.guild.id })

    ///GETTING THE PREFIX FROM THE DB AND SETTING IT TO THE CLIENT
    let prefix = guildSettings?.prefix ? guildSettings.prefix : process.env.PREFIX

    ///GETTING DATA FROM THE COMMAND
    const [cmd, ...args] = 
        message.content.toLowerCase().startsWith(prefix)
        ? message.content.slice(prefix.length).trim().split(/ +/g)
        : message.content.trim().split()

    ///GETTING THE COMMAND FROM THE DATA ABOVE
    const command = 
        message.content.toLowerCase().startsWith(prefix)
        ? client.messageCommands.get(cmd.toLowerCase()) || client.messageCommands.find(commands => commands.aliases?.includes(cmd.toLowerCase()))
        : client.noPrefixCommands.get(cmd.toLowerCase())
    /** You can't get the noPrefixCommand with .includes(), because if you have i.e command 'calla' and 'callau' 
    * it will return 2 results resulting in getting no command. So we have to type the name of the command with no previous letters.
    */

    ///CHECK COMMAND EXISTS
    if (!command) return;

    ///CHECKING IF IS A DISABLED COMMAND TO KNOW IF CAN BE EXECUTED FROM THE PROPERTY RUN
    if (guildSettings?.allowAntiBL_messageCommands) {
        if (guildSettings.blacklist_messageCommands.includes(command.name)) 
            return message.reply("This command is disabled!");
    } 

    ///CHECKING IF IS A BLACKLISTED USER
    if (guildSettings?.allowAntiBL_members) {
        if (guildSettings.blacklist_members.includes(message.author.id)){
            return message.reply("You are a blacklisted member");
        }     
    }

    ///CHECK COOLDOWN
    if (!cooldowns.has(command.name)) 
        cooldowns.set(command.name, new Collection());

    const currentTime = Date.now()
    const timeStamps = cooldowns.get(command.name)
    const cooldownAmount = (command.cooldown) * 1000

    if (timeStamps.has(message.author.id)) {
        const expTime = timeStamps.get(message.author.id) + cooldownAmount
        if (currentTime < expTime) {
            const timeLeft = (expTime - currentTime) / 1000
            const tmotEmbed = new MessageEmbed()
                .setColor("RED")
                .setDescription(`❌ - Please wait \`${timeLeft.toFixed(1)}\` more seconds before using \`${command.name}\`!`)
            return message.reply({ embeds: [tmotEmbed] })
        }
    }

    timeStamps.set(message.author.id, currentTime)

    setTimeout(() => {
        timeStamps.delete(message.author.id)
    }, cooldownAmount);

    ///CHECKING PERMISSIONS
    if (!message.guild.me.permissions.has(["SEND_MESSAGES", "EMBED_LINKS"])) //If the bot has no permissions
        return message.member.send({ embeds: [
            new MessageEmbed()
                .setColor('#3d35cc')
                .setDescription("❌ - I need atleast `SEND MESSAGES`, `EMBED LINKS` permissions to execute any command in this server!")
        ] }).catch(err => console.log(err))

    if (!message.member.permissions.has(command.userPermissions || [])) //If the user doesnt have the right permissions
        return message.reply({ embeds: [
            new MessageEmbed()
                .setColor('#3d35cc')
                .setDescription(`❌ - You need \`${command.userPermissions || []}\` permission(s) to execute this command!`)
        ] })

    if (!message.guild.me.permissions.has(command.botPermissions || [])) //If the bot doesnt have the right permissions
        return message.reply({ embeds: [
            new MessageEmbed()
                .setColor('#3d35cc')
                .setDescription(`❌ - I need \`${command.botPermissions || []}\` permission(s) to execute this command!`)
        ] })

    await command.run(client, message, args);
});
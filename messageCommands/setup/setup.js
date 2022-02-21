const { Message, Client, MessageEmbed,} = require("discord.js");
const { Permissions } = require("discord.js");
const GuildSettings = require("../../models/GuildSettings");
const client = require('../../client/discordBot')
const { antijoin } = require('../../collections/index')

module.exports = {
	name : 'setup',
    aliases : ['setup'],
    description: "Shows the current config of the server",
    cooldown: 5,
    usage: "",
    userPermissions: ["MANAGE_GUILD",],
    botPermissions: [,],
    /**
     *
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
    */
    run: async (client, message, args) => {
        let guildSettings = await GuildSettings.findOne({ guild_id: message.guild.id })
		
        if(!guildSettings){
            guildSettings = new GuildSettings({
                guild_id: message.guild.id,
                prefix: process.env.PREFIX,
            })
            await guildSettings.save()
        }

        //.addField("AI Chatbot", `${chatbotfeatureStatus}`, true)
        let setupEmbed = new MessageEmbed()
            .setColor("RED")
            .setTitle(`${message.guild.name} Server's Configuration`)
            .setThumbnail(message.guild.iconURL({ dynamic: true }))
            .setDescription("Here we have the configuration of the server, disabled means you cant use that feature, so if you want to use it you have to enable it first")
            
            .addField("🤖 Prefix", `\`${guildSettings.prefix}\``, false)
            
            .addField('\u200B', "__Features__")
            .addField("👨‍👩‍👧 Welcome feature", `\`${guildSettings.allowWelcome ? '🟢 (ON)' : '🔴 (OFF)'}\``, true)
            .addField("👋 Leave feature", `\`${guildSettings.allowLeave ? '🟢 (ON)' : '🔴 (OFF)'}\``, true)
            .addField("🧛‍♂️ Auto Role", `\`${guildSettings.allowAutoRole ? '🟢 (ON)' : '🔴 (OFF)'}\``, true)
            .addField("🤐 Logs feature", `\`${guildSettings.allowLogChannel ? '🟢 (ON)' : '🔴 (OFF)'}\``, true)
            .addField("🙋‍♂️ Suggestion feature", `\`${guildSettings.allowSuggestion ? '🟢 (ON)' : '🔴 (OFF)'}\``, true)
            .addField("👾 Leveling feature", `\`${guildSettings.allowLeveling ? '🟢 (ON)' : '🔴 (OFF)'}\``, true)
            .addField("🧬 Antilink feature", `\`${guildSettings.allowAntilink ? '🟢 (ON)' : '🔴 (OFF)'}\``, true)
            .addField("🧬 Anti advertising feature", `\`${guildSettings.allowAntiAdvertising ? '🟢 (ON)' : '🔴 (OFF)'}\``, true)
            .addField("👩‍👩‍👧‍👦 Anti join (Anti raid)", `\`${antijoin.get(message.guild.id) ? '🟢 (ON)' : '🔴 (OFF)'}\``, true)
            .addField("🤬 Anti curse feature", `\`${guildSettings.allowAnticurse ? '🟢 (ON)' : '🔴 (OFF)'}\``, true)
            .addField("👩‍👩‍👧‍👦 Anti blacklist members", `\`${guildSettings.allowAntiBL_members ? '🟢 (ON)' : '🔴 (OFF)'}\``, true)
            .addField("👨‍💻 Anti blacklist classic commands", `\`${guildSettings.allowAntiBL_messageCommands ? '🟢 (ON)' : '🔴 (OFF)'}\``, true)

            .addField('\u200B', "__Channels__")
            .addField("👨‍👩‍👧 Welcome channel", `${guildSettings.welcomeChannelId ? `<#${guildSettings.welcomeChannelId}>` : "`No Channel Set`"}`, true)
            .addField("🤐 Log channel", `${guildSettings.logChannelId ? `<#${guildSettings.logChannelId}>` : "`No channel set`"}`, true)
            .addField("🙋‍♂️ Suggestion channel", `${guildSettings.suggestionChannelId ? `<#${guildSettings.suggestionChannelId}>` : "`No channel set`"}`, true)
            .addField("👋 Leave channel", `${guildSettings.leaveChannelId ? `<#${guildSettings.leaveChannelId}>` : "`No Channel Set`"}`, true)

            .addField('\u200B', "__Misclanea__")
            .addField("🧛‍♂️ New Member Role", `${guildSettings.memberRoleId ? `<@&${guildSettings.memberRoleId}>` : "`No member role set`"}`, true)
            .addField("👨‍👩‍👧 Welcome Image", `${
                guildSettings.welcomeImage 
                ? `[Custom Image](${guildSettings.welcomeImage})` 
                : '[Default Image](https://cdn.discordapp.com/attachments/850306937051414561/877186344965783614/WallpaperDog-16344.jpg)'
            }`, true)
            .addField("👨‍👩‍👧 Welcome Message", `${guildSettings.welcomeMessage ? `Custom Message` : "`Default Message`"}`, true)

        message.channel.send({ embeds: [setupEmbed] })
	},
};
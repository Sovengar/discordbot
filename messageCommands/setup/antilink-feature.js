const { Message, Client, MessageEmbed} = require("discord.js");
const { Permissions } = require("discord.js");
const GuildSettings = require("../../models/GuildSettings");

module.exports = {
	name : 'antilink',
    aliases : ['antilinkfeature'],
    description: "Stablishes the on/off/status option and the channels with antilink feature",
    userPermissions: ["MANAGE_GUILD",],
    botPermissions: ["MANAGE_MESSAGES",],
    cooldown: 5,
    usage: "Example 1: command on/off/status/list \nExample 2: command add/remove channel/channel_id",
    /**
     *
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
    */
    run: async (client, message, args) => {
        let toggling = ["on", "off", "status", "list", "add", "remove"]
        if (!toggling.includes(args[0]?.toLowerCase())) 
            return message.reply({ embeds: [
                new MessageEmbed()
                    .setColor("RED")
                    .setDescription("‼ - Please provide a valid option between `status`, `list`, `on`, `off`, `add` or `remove`!")
            ]})

		GuildSettings.findOne({ guild_id: message.guild.id }, (err, data) => {
			if (err) {
				console.log(err);
				return message.reply("An error occurred while trying to set antilink on a channel!");
			}

			if (!data) {
                data = new GuildSettings({
                    guild_id: message.guild.id,
                    prefix: process.env.PREFIX,
                })
                data.save().catch(err => console.log(err))
			} 
            
            if(args[0]?.toLowerCase() === 'status'){
                return message.reply({ embeds: [
                    new MessageEmbed()
                        .setColor("RED")
                        .addField("🧬 Antilink feature", `\`${data.allowAntilink ? '🟢 (ON)' : '🔴 (OFF)'}\``, true)        
                ]}) 
            }

            if(args[0]?.toLowerCase() === 'list'){
                if(!data.blacklist_linkChannels.length) return message.reply("There is no antilink channels yet!")

                return message.reply({ embeds: [
                    new MessageEmbed()
                        .setColor("RED")
                        .setTitle(`🧬 __Channels blacklisted__`)
                        .setDescription("Channels blacklisted cant be used to send links")
                        .addField("__Antilink channels__", `${Object.entries(data.blacklist_linkChannels).map( (value, index) => { return `<#${value[1]}>`}).join(", ")}`) 
                ] })
            }
        
            else if(args[0]?.toLowerCase() === 'on'){
                data.allowAntilink = true
                message.reply(`Enabled Antilink system!`);
            } 
            
            else if(args[0]?.toLowerCase() === 'off'){
                data.allowAntilink = false
                message.reply(`Disabled Antilink system!`);
            } 

            const channel = message.mentions.channels.first() || message.member.guild.channels.cache.get(args[1]) 
            if(!channel) return message.reply(`You provided a wrong channel`);
            if(channel.type === 'GUILD_VOICE') return message.reply("You provided a voice channel")

            else if(args[0]?.toLowerCase() === 'add'){
                data.blacklist_linkChannels.push(channel.id);
                message.reply(`${channel} has been set as an Antilink channel`);
            }

            else if(args[0]?.toLowerCase() === 'remove'){
                const index = data.blacklist_linkChannels.indexOf(channel.id);
                if (index === -1) return message.reply(`${channel} was not found as an Antilink channel`);
                
                data.blacklist_linkChannels.splice(index, 1); // 2nd parameter means remove one item only 
                message.reply(`${channel} has been removed as an Antilink channel`); 
            }
            
			data.save(err => {
				if (err) {
					console.log(err);
					return message.reply("An error occurred while trying to set the Antilink feature!");
				}
			})
		})
	}
}
const { Message, Client, MessageEmbed} = require("discord.js");
const { Permissions } = require("discord.js");
const GuildSettings = require("../../models/GuildSettings");

module.exports = {
    name : 'leveling-feature',
    aliases : ['level-feature'],
    description: "Stablishes the on/off/status/list level feature and the channels where you cant farm xp",
    cooldown: 5,
    userPermissions: ["MANAGE_GUILD",],
    botPermissions: ["ADMINISTRATOR",],
    usage: "\nExample 1: command on/off/status/list \nExample 2: command add/remove channel/channel_id \n",
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
				return message.reply("An error occurred while trying to set the leveling feature!");
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
                        .addField("🧬 Antilink feature", `\`${data.allowLeveling ? '🟢 (ON)' : '🔴 (OFF)'}\``, true)        
                ]}) 
            }

            if(args[0]?.toLowerCase() === 'list'){
                if(!data.blacklist_levelingChannels.length) return message.reply("There is no antilink channels yet!")

                return message.reply({ embeds: [
                    new MessageEmbed()
                        .setColor("RED")
                        .setTitle(`🧬 __Channels blacklisted__`)
                        .setDescription("Channels blacklisted cant be used to get or farm xp")
                        .addField("__Leveling channels blacklisted__", `${Object.entries(data.blacklist_levelingChannels).map( (value, index) => { return `<#${value[1]}>`}).join(", ")}`) 
                ] })
            }
        
            else if(args[0]?.toLowerCase() === 'on'){
                data.allowLeveling = true
                message.reply(`Enabled leveling system!`);
            } 
            
            else if(args[0]?.toLowerCase() === 'off'){
                data.allowLeveling = false;
                message.reply(`Disabled leveling system!`);
            } 

            const channel = message.mentions.channels.first() || message.member.guild.channels.cache.get(args[1]) 
            if(!channel) return message.reply(`You provided a wrong channel`);
            if(channel.type === 'GUILD_VOICE') return message.reply("You provided a voice channel")

            else if(args[0]?.toLowerCase() === 'add'){
                data.blacklist_levelingChannels.push(channel.id);
                message.reply(`${channel} has been disabled for leveling.`);  
            }

            else if(args[0]?.toLowerCase() === 'remove'){
                const index = data.blacklist_levelingChannels.indexOf(channel.id);
                if(index === -1) return message.reply(`${channel} was not found as a disabled leveling channel`);

                data.blacklist_levelingChannels.splice(index, 1); // 2nd parameter means remove one item only
                message.reply(`${channel} has been removed as a disabled leveling channel`); 
            }
            
			data.save(err => {
				if (err) {
					console.log(err);
					return message.reply("An error occurred while trying to set the leveling feature!");
				}
			})
		})
	}
}
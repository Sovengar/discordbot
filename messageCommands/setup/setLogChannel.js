const { Message, Client,} = require("discord.js");
const { Permissions } = require("discord.js");
const GuildSettings = require("../../models/GuildSettings");

module.exports = {
	name : 'setlogchannel',
    aliases : ['setlog'],
    description: "Stablishes the enable/disable option and the log channel",
    userPermissions: ["MANAGE_GUILD",],
    botPermissions: ["MANAGE_CHANNELS",],
    cooldown: 5,
    usage: "Example 1: command enable/disable \nExample 2: command channel/channel_id",
    /**
     *
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
    */
    run: async (client, message, args) => {
        if(!args[0]) 
            return message.reply("Choose an option first, check `help setlogchannel` for more info");
        
		GuildSettings.findOne({ guild_id: message.guild.id }, (err, data) => {
			if (err) {
				console.log(err);
				return message.reply("An error occurred while trying to set the log channel!");
			}

			if (!data) {
                data = new GuildSettings({
                    guild_id: message.guild.id,
                    prefix: process.env.PREFIX,
                })
                data.save()
			} else {
                if(args[0] === 'enable'){
                    data.allowLogChannel = true
                    message.reply(`Enabled log system!`);
                } else if(args[0] === 'disable'){
                    data.allowLogChannel = false
                    message.reply(`Disabled log system!`);
                } else {
                    if(data.allowLogChannel == false)
                        return message.reply(`Log system disabled, cant choose a channel`);
                    
                    const channel = message.member.guild.channels.cache.get(args[0]) || message.mentions.channels.first()

                    if(!channel)
                        return message.reply(`You provided a wrong channel`);

                    if(channel.type === 'GUILD_VOICE')
                        return message.reply("You provided a voice channel")

                    data.logChannelId = channel.id;
                    message.reply(`Log channel has been set to ${channel}`);
                }
			}

			data.save(err => {
				if (err) {
					console.log(err);
					return message.reply("An error occurred while trying to set the log channel!");
				}
			})
		})
	}
}
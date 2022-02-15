const { Message, Client,} = require("discord.js");
const { Permissions } = require("discord.js");
const GuildSettings = require("../../models/GuildSettings");

module.exports = {
	name : 'setleave',
    aliases : ['setleave'],
    description: "Stablishes the on/off option and the leave channel",
    userPermissions: ["MANAGE_GUILD",],
    botPermissions: ["MANAGE_CHANNELS",],
    cooldown: 5,
    usage: "Example 1: command on/off \nExample 2: command channel/channel_id",
    /**
     *
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
    */
    run: async (client, message, args) => {
        if(!args[0]) 
            return  message.reply("Choose an option first, check `help setleave` for more info");

		GuildSettings.findOne({ guild_id: message.guild.id }, (err, data) => {
			if (err) {
				console.log(err);
				return message.reply("An error occurred while trying to set the leave channel!");
			}

			if (!data) {
                data = new GuildSettings({
                    guild_id: message.guild.id,
                    prefix: process.env.PREFIX,
                })
                data.save()
			} else {
                if(args[0] === 'on'){
                    data.allowLeave = true
                    message.reply(`Enabled leave system!`);
                } else if(args[0] === 'off'){
                    data.allowLeave = false
                    message.reply(`Disabled leave system!`);
                } else {
                    if(data.allowLeave == false)
                        return  message.reply(`Leave system disabled, cant choose a channel`);
                    
                    const channel = message.member.guild.channels.cache.get(args[0]) || message.mentions.channels.first()

                    if(!channel)
                        return message.reply(`You provided a wrong channel`);

                    if(channel.type === 'GUILD_VOICE')
                        return message.reply("You provided a voice channel")

                    data.leaveChannelId = channel.id;
                    message.reply(`Leave channel has been set to ${channel}`);
                }
			}

			data.save(err => {
				if (err) {
					console.log(err);
					return message.reply("An error occurred while trying to set the leave channel!");
				}
			})
		})
	}
}
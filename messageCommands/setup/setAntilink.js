const { Message, Client,} = require("discord.js");
const { Permissions } = require("discord.js");
const GuildSettings = require("../../models/GuildSettings");

module.exports = {
	name : 'setantilink',
    aliases : ['setantilink'],
    description: "Stablishes the on/off option and the channels with antilink feature",
    userPermissions: ["MANAGE_GUILD",],
    botPermissions: ["MANAGE_MESSAGES",],
    cooldown: 5,
    usage: "Example 1: command on/off \nExample 2: command on/off channel/channel_id",
    /**
     *
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
    */
    run: async (client, message, args) => {
        if(!args[0]) 
            return message.reply("Choose an option first, check `help setantilink` for more info");

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
                data.save()
			} else {
                if(args[0] === 'on' && !args[1]){
                    data.allowAntilink = true
                    message.reply(`Enabled Antilink system!`);
                } else if(args[0] === 'off' && !args[1]){
                    data.allowAntilink = false
                    message.reply(`Disabled Antilink system!`);
                } else {
                    if(data.allowAntilink == false)
                        return message.reply(`Antilink system disabled, cant add a channel`);
                    
                    //GETTING THE CHANNEL FROM THE ARGUMENTS
                    const channel = message.member.guild.channels.cache.get(args[1]) || message.mentions.channels.first()

                    //ENABLING A CHANNEL AS AN ANTILINK
                    if(args[0] === 'on' && channel){
                        if(channel.type !== 'GUILD_VOICE'){
                            data.antiLinkChannels.push(channel.id);
                            message.reply(`${channel} has been set as an Antilink channel`);
                            data.save()
                            return
                        } else {
                            return message.reply("You provided a voice channel")
                        }
                    } 

                    //DISABLING A CHANNEL AS AN ANTILINK
                    else if(args[0] === 'off' && channel) {
                        if(channel.type === 'GUILD_VOICE')
                            return message.reply("You provided a voice channel")

                        const index = data.antiLinkChannels.indexOf(channel.id);
                        if (index > -1) {
                            data.antiLinkChannels.splice(index, 1); // 2nd parameter means remove one item only
                            data.save()
                            return message.reply(`${channel} has been set as an Antilink channel`);
                        } else {
                            message.reply(`${channel} was not found as an Antilink channel`);
                        }
                    } 
                    
                    //WRONG ARGUMENTS
                    else {
                        return message.reply("Wrong arguments, check `help setantilink` for more info");
                    } 
                }
			}

			data.save(err => {
				if (err) {
					console.log(err);
					return message.reply("An error occurred while trying to set the Antilink channel!");
				}
			})
		})

	}
}
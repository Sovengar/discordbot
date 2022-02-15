const { Message, Client,} = require("discord.js");
const { Permissions } = require("discord.js");
const GuildSettings = require("../../models/GuildSettings");

module.exports = {
	name : 'setantiadvertising',
    aliases : ['setantiadvertising'],
    description: "Stablishes the on/off option for anti advertising feature",
    userPermissions: ["MANAGE_GUILD",],
    botPermissions: ["MANAGE_MESSAGES",],
    cooldown: 5,
    usage: "<on/off> Example: command on/off",
    /**
     *
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
    */
    run: async (client, message, args) => {
        if(!args[0]) return message.reply("Choose an option first, check `help setantiadvertising` for more info");

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
			} 
            
            if(args[0] === 'on'){
                data.allowAntiAdvertising = true
                message.reply(`Enabled anti advertising system!`);
            } 
            
            else if(args[0] === 'off'){
                data.allowAntiAdvertising = false
                message.reply(`Disabled anti advertising system!`);   
            }
            
            else return message.reply("Wrong arguments, check `help setantiadvertising` for more info");
            
			data.save(err => {
				if (err) {
					console.log(err);
					return message.reply("An error occurred while trying to set the Antilink channel!");
				}
			})
		})
	}
}
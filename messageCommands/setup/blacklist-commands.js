const { Message, Client, MessageEmbed} = require("discord.js");
const GuildSettings = require("../../models/GuildSettings");

module.exports = {
    name: "blacklist-commands",
    aliases: ["bl-commands", "bl-c"],
    description: "Commands on the blacklist are disabled. Use add, remove or list.",
    usage: "<on/off/list/status || add/remove (command)> [command name] \nExample 1: command list \nExample 2: command add/remove command_name",
    userPermissions: ["ADMINISTRATOR",],
    botPermissions: ["ADMINISTRATOR",],
    cooldown: 5,
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
                        .addField("👨‍💻 __Anti blacklisted classic commands feature__", `\`${data.allowAntiBL_messageCommands ? '🟢 (ON)' : '🔴 (OFF)'}\``, true)
                ]}) 
            }

            if(args[0]?.toLowerCase() === 'list'){
                if(!data.blacklist_messageCommands?.length) return message.reply("There is no blacklisted commands yet!")

                return message.reply({ embeds: [
                    new MessageEmbed()
                        .setColor("RED")
                        .setTitle(` 👨‍💻 __Commands blacklisted__`)
                        .setDescription("Commands blacklisted cant be executed")
                        .addField("__Commands__", `${Object.entries(data.blacklist_messageCommands).map( (value, index) => { return `**${value[1]}**`}).join(", ")}`)
                ] })
            }
            
        
            else if(args[0]?.toLowerCase() === 'on'){
                data.allowAntiBL_messageCommands = true;
                message.reply(`Enabled Anti blacklisted classic commands system!`);
            } 
            
            else if(args[0]?.toLowerCase() === 'off'){
                data.allowAntiBL_messageCommands = false;
                message.reply(`Disabled Anti blacklisted classic commands system!`);
            } 

            const command = args[1]
            if (!command) return message.reply('Please specify a command')
            if (!!client.messageCommands.get(command) === false) return message.reply('Invalid command, provide a valid classic command.')

            else if(args[0]?.toLowerCase() === 'add'){
                if (data.blacklist_messageCommands.includes(command)) return message.reply('This command has already been disabled.');

                data.blacklist_messageCommands.push(command)
                message.reply(`Command ${command} has been disabled`)
            }

            else if(args[0]?.toLowerCase() === 'remove'){
                if(data.blacklist_messageCommands.length === 0) return message.reply('There are no commands disabled')
                if (!data.blacklist_messageCommands.includes(command)) return message.reply('That command isnt turned off.')
                   
                //const index = data.blacklist_linkChannels.indexOf(channel.id);
                //if (index === -1) return message.reply(`${channel} was not found as an Antilink channel`);
                //data.blacklist_linkChannels.splice(index, 1); // 2nd parameter means remove one item only 

                for (let i = 0; i < data.blacklist_messageCommands.length; i++) {
                    if (data.blacklist_messageCommands[i] === command) 
                        data.blacklist_messageCommands.splice(i, 1)
                }

                message.reply(`Enabled ${command}!`)  
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
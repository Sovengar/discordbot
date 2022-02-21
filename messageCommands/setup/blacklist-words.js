const { Message, Client, MessageEmbed} = require("discord.js");
const GuildSettings = require("../../models/GuildSettings");

module.exports = {
	name : 'blacklist-words',
    aliases : ['bl-words', 'bl-w'],
    description: "Adds or removes badwords in server's list",
    userPermissions: ["MANAGE_GUILD",],
    botPermissions: ["MANAGE_MESSAGES",],
    cooldown: 5,
    usage: "<add/remove/list/status/on/off> [word] \nExample 1: command status/list/on/off \nExample 2: command add/remove word",
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
                        .addField("🤬 Anticurse feature", `\`${data.allowAnticurse ? '🟢 (ON)' : '🔴 (OFF)'}\``, true)
                    ]})
            }

            if(args[0]?.toLowerCase() === 'list'){
                if(!data.blacklist_words.length) return message.reply("There is no blacklisted words yet!")

                return message.reply({ embeds: [
                    new MessageEmbed()
                        .setColor("RED")
                        .setTitle(`🤬 __Words blacklisted__`)
                        .setDescription("Words blacklisted cant be used on the server")
                        .addField("__Words__", `${Object.entries(data.blacklist_words).map( (value, index) => { return `**${value[1]}**`}).join(", ")}`)
                ] })
            }
            
            else if(args[0]?.toLowerCase() === 'on'){
                data.allowAnticurse = true;
                message.reply(`Enabled Anticurse system!`);
            } 
            
            else if(args[0]?.toLowerCase() === 'off'){
                data.allowAnticurse = false;    
                message.reply(`Disabled Anticurse system!`);
            } 

            const command = args[1]
            if (!command) return message.reply('Please specify a command')
            if (!!client.messageCommands.get(command) === false) return message.reply('Invalid command, provide a valid classic command.')

            else if(args[0]?.toLowerCase() === 'add'){
                const word = args.slice(1).join(" ")
                if (!word) return message.reply("Please provide a word to add in blacklist")
                
                const wordtoAdd = word.toLowerCase()
                if (data.blacklist_words.includes(wordtoAdd)) return message.reply("The word you provided is already blacklisted")
    
                data.blacklist_words.push(wordtoAdd)
                message.reply(`Successfully added \`${word}\` into the blacklisted words`);
            }

            else if(args[0]?.toLowerCase() === 'remove'){
                const word = args.slice(1).join(" ")
                if (!word) return message.reply("Please provide a word to remove in blacklist")
                
                const wordtoRmv = word.toLowerCase()
                if (!data.blacklist_words.includes(wordtoRmv)) return message.reply("The word you provided is not blacklisted")
    
                let array = data.blacklist_words
                array = array.filter(x => x !== wordtoRmv)
                
                data.blacklist_words = array
                message.reply(`Successfully removed \`${word}\` from the blacklisted words`) 
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
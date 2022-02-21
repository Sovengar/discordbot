const GuildSettings = require('../../models/GuildSettings')
const { Client, Message, MessageEmbed } = require('discord.js')
const { getMember, } = require('../../functions/utils')

module.exports = {
    name : 'blacklist-members',
    aliases : ['bl-members', 'bl-m'],
    description: "Members on the blacklist cant use the bot. Use on, off, add, remove, list or status.",
    cooldown: 5,
    usage: "<on/off/status/list/add/remove> [user] \nExample 1: command on/off/status/list \nExample 2: command add/remove @user",
    userPermissions: ["MANAGE_GUILD",],
    botPermissions: [,],
    /**
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
    */
    run : async(client, message, args) => {
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
                        .addField("👨‍💻 __Anti blacklisted members feature__", `\`${data.allowAntiBL_members ? '🟢 (ON)' : '🔴 (OFF)'}\``, true)
                    ]})
            }

            if(args[0]?.toLowerCase() === 'list'){
                if(!data.blacklist_members?.length) return message.reply("There is no blacklisted members yet!")

                return message.reply({ embeds: [
                    new MessageEmbed()
                        .setColor("RED")
                        .setTitle(`👨‍👩‍👧 __Members blacklisted__`)
                        .setDescription("Members blacklisted cant execute any of my commands")
                        .addField("__Members__", `${Object.entries(data.blacklist_members).map( (value, index) => { return `<@${value[1]}>`}).join(", ")}`)
                ] })
            }
        
            else if(args[0]?.toLowerCase() === 'on'){
                data.allowAntiBL_members = true;
                message.reply(`Enabled Anti blacklisted members system!`);
            } 
            
            else if(args[0]?.toLowerCase() === 'off'){
                data.allowAntiBL_members = false;
                message.reply(`Disabled Anti blacklisted members system!`);
            } 

            const member = getMember(client, message, args[1])
            if(!member) return message.reply('Member is either invalid or not provided')

            else if(args[0]?.toLowerCase() === 'add'){
                if(data.blacklist_members.indexOf(member.id) !== -1) return message.reply(`**${member.user.tag}** has already been blacklisted!`)

                data.blacklist_members.push(member.id)
                message.reply(`${member.user.tag} has been added to blacklist.`)  
            }

            else if(args[0]?.toLowerCase() === 'remove'){
                if(data.blacklist_members.length === 0) return  message.reply(`**${member.user.tag}** is not blacklisted.`)

                const index = data.blacklist_members.indexOf(member.id);
                if(index === -1) return message.reply(`${member.user.tag} was not found as a blacklisted user!`);

                data.blacklist_members.splice(index, 1); // 2nd parameter means remove one item only
                message.reply(`**${member.user.tag}** has been removed from the blacklist!`);
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
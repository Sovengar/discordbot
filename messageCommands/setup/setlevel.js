const { Message, Client, } = require("discord.js");
const { Permissions } = require("discord.js");
const GuildSettings = require("../../models/GuildSettings");

module.exports = {
    name : 'setlevel',
    aliases : ['setlevel'],
    description: "Stablishes the on/off level feature and the channels where you cant farm xp",
    cooldown: 5,
    userPermissions: ["MANAGE_GUILD",],
    botPermissions: ["ADMINISTRATOR",],
    usage: "\nExample 1: command on/off \nExample 2: command bannedchannel-add/remove channel/channel_id \n",
    /**
     *
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
    */
    run: async (client, message, args) => {
        if(!args[0]) 
            return message.reply("Choose an option first, check `help setlevel` for more info");

        let guildSettings = await GuildSettings.findOne({ guild_id: message.guild.id }); 

        if (!guildSettings) {
            guildSettings = new GuildSettings({
                guild_id: message.guild.id,
                prefix: process.env.PREFIX,
            })
            await guildSettings.save()
        }

        if(args[0] === 'on'){
            guildSettings.allowLeveling = true
            await guildSettings.save()
            return message.reply(`Enabled leveling system!`);
        } 
        
        else if(args[0] === 'off'){
            guildSettings.allowLeveling = false;
            await guildSettings.save()
            return message.reply(`Disabled leveling system!`);
        } 
        
        else if(args[0] === 'bannedchannel-add') {
            if(guildSettings.allowLeveling == false)
                return message.reply(`Leveling System disabled, cant choose a channel`);

            const channel = message.member.guild.channels.cache.get(args[1].toString()) || message.mentions.channels.first()

            if(!channel)
                return message.reply(`You provided a wrong channel`);

            if(channel.type === 'GUILD_VOICE')
                return message.reply("You provided a voice channel")
            
            guildSettings.disabledLevelingChannels.push(channel.id);
            await guildSettings.save()
            return message.reply(`${channel} has been disabled for leveling.`);     
        }
                
        else if(args[0] === 'bannedchannel-del') {
            if(guildSettings.allowLeveling == false)
                return message.reply(`Leveling System disabled, cant choose a channel`);

            const channel = message.member.guild.channels.cache.get(args[1]) || message.mentions.channels.first()

            if(!channel)
                return message.reply(`You provided a wrong channel`);

            if(channel.type === 'GUILD_VOICE')
                return message.reply("You provided a voice channel")

            const index = guildSettings.disabledLevelingChannels.indexOf(channel.id);

            if(index == -1)
                return message.reply(`${channel} was not found as a disabled leveling channel`);

            guildSettings.disabledLevelingChannels.splice(index, 1); // 2nd parameter means remove one item only
            await guildSettings.save()
            return message.reply(`${channel} has been set as a disabled leveling channel`); 
        } 
        
        else {
            return message.reply("Wrong arguments, check `help setlevel` for more info");
        }
	}
}
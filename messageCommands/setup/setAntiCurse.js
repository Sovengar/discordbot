const { Message, Client,} = require("discord.js");
const { Permissions } = require("discord.js");
const GuildSettings = require("../../models/GuildSettings");

module.exports = {
	name : 'setanticurse',
    aliases : ['setbadwords'],
    description: "Adds or removes badwords in server's list",
    userPermissions: ["MANAGE_GUILD",],
    botPermissions: ["MANAGE_MESSAGES",],
    cooldown: 5,
    usage: "Example 1: command on/off \nExample 2: command word-add/word-del word",
    /**
     *
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
    */
    run: async (client, message, args) => {		
        if(!args[0]) 
            return message.reply("Choose an option first, check help setanticurse for more info");

        let guildSettings = await GuildSettings.findOne({ guild_id: message.guild.id }); 
            
        if (!guildSettings) {
            guildSettings = new GuildSettings({
                guild_id: message.guild.id,
                prefix: process.env.PREFIX,
            })
            await guildSettings.save()
        }
        
        if(args[0] === 'on'){
            guildSettings.allowAnticurse = true;
            await guildSettings.save()
            return message.reply(`Enabled Anticurse system!`);
        } 
        
        else if(args[0] === 'off'){
            guildSettings.allowAnticurse = false;
            await guildSettings.save()
            return message.reply(`Disabled Anticurse system!`);
        } 
        
        else if(args[0] === 'word-add') {
            
            if(guildSettings.allowAnticurse == false)
                return message.reply(`Anticurse system disabled, cant do this action`);

            const word = args.slice(1).join(" ")

            if (!word) 
                return message.reply("Please provide a word to add in blacklist")

            const wordtoAdd = word.toLowerCase() 

            if (guildSettings.bannedWords.includes(wordtoAdd)) 
                return message.reply("The word you provided is already blacklisted")

            guildSettings.bannedWords.push(wordtoAdd)
            await guildSettings.save()

            return message.reply(`Successfully added \`${word}\` into the blacklisted words`);
        } 
        
        else if(args[0] === 'word-del') {
            const word = args.slice(1).join(" ")

            if(guildSettings.allowAnticurse = false)
                return message.reply(`Anticurse system disabled, cant do this action`);

            if (!word) 
                return message.reply("Please provide a word to add in blacklist")

            const wordtoRmv = word.toLowerCase()

            if (!guildSettings.bannedWords.includes(wordtoRmv)) 
                return message.reply("The word you provided is not blacklisted")

            let array = guildSettings.bannedWords
            array = array.filter(x => x !== wordtoRmv)
            guildSettings.bannedWords = array
            await guildSettings.save()

            return message.reply(`Successfully removed \`${word}\` from the blacklisted words`)
        } 
        
        else {
            return message.reply(`Wrong arguments, check help setanticurse for more info`);
        }
	}
}
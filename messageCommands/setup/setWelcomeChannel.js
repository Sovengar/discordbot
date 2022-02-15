const { Message, Client, MessageEmbed} = require("discord.js");
const { Permissions } = require("discord.js");
const GuildSettings = require("../../models/GuildSettings");

module.exports = {
	name : 'setwelcome',
    aliases : ['setwelcome'],
    description: "Stablishes the on/off option and the welcome channel, including custom message and image",
    userPermissions: ["MANAGE_GUILD",],
    botPermissions: ["MANAGE_CHANNELS",],
    cooldown: 5,
    usage: "\nExample 1: command on/off \nExample 2: command setchannel channel/channel_id \nExample 3: command message-add/del message \nExample 4: command image-add/del image",
    /**
     *
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
    */
    run: async (client, message, args) => {
        if(!args[0]) 
            return message.reply("Choose an option first, check `help setwelcome` for more info");

        let guildSettings = await GuildSettings.findOne({ guild_id: message.guild.id }); 

        if (!guildSettings) {
            guildSettings = new GuildSettings({
                guild_id: message.guild.id,
                prefix: process.env.PREFIX,
            })
            await guildSettings.save()
        }

        if(args[0] === 'on'){
            guildSettings.allowWelcome = true
            await guildSettings.save()
            return message.reply(`Enabled welcome system!`);
        } 
        
        else if(args[0] === 'off'){
            guildSettings.allowWelcome = false;
            await guildSettings.save()
            return message.reply(`Disabled welcome system!`);
        } 
        
        else if(args[0] === 'setchannel') {
            if(guildSettings.allowWelcome == false){
                return message.reply(`Welcome system disabled, cant choose a channel`);
            } 

            const channel = message.member.guild.channels.cache.get(args[1]) || message.mentions.channels.first()

            if(!channel)
                return message.reply(`You provided a wrong channel`);

            if(channel.type === 'GUILD_VOICE')
                return message.reply("You provided a voice channel")

            guildSettings.welcomeChannelId = channel.id;
            await guildSettings.save()
            return message.reply(`Welcome channel has been set to ${channel}`);     
        }
                
        else if(args[0] === 'message-add') {
            if(guildSettings.allowWelcome == false){
                return message.reply(`Welcome system disabled, cant choose a channel`);
            } 

            const welcomeMessage = args.slice(2).join(" ")
        
            const welmsgerrEmbed = new MessageEmbed()
                .setColor('#3d35cc')
                .setDescription('‼️ - Please provide your Custom Welcome Message!')

            const msgerrEmbed = new MessageEmbed()
                .setColor('#3d35cc')
                .setDescription("‼️ - The message must include one **{}**, to mention the user!\n\n**Example:** Hello {}!, welcome to our server. Hope you'll enjoy!")

            const welmsgyEmbed = new MessageEmbed()
                .setColor('#3d35cc')
                .setDescription(`✅ - The Custom Welcome Message is now set`)

            if (!welcomeMessage) 
                return message.reply({ embeds: [welmsgerrEmbed] })
    
            if (!welcomeMessage.includes("{}")) 
                return message.reply({ embeds: [msgerrEmbed] })

            guildSettings.welcomeMessage = welcomeMessage;
            await guildSettings.save()
            return message.reply({ embeds: [welmsgyEmbed] });     
        } 
        
        else if(args[0] === 'message-del') {
            if(guildSettings.allowWelcome == false){
                return message.reply(`Welcome system disabled, cant choose a channel`);
            } 

            const welmsgnEmbed = new MessageEmbed()
                .setColor('#3d35cc')
                .setDescription(`✅ - The Custom Welcome Message has been removed & set to the Default one`)

            const welmsganEmbed = new MessageEmbed()
                .setColor('#3d35cc')
                .setDescription(`‼️ - No Custom Welcome Message is set till now!`)

            if (!guildSettings.welcomeMessage) 
                return message.reply({ embeds: [welmsganEmbed] })
        
            guildSettings.welcomeMessage = null;
            await guildSettings.save()
            return message.reply({ embeds: [welmsgnEmbed] })
        }
    
        else if(args[0] === 'image-add'){
            const welcomeImage = args[1]

            const welimgerrEmbed = new MessageEmbed()
            .setColor('#3d35cc')
            .setDescription('‼️ - Please provide an Image Link to setup as Welcome Background!')
    
            const linkerrEmbed = new MessageEmbed()
                .setColor('#3d35cc')
                .setDescription('‼️ - The image link you provided is not a valid one, you can only use image links uploaded to Discord in `.jpg` or `.png` format. Upload the image to Discord first & then copy-paste the link!')
        
            const welimgyEmbed = new MessageEmbed()
                .setColor('#3d35cc')
                .setDescription(`✅ - [Image](${welcomeImage}) is now set as Welcome Background`)
    
            if (!welcomeImage) 
                return message.reply({ embeds: [welimgerrEmbed] })

            if (!welcomeImage.startsWith("https://cdn.discordapp.com/attachments/") && !welcomeImage.endsWith(".jpg") && !welcomeImage.endsWith(".png")) 
                return message.reply({ embeds: [linkerrEmbed] })
    
            guildSettings.welcomeImage = welcomeImage;
            await guildSettings.save()
            return message.reply({ embeds: [welimgyEmbed] })
        }   
        
        else if(args[0] === 'image-del'){
            const welcomeImage = args[1]

            const welimgnEmbed = new MessageEmbed()
                .setColor('#3d35cc')
                .setDescription(`✅ - Welcome Background is now set to [Default](https://cdn.discordapp.com/attachments/850306937051414561/877186344965783614/WallpaperDog-16344.jpg)`)
        
            const welimganEmbed = new MessageEmbed()
                .setColor('#3d35cc')
                .setDescription(`‼️ - Welcome Background is already set to [Default](https://cdn.discordapp.com/attachments/850306937051414561/877186344965783614/WallpaperDog-16344.jpg)`)

            if (!welcomeImage) 
                return message.reply({ embeds: [welimganEmbed] })

                guildSettings.welcomeImage = null;
            await guildSettings.save()
            return message.reply({ embeds: [welimgnEmbed] })
        }

        else {
            return message.reply("Wrong arguments, check `help setwelcome` for more info");
        }
	}
}
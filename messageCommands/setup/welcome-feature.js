const { Message, Client, MessageEmbed} = require("discord.js");
const { Permissions } = require("discord.js");
const GuildSettings = require("../../models/GuildSettings");

module.exports = {
	name : 'welcomefeature',
    aliases : ['welcomefeature'],
    description: "Stablishes the on/off/status option and the welcome channel, including custom message and image",
    userPermissions: ["MANAGE_GUILD",],
    botPermissions: ["MANAGE_CHANNELS",],
    cooldown: 5,
    usage: "\nExample 1: command on/off/status \nExample 2: command set channel/channel_id \nExample 3: command add/remove message/image",
    /**
     *
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
    */
    run: async (client, message, args) => {
        let toggling = ["on", "off", "status", "set", "add", "remove"]
        if (!toggling.includes(args[0]?.toLowerCase())) 
            return message.reply({ embeds: [
                new MessageEmbed()
                    .setColor("RED")
                    .setDescription("‼ - Please provide a valid option between `status`, `on`, `off`, `set`, `add` or `remove`!")
            ]})

        GuildSettings.findOne({ guild_id: message.guild.id }, (err, data) => {
            if (err) {
                console.log(err);
                return message.reply("An error occurred while trying to set the welcome feature!");
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
                        .addField("👨‍👩‍👧 Welcome feature", `\`${data.allowWelcome ? '🟢 (ON)' : '🔴 (OFF)'}\``, true)
                        .addField("👨‍👩‍👧 Welcome channel", `${data.welcomeChannelId ? `<#${data.welcomeChannelId}>` : "`No Channel Set`"}`, true)
                        .addField("👨‍👩‍👧 Welcome Image", `${
                            data.welcomeImage 
                            ? `[Custom Image](${data.welcomeImage})` 
                            : '[Default Image](https://cdn.discordapp.com/attachments/850306937051414561/877186344965783614/WallpaperDog-16344.jpg)'
                        }`, true)
                        .addField("👨‍👩‍👧 Welcome Message", `${data.welcomeMessage ? `Custom Message` : "`Default Message`"}`, true)
                    ]}) 
            }
            
            else if(args[0]?.toLowerCase() === 'on'){
                data.allowWelcome = true
                message.reply(`Enabled welcome system!`);
            } 
            
            else if(args[0]?.toLowerCase() === 'off'){
                data.allowWelcome = false;
                message.reply(`Disabled welcome system!`);
            } 

            else if(args[0]?.toLowerCase() === 'set'){
                const channel = message.mentions.channels.first() || message.member.guild.channels.cache.get(args[1])
                if(!channel) return message.reply(`You provided a wrong channel`);
                if(channel.type === 'GUILD_VOICE') return message.reply("You provided a voice channel")

                data.welcomeChannelId = channel.id;
                message.reply(`Welcome channel has been set to ${channel}`);     
            }

            else if(args[0]?.toLowerCase() === 'add'){
                toggling = ["message", "image"]
                if (!toggling.includes(args[1])) 
                    return message.reply({ embeds: [
                        new MessageEmbed()
                            .setColor("RED")
                            .setDescription("‼ - Please provide a valid option between `message` or `image`!")
                    ]})
                
                if(args[1] === "message"){
                    const welmsgerrEmbed = new MessageEmbed()
                    .setColor('#3d35cc')
                    .setDescription('‼️ - Please provide your Custom Welcome Message!')

                    const msgerrEmbed = new MessageEmbed()
                        .setColor('#3d35cc')
                        .setDescription("‼️ - The message must include one **{}**, to mention the user!\n\n**Example:** Hello {}!, welcome to our server. Hope you'll enjoy!")

                    const welmsgyEmbed = new MessageEmbed()
                        .setColor('#3d35cc')
                        .setDescription(`✅ - The Custom Welcome Message is now set`)

                    //TODO COMPROBAR
                    const welcomeMessage = args.slice(2).join(" ")
                    if (!welcomeMessage) return message.reply({ embeds: [welmsgerrEmbed] })
                    if (!welcomeMessage.includes("{}")) return message.reply({ embeds: [msgerrEmbed] })

                    data.welcomeMessage = welcomeMessage;                 
                    message.reply({ embeds: [welmsgyEmbed] }); 
                }

                else if(args[1] === "image"){
                    const welimgerrEmbed = new MessageEmbed()
                    .setColor('#3d35cc')
                    .setDescription('‼️ - Please provide an Image Link to setup as Welcome Background!')
            
                    const linkerrEmbed = new MessageEmbed()
                        .setColor('#3d35cc')
                        .setDescription('‼️ - The image link you provided is not a valid one, you can only use image links uploaded to Discord in `.jpg` or `.png` format. Upload the image to Discord first & then copy-paste the link!')
                
                    const welimgyEmbed = new MessageEmbed()
                        .setColor('#3d35cc')
                        .setDescription(`✅ - [Image](${welcomeImage}) is now set as Welcome Background`)

                    const welcomeImage = args[2]
                    if (!welcomeImage) return message.reply({ embeds: [welimgerrEmbed] })
                    if (!welcomeImage.startsWith("https://cdn.discordapp.com/attachments/") && !welcomeImage.endsWith(".jpg") && !welcomeImage.endsWith(".png")) 
                        return message.reply({ embeds: [linkerrEmbed] })
            
                    data.welcomeImage = welcomeImage;
                    message.reply({ embeds: [welimgyEmbed] })
                }
            }

            else if(args[0]?.toLowerCase() === "remove"){
                toggling = ["message", "image"]
                if (!toggling.includes(args[1])) 
                    return message.reply({ embeds: [
                        new MessageEmbed()
                            .setColor("RED")
                            .setDescription("‼ - Please provide a valid option between `message` or `image`!")
                    ]})

                if(args[1] === "message"){
                    const welmsgnEmbed = new MessageEmbed()
                    .setColor('#3d35cc')
                    .setDescription(`✅ - The Custom Welcome Message has been removed & set to the Default one`)

                    const welmsganEmbed = new MessageEmbed()
                        .setColor('#3d35cc')
                        .setDescription(`‼️ - No Custom Welcome Message is set till now!`)

                    if (!data.welcomeMessage) return message.reply({ embeds: [welmsganEmbed] })
            
                    data.welcomeMessage = null;
                    message.reply({ embeds: [welmsgnEmbed] })
                }

                else if(args[1] === "image"){
                    const welimgnEmbed = new MessageEmbed()
                        .setColor('#3d35cc')
                        .setDescription(`✅ - Welcome Background is now set to [Default](https://cdn.discordapp.com/attachments/850306937051414561/877186344965783614/WallpaperDog-16344.jpg)`)
                
                    const welimganEmbed = new MessageEmbed()
                        .setColor('#3d35cc')
                        .setDescription(`‼️ - Welcome Background is already set to [Default](https://cdn.discordapp.com/attachments/850306937051414561/877186344965783614/WallpaperDog-16344.jpg)`)
        
                    const welcomeImage = args[2]
                    if (!welcomeImage) return message.reply({ embeds: [welimganEmbed] })
        
                    data.welcomeImage = null;
                    message.reply({ embeds: [welimgnEmbed] })
                }
            }
            
            data.save(err => {
                if (err) {
                    console.log(err);
                    return message.reply("An error occurred while trying to set the welcome feature!");
                }
            })
        })      
	}
}
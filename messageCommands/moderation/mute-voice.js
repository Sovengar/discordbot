const { Message, Client, MessageEmbed} = require("discord.js");
const { getMember } = require('../../functions/utils')

module.exports = {
    name: "mute-voice",
    aliases : ['mute-voice'],
    description: "Desactivates the ability to talk in a voice channel for a specified user!",
    userPermissions: ["MANAGE_CHANNELS",],
    botPermissions: ["MANAGE_ROLES",],
    cooldown: 5,
    usage: "<on/off> <member> \nExample: command on/off @user",
    /**
     * @Param {Client} client
     * @Param {Message} message
     * @Param {String[]} args
     */
    run: async (client, message, args) => {
        let toggling = ["on", "off"]
        if (!toggling.includes(args[0]?.toLowerCase())) 
            return message.reply({ embeds: [
                new MessageEmbed()
                    .setColor("RED")
                    .setDescription("‼ - Please provide a valid option between `on` or `off`!")
            ]})

        const member = getMember(client, message, args[1])
        if (!member) return message.reply("Please specify a member!")

        let role = message.guild.roles.cache.find( (role) => role.name.toLowerCase() === "antivc" )

        if(args[0]?.toLowerCase() === "on"){
            if(!role){
                try {
                    message.channel.send("Attempting to create antivc role!");
                    role = await message.guild.roles.create({
                        data: { name: "antivc", permissions: [], }
                    })

                    message.guild.channels.cache.filter( c => c.type === "GUILD_VOICE" )
                        .forEach( async channel => {
                            await channel.createOverwrite(role, {VIEW_CHANNEL: true, CONNECT: false,})
                        } )
                    
                    message.channel.send("Role has been created");
                } catch (error) {
                    console.log(error);
                }
            }

            await member.roles.add(role.id);
            message.reply(`${member} has been voice muted`)
        }

        else if(args[0]?.toLowerCase() === "off"){
            if(!role) return message.reply("The role doesnt exist!")
            if(!member.roles.cache.has(role.id)) return message.reply(`${member} is not voice muted`);

            member.roles.remove(role.id);
            message.reply(`${member} has been voice unmuted`);
        }
    },
};
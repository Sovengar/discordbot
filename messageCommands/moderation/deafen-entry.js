const { Message, Client, MessageEmbed} = require("discord.js");
const { getMember } = require('../../functions/utils')

module.exports = {
    name: "deafen-entry",
    aliases : ['deafen-entry'],
    description: "Member is banned from joining voice channels.",
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

        let role = message.guild.roles.cache.find( (role) => role.name.toLowerCase() === "deafened" )

        if(args[0]?.toLowerCase() === "on"){
            if(!role){
                try {
                    message.channel.send("Attempting to create deafened role!");
                    role = await message.guild.roles.create({ name: "deafened" }).catch(err => console.log(err))

                    message.guild.channels.cache.filter( c => c.type === "GUILD_VOICE" )
                        .forEach( async channel => {
                            await channel.permissionOverwrites.create(role, { VIEW_CHANNEL: true, CONNECT: false, });
                        } )
                    
                    message.channel.send("Role has been created");
                } catch (error) {
                    console.log(error);
                }
            }

            await member.roles.add(role.id);

            let isMemberOnVC = await member.voice.channel;
            if (isMemberOnVC) member.voice.disconnect()
            message.reply(`${member} now cannot enter voice channels!`)
        }

        else if(args[0]?.toLowerCase() === "off"){
            if(!role) return message.reply("The role doesnt exist!")
            if(!member.roles.cache.has(role.id)) return message.reply(`${member} is not deafened`);

            member.roles.remove(role.id);
            message.reply(`${member} can now enter on voice channels!`);
        }
    },
};
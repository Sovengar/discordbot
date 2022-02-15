const { Message, Client, MessageEmbed} = require("discord.js");

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
        const member = 
            message.mentions.members.first() || //Mention the member
            message.guild.members.cache.get(args[1]) || //Send member's id
            message.guild.members.cache.find( m => m.displayName.toLowerCase() === args[1].toLocaleLowerCase() ) || //Member displayname
            message.guild.members.cache.find( m => m.user.username.toLowerCase() === args[1].toLocaleLowerCase() ); //Type username
        if (!member) return message.reply("Please specify a member!")

        const role = message.guild.roles.cache.find( (role) => role.name.toLowerCase() === "antivc" )

        if(args[0] === "on"){
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

        else if(args[0] === "off"){
            if(!role) return message.reply("The role doesnt exist!")
            if(!member.roles.cache.has(role.id)) return message.reply(`${member} is not voice muted`);

            member.roles.remove(role.id);
            message.reply(`${member} has been voice unmuted`);
        }

        else return message.reply("Wrong arguments, check `help mute-voice` for more info")
    },
};
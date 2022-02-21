const { Message, Client, MessageAttachment, MessageEmbed } = require("discord.js");
const { join } = require("path/posix");
const { getMember } = require('../../functions/utils')

module.exports = {
    name: "userinfo",
    aliases: ['profile'],
    description: "Shows the profile of the user",
    usage: "[member]\nExample 1: command\nExample 2: command @randomUser",
    cooldown: 5,
    userPermissions: [,],
    botPermissions: [,],
    /**
     *
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */
    run: async (client, message, args) => {
        const roleColor =
            message.guild.me.displayHexColor === "#000000"
            ? "#ffffff"
            : message.guild.me.displayHexColor;

        //Checks if a user is provided else gets your data
        const member = getMember(client, message, args[0]) || message.member
        
        const devices = member.presence?.clientStatus || {};
    
        //Get all roles for the member except @everyone
        const roles = member.roles.cache
            .sort((a, b) => b.position - a.position)
            .map(role => role.toString())
            .slice(0, -1)

        //Check how many roles the user has, Discord doesnt allow showing more than 20.
        let rolesdisplay;
        if (roles.length <= 20) {
            rolesdisplay = roles.join(' ')
            if (roles.length < 1) 
                rolesdisplay = "None"
        } else {
            rolesdisplay = `${roles.slice(20).join(" ")} \`and more...\``
        }

        //Check join position
        const membersAux = message.guild.members.cache
            .sort( (a,b) => a.joinedTimestamp - b.joinedTimestamp )
        const members = Array.from(membersAux.values())

        const position = new Promise(ful => {
            for (let i = 1; i < members.length + 1; i++) {
                if(members[i-1].id === member.id) ful(i)
            }
        })

        //USER INFO EMBED
        const embed = new MessageEmbed()
            .setColor(roleColor)
            .setTitle('')
            .setURL('')
            .setAuthor({ name: `${member.user.tag}`, iconURL: member.user.displayAvatarURL({ dynamic: true }), url: '' })
            .setDescription(`<@!${(member.user.id)}>`)
            .setThumbnail(member.user.displayAvatarURL({ dynamic: true, size: 256}))
            .addField('**Presence**', `
                **❯ Devices logged in:** ${Object.entries(devices).length}
                **❯ Devices:** \n${Object.entries(devices).map( (value, index) => { return `${index +1}) ${value[0][0].toUpperCase() + value[0].slice(1)}`}).join("\n")}
                **❯ Status:** ${member.presence.status[0].toUpperCase() + member.presence.status.slice(1)} 
            `)
            .addFields(
                { name: '**Joined position**', value: `${await position} member to join the server!`, inline: true },
                { name: '**Joined**', value: `${new Date(member.joinedTimestamp).toLocaleDateString()}`, inline: true },
                { name: '**Registered**', value: `${new Date(member.user.createdTimestamp).toLocaleDateString()}`, inline: true },
                { name: '**Roles['+`${roles.length}`+']**', value: `${rolesdisplay ? rolesdisplay : 'None'}` },
                { name: `**Server**`, value: `${message.guild.name}`, inline: true },
                { name: '**Bot**', value: `${member.user.bot ? 'Yes' : 'No'}`, inline: true },
                { name: '**Nickname**', value: `${member.nickname || 'None'}`, inline: true },
                
                { name: "**Voice Channel**", value: member.voice.channel ? member.voice.channel.name + `(${member.voice.channel.id})` : `Not in a VC`, inline: true },
                //{ name: '\n', value: '\n' },
                //{ name: '\u200B', value: '\u200B' },  
            )
            .setImage()
            .setTimestamp()
            .setFooter({ text: `ID: ${member.user.id} `, iconURL: ''});

        message.reply({ embeds: [embed] });
    },
};



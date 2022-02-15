const { CommandInteraction, Client, MessageEmbed } = require("discord.js");

module.exports = {
    name: "userinfo",
    description: "Shows the profile of the user",
    type: 'CHAT_INPUT',
    cooldown: 5,
    usage: "[user]\nExample 1: command\nExample 2: command @randomUser",
    permissions: "",
    options: [
        {name: "member", description: "Choose a member", type: "USER", required: false,},
    ],
    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */
    run: async (client, interaction, args) => {
        const roleColor =
            interaction.guild.me.displayHexColor === "#000000"
            ? "#ffffff"
            : interaction.guild.me.displayHexColor;

        const user = interaction.options.getUser("member") || interaction.user;
        const member = interaction.guild.members.cache.get(user.id);
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

        const embed = new MessageEmbed()
            .setColor(roleColor)
            .setTitle('')
            .setURL('')
            .setAuthor({ name: `${user.tag}`, iconURL: user.displayAvatarURL({ dynamic: true }), url: '' })
            .setDescription(`<@!${(user.id)}>`)
            .setThumbnail(user.displayAvatarURL({ dynamic: true, size: 256}))
            .addField('**Presence**', `
                **❯ Devices logged in:** ${Object.entries(devices).length}
                **❯ Devices:** \n${Object.entries(devices).map( (value, index) => { return `${index +1}) ${value[0][0].toUpperCase() + value[0].slice(1)}`}).join("\n")}
                **❯ Status:** ${member.presence.status[0].toUpperCase() + member.presence.status.slice(1)} 
            `)
            .addFields(
                { name: 'Joined', value: `${new Date(member.joinedTimestamp).toLocaleDateString()}`, inline: true },
                { name: 'Registered', value: `${new Date(member.user.createdTimestamp).toLocaleDateString()}`, inline: true },
                { name: 'Roles['+`${roles.length}`+']', value: `${rolesdisplay ? rolesdisplay : 'None'}` },
                { name: `Server`, value: `${interaction.guild.name}`, inline: true },
                { name: 'Bot', value: `${member.user.bot ? 'Yes' : 'No'}`, inline: true },
                { name: 'Nickname', value: `${member.nickname || 'None'}`, inline: true },
                { name: "Voice Channel", value: member.voice.channel ? member.voice.channel.name + `(${member.voice.channel.id})` : `Not in a VC`, inline: true },
                //{ name: '\n', value: '\n' },
                //{ name: '\u200B', value: '\u200B' },  
            )
            .setImage()
            .setTimestamp()
            .setFooter({ text: `ID: ${user.id} `, iconURL: ''});

        interaction.reply({ embeds: [embed] });
    },
};
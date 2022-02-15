const { Client, ContextMenuInteraction, MessageEmbed } = require("discord.js");

module.exports = {
    name: "Profile",
    type: "USER",
    cooldown: 5,
    permissions: "",
    usage: "Right click the avatar of any user, choose Apps, choose the app",
    /**
     *
     * @param {Client} client
     * @param {ContextMenuInteraction} interaction
     * @param {String[]} args
     */
    run: async (client, interaction, args) => {
        const user = await client.users.fetch(interaction.targetId);
        const member = interaction.guild.members.cache.get(user.id);
        //const memberOfUserExecutingTheCommand = interaction.member;

        const roleColor =
            interaction.guild.me.displayHexColor === "#000000"
            ? "#ffffff"
            : interaction.guild.me.displayHexColor;
        
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
            .setAuthor({ name: `${member.user.tag}`, iconURL: member.user.displayAvatarURL({ dynamic: true }), url: '' })
            .setDescription(`<@!${(member.user.id)}>`)
            .setThumbnail(member.user.displayAvatarURL({ dynamic: true, size: 256}))
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
            .setFooter({ text: `ID: ${member.user.id} `, iconURL: ''});

        interaction.followUp({ embeds: [embed] });
    },
};
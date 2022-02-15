const { Client, CommandInteraction, MessageEmbed, MessageActionRow, MessageButton} = require("discord.js");
const ms = require("ms");

module.exports = {
    name : "kick",
    description: "Kicks a user",
    permissions: "KICK_MEMBERS",
    type: "CHAT_INPUT",
    cooldown: 5,
    usage: "<user> \nExample 1: command @randomUser \nExample 2: command userid \nExample 3: command displayname or username",
    options: [
        {name: 'member', description: 'Member to kick', type: 'USER', required: true},
        {name: 'reason', description: 'Reason for this kick', type: 'STRING', required: false},
    ],
    /**
    *
    * @param {Client} client
    * @param {CommandInteraction} interaction
    * @param {String[]} args
    */
    run : async (client, interaction, args) => {
        const member = interaction.options.getMember('member');
        const reason = interaction.options.getString('reason') || 'No reason provided';

        if(!member) 
            return interaction.followUp({ content: "The user provided is not valid in this guild, try using User id, name or mention the member!" });

        if(member.roles.highest.position >= interaction.member.roles.highest.position) 
            return interaction.followUp({ content: 'You cant take action on this user as their rol is higher than yours' });

        //Creating a Component to vote yes or no.
        const row = new MessageActionRow().addComponents(
            new MessageButton()
                .setStyle('DANGER')
                .setCustomId("kickyes")
                .setLabel("Yes"),
            
            new MessageButton()
                .setStyle("PRIMARY")
                .setCustomId("kickno")
                .setLabel("No"),
        );
        
        //Creating the embeds to work with
        let kickAskEmbed = new MessageEmbed()
            .setColor("RED")
            .setDescription("**Do you really want to kick this member?**");

        let kickEmbed = new MessageEmbed()
            .setColor("RED")
            .setDescription(`${member} has successfully been kicked for: ${reason}`);
        
        let kickEmbed2 = new MessageEmbed()
            .setColor("RED")
            .setDescription(`Cancelled kick request!`);

        //Logic
        const kickPage = await interaction.followUp({ embeds: [kickAskEmbed], components: [row] });

        const col = await kickPage.createMessageComponentCollector({
            componentType: "BUTTON",
            time: ms('10s')
        });

        col.on('collect', async interactionComponent => {
            if(interactionComponent.user.id !== interaction.user.id) return;
            if(interactionComponent.customId === 'kickyes'){
                await member.send(`You've been kicked from **${interaction.guild.name}** by ${interaction.user} for: ${reason}`);
                member.kick({ reason });
                kickPage.edit({ embeds: [kickEmbed], components: [] });
            } else if(interactionComponent.customId === 'kickno'){
                kickPage.edit({ embeds: [kickEmbed2], components: [] });
            }
        });
        
        col.on('end', () => {
            //kickPage.suppressEmbeds(true)
            //kickPage.edit({ embeds: [kickEndEmbed], components: [] });
        });
    },
};
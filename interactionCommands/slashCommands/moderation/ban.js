const { Client, CommandInteraction, MessageEmbed, MessageActionRow, MessageButton} = require("discord.js");
const ms = require("ms");

module.exports = {
    name : "ban",
    description: "Ban a user",
    permissions: "BAN_MEMBERS",
    type: "CHAT_INPUT",
    cooldown: 5,
    usage: "<user> \nExample 1: command @randomUser \nExample 2: command userid \nExample 3: command displayname or username",
    options: [
        {name: 'member', description: 'Member to ban', type: 'USER', required: true},
        {name: 'reason', description: 'Reason for this ban', type: 'STRING', required: false},  
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

        if(!member) return interaction.followUp({ content: "The user provided is not valid in this guild, try using User id, name or mention the member!" });

        if(member.roles.highest.position >= interaction.member.roles.highest.position) 
            return interaction.followUp({ content: 'You cant take action on this user as their rol is higher than yours' });

        //Creating a Component to vote yes or no.
        const row = new MessageActionRow().addComponents(
            new MessageButton()
                .setStyle('DANGER')
                .setCustomId("banyes")
                .setLabel("Yes"),
            
            new MessageButton()
                .setStyle("PRIMARY")
                .setCustomId("banno")
                .setLabel("No"),
        );
        
        //Creating the embeds to work with
        let banAskEmbed = new MessageEmbed()
            .setColor("RED")
            .setDescription("**Do you really want to ban this member?**");

        let banEmbed = new MessageEmbed()
            .setColor("RED")
            .setDescription(`${member} has successfully been banned for: ${reason}`);
        
        let banEmbed2 = new MessageEmbed()
            .setColor("RED")
            .setDescription(`Cancelled ban request!`);

        //Logic
        const banPage = await interaction.followUp({ embeds: [banAskEmbed], components: [row] });

        const col = await banPage.createMessageComponentCollector({
            componentType: "BUTTON",
            time: ms('10s')
        });

        col.on('collect', async interactionComponent => {
            if(interactionComponent.user.id !== interaction.user.id) return;
            if(interactionComponent.customId === 'banyes'){
                await member.send(`You've been banned from **${interaction.guild.name}** by ${interaction.user} for: ${reason}`);
                member.ban({ reason });
                banPage.edit({ embeds: [banEmbed], components: [] });
            } else if(interactionComponent.customId === 'banno'){
                banPage.edit({ embeds: [banEmbed2], components: [] });
            }
        });
        
        col.on('end', () => {
            //banPage.suppressEmbeds(true)
            //banPage.edit({ embeds: [banEndEmbed], components: [] });
        });
    },
};
const { Client, CommandInteraction, MessageEmbed, MessageActionRow, MessageButton} = require("discord.js");
const ms = require("ms");

module.exports = {
    name : "unban",
    description: "Unban a user",
    permissions: "BAN_MEMBERS",
    type: "CHAT_INPUT",
    cooldown: 5,
    usage: "<user> \nExample: command userid",
    options: [
        {name: 'userid', description: 'userid that you want to unban', type: 'STRING', required: true}, 
    ],
    /**
    *
    * @param {Client} client
    * @param {CommandInteraction} interaction
    * @param {String[]} args
    */
    run : async (client, interaction, args) => {
        const userId = interaction.options.getString('userid');

        if(!userId) 
            return interaction.followUp({ content: "The user provided is not valid in this guild, try using User id, name or mention the member!" });

        if(isNaN(userId))
            return interaction.followUp("The user ID only has numbers!");

        const bannedMembers = await interaction.guild.bans.fetch();
            if(!bannedMembers.find( user => user.user.id === userId ))
                return interaction.followUp(`${user.user} is not banned!`);

        //Creating a Component to vote yes or no.
        const row = new MessageActionRow().addComponents(
            new MessageButton()
                .setStyle('DANGER')
                .setCustomId("unbanyes")
                .setLabel("Yes"),
            
            new MessageButton()
                .setStyle("PRIMARY")
                .setCustomId("unbanno")
                .setLabel("No"),
        );
        
        //Creating the embeds to work with
        let unbanAskEmbed = new MessageEmbed()
            .setColor("RED")
            .setDescription("**Do you really want to unban this user?**");

        let unbanEmbed = new MessageEmbed()
            .setColor("RED");
            client.users.fetch(userId).then((user) => {
                unbanEmbed.setDescription(`${user.username} has successfully been unbanned!`);
            });
        
        let unbanEmbed2 = new MessageEmbed()
            .setColor("RED")
            .setDescription(`Cancelled unban request!`);

        //Logic
        const unbanPage = await interaction.followUp({ embeds: [unbanAskEmbed], components: [row] });

        const col = await unbanPage.createMessageComponentCollector({
            componentType: "BUTTON",
            time: ms('10s')
        });

        col.on('collect', async interactionComponent => {
            if(interactionComponent.user.id !== interaction.user.id) return;
            if(interactionComponent.customId === 'unbanyes'){
                interaction.guild.members.unban(userId);
                unbanPage.edit({ embeds: [unbanEmbed], components: [] });
            } else if(interactionComponent.customId === 'unbanno'){
                unbanPage.edit({ embeds: [unbanEmbed2], components: [] });
            }
        });
        
        col.on('end', () => {
            //unbanPage.suppressEmbeds(true)
            //unbanPage.edit({ embeds: [unbanEndEmbed], components: [] });
        });
    },
};


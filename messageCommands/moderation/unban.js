const { Message, Client, MessageEmbed, MessageActionRow, MessageButton} = require("discord.js");
const ms = require("ms");

module.exports = {
    name : 'unban',
    aliases : ['unban'],
    description: "Unbans a user",
    userPermissions: ["BAN_MEMBERS",],
    botPermissions: ["BAN_MEMBERS",],
    cooldown: 5,
    usage: "<user> \nExample: command userid",
    /**
     *
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
    */
    run: async (client, message, args) => {
        const userId = args[0];
        if(!userId) 
            return message.reply("Please send an id");
        
        if(isNaN(userId))
            return message.reply("The user ID only has numbers!");

        const bannedMembers = await message.guild.bans.fetch();
        if(!bannedMembers.find( user => user.user.id === userId ))
            return message.reply("User is not banned!");
        
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
        const unbanPage = await message.reply({ embeds: [unbanAskEmbed], components: [row] });

        const col = await unbanPage.createMessageComponentCollector({
            componentType: "BUTTON",
            time: ms('10s')
        });

        col.on('collect', async interaction => {
            if(interaction.user.id !== message.author.id) return;
            if(interaction.customId === 'unbanyes'){
                message.guild.members.unban(userId);
                unbanPage.edit({ embeds: [unbanEmbed], components: [] });
            } else if(interaction.customId === 'unbanno'){
                unbanPage.edit({ embeds: [unbanEmbed2], components: [] });
            }
        });
        
        col.on('end', () => {
            //kickPage.suppressEmbeds(true)
            //unbanPage.edit({ embeds: [unbanEndEmbed], components: [] });
        });
    },
};
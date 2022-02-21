const { Message, Client, MessageEmbed, MessageActionRow, MessageButton} = require("discord.js");
const ms = require("ms");

module.exports = {
    name : 'ban',
    aliases : ['ban'],
    description: "Ban a user",
    userPermissions: ["BAN_MEMBERS",],
    botPermissions: ["BAN_MEMBERS",],
    cooldown: 5,
    usage: "<user> \nExample 1: command @randomUser \nExample 2: command userid \nExample 3: command displayname or username",
    /**
     *
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
    */
    run: async (client, message, args) => {
        const member = getMember(client, message, args[0]) 
        if(!member) return message.reply("The user provided is not valid in this guild, try using User id, name or mention the member!");
        if(message.member.roles.highest.position <= member.roles.highest.position) return message.reply("You cannot punish someone with the same or higher role");
        
        const reason = args.slice(1).join(" ") || "No reason provided.";

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
        const banPage = await message.reply({ embeds: [banAskEmbed], components: [row] });

        const col = await banPage.createMessageComponentCollector({
            componentType: "BUTTON",
            time: ms('10s')
        });

        col.on('collect', async interaction => {
            if(interaction.user.id !== message.author.id) return;
            if(interaction.customId === 'banyes'){
                await member.send(`You've been banned from **${message.guild.name}** by ${message.author} for: ${reason}`);
                member.ban({ reason });
                banPage.edit({ embeds: [banEmbed], components: [] });
            } else if(interaction.customId === 'banno'){
                banPage.edit({ embeds: [banEmbed2], components: [] });
            }
        });
        
        col.on('end', () => {
            //kickPage.suppressEmbeds(true)
            //banPage.edit({ embeds: [banEndEmbed], components: [] });
        });
    },
};
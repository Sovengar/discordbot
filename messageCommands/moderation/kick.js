const { Message, Client, MessageEmbed, MessageActionRow, MessageButton} = require("discord.js");
const ms = require("ms");

module.exports = {
    name : 'kick',
    aliases : ['kick'],
    description: "Kicks a user",
    userPermissions: ["KICK_MEMBERS",],
    botPermissions: ["KICK_MEMBERS",],
    cooldown: 5,
    usage: "<user> \nExample 1: command @randomUser \nExample 2: command userid \nExample 3: command displayname or username",
    /**
     *
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
    */
    run: async (client, message, args) => {
        const member = 
            message.mentions.members.first() || //Mention the member
            message.guild.members.cache.get(args[0]) || //Send member's id
            message.guild.members.cache.find( m => m.displayName.toLowerCase() === args[0].toLocaleLowerCase() ) || //Member displayname
            message.guild.members.cache.find( m => m.user.username.toLowerCase() === args[0].toLocaleLowerCase() ); //Type username
        
        const reason = args.slice(1).join(" ") || "No reason provided.";
        
        if(!member) 
            return message.reply("The user provided is not valid in this guild, try using User id, name or mention the member!");

        if(message.member.roles.highest.position <= member.roles.highest.position)
            return message.reply("You cannot punish someone with the same or higher role");

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
        const kickPage = await message.reply({ embeds: [kickAskEmbed], components: [row] });

        const col = await kickPage.createMessageComponentCollector({
            componentType: "BUTTON",
            time: ms('10s')
        });

        col.on('collect', async interaction => {
            if(interaction.user.id !== message.author.id) return;
            if(interaction.customId === 'kickyes'){
                await member.send(`You've been kicked from **${message.guild.name}** by ${message.author} for: ${reason}`);
                member.kick({ reason });
                kickPage.edit({ embeds: [kickEmbed], components: [] });
            } else if(interaction.customId === 'kickno'){
                kickPage.edit({ embeds: [kickEmbed2], components: [] });
            }
        });
        
        col.on('end', () => {
            //kickPage.suppressEmbeds(true)
            //kickPage.edit({ embeds: [kickEndEmbed], components: [] });
        });
    },
};
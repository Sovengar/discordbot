const { Message, Client, MessageEmbed} = require("discord.js");

module.exports = {
    name: "lockdown",
    aliases : ['lockdown'],
    description: "Desactivates chatting in the server!",
    userPermissions: ["ADMINISTRATOR",],
    botPermissions: ["ADMINISTRATOR",],
    cooldown: 5,
    usage: "<on/off> \nExample: command on/off ",
    /**
     * @Param {Client} client
     * @Param {Message} message
     * @Param {String[]} args
     */
    run: async (client, message, args) => {
        let toggling = ["on", "off"]
        if (!toggling.includes(args[0]?.toLowerCase())) 
            return message.reply({ embeds: [
                new MessageEmbed()
                    .setColor("RED")
                    .setDescription("‼ - Please provide a valid option between `on`, `off` or `status`!")
            ]})

        const role = message.guild.roles.everyone; 
        const perms = role.permissions.toArray();

        if(args[0]?.toLowerCase() === 'on') {
            const newPerms = perms.filter((perm) => perm !== 'SEND_MESSAGES');
            await role.edit({ permissions: newPerms });
            message.reply("Server is locked!");
        } 
        
        else if(args[0]?.toLowerCase() === 'off') {
            perms.push('SEND_MESSAGES');
            await role.edit({ permissions: perms });
            message.reply("Server is unlocked!");
        }

    },
};
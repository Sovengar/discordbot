const { Message, Client, MessageEmbed} = require("discord.js");

module.exports = {
    name: "lockdown",
    aliases : ['lockdown'],
    description: "Locks down any user who is not an admin on any channel",
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
        const role = message.guild.roles.everyone; 

        if (!args.length) return message.reply('please specify an option, check `help lockdown` for more info.');

        const query = args[0].toLowerCase()
        const perms = role.permissions.toArray();

        if(query === 'on') {
            const newPerms = perms.filter((perm) => perm !== 'SEND_MESSAGES');
            await role.edit({ permissions: newPerms });
            message.reply("Server is locked!");
        } 
        
        else if(query === 'off') {
            perms.push('SEND_MESSAGES');
            await role.edit({ permissions: perms });
            message.reply("Server is unlocked!");
        }

        else return message.reply('The option you have stated is not valid, check `help lockdown` for more info.');
    },
};
const { Message, Client, MessageEmbed} = require("discord.js");

module.exports = {
    name: "coinflip",
    aliases: ["flipcoin"],
    description: "Flips a coin!",
    usage: '',
    cooldown: 1,
    userPermissions: [,],
    botPermissions: [,],
    /**
     *
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
    */
    run: async (client, message, args) => {
        function doRandHT() {
            var rand = ['HEADS!','TAILS!'];
            return rand[Math.floor(Math.random()*rand.length)];
        }
        
        message.channel.send({ embeds: [
            new MessageEmbed()
                .setTitle('Here is the winner!')
                .setDescription(doRandHT())
        ]});
    },
};
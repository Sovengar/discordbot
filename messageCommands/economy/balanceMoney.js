const { Message, Client, } = require("discord.js");
const Money = require("../../models/money")

module.exports = {
    name: 'balance',
    aliases : ['currency'],
    description: "Shows money in Economy Account",
    cooldown: 5,
    usage: "<amount> <@user>",
    userPermissions: [,],
    botPermissions: [,],
    /**
     *
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
    */
    run: async (client, message, args) => {
        let member

        ///CHECKING ARGUMENTS AND GETTING MEMBER
        if(args.length > 1)
            return message.reply({ content: "This command only requires 1 argument" })

        if (!args[0]) {
            member = message.member
        } else {
            member = 
                message.mentions.members.first() || 
                message.guild.members.cache.get(args[0]) || 
                message.guild.members.cache.find(m => m.displayName.toLowerCase() === args[0].toLocaleLowerCase()) || 
                message.guild.members.cache.find(m => m.user.username.toLowerCase() === args[0].toLocaleLowerCase())

            if (!member) 
                return message.reply({ content: "Can't find the member!" })
        }

        ///CHECKING THE CURRENT BALANCE OF THE USER
        const userBalance = (id) => new Promise(async ful => {
            const data = await Money.findOne({ memberId: id })
            if (!data) 
                return ful(0)
        
            ful(data.memberCoins)
        })
        const userBal = await userBalance(member.id)

        message.reply({ content: `${member}'s current balance is : \`${userBal} Coins\`` }) 
    },
};
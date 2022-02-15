const { Message, Client, } = require("discord.js");
const Money = require("../../models/money")

module.exports = {
    name: 'money-add',
    aliases : ['addmoney'],
    description: "Adds money to Economy Account",
    userPermissions: ["ADMINISTRATOR",],
    botPermissions: ["ADMINISTRATOR",],
    cooldown: 5,
    usage: "<amount> <@user>",
    /**
     *
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
    */
    run: async (client, message, args) => {
        let member, coinsAdd

        ///CHECKING ARGUMENTS AND GETTING MEMBER AND COINS
        if(args.length > 2)
            return message.reply({ content: "This command only requires 2 arguments" })
        
        if(args.length === 1){
            member = message.member
            coinsAdd = args[0]
        } else {
            member = 
                message.mentions.members.first() || 
                message.guild.members.cache.get(args[0]) || 
                message.guild.members.cache.find(m => m.displayName.toLowerCase() === args[0].toLocaleLowerCase()) || 
                message.guild.members.cache.find(m => m.user.username.toLowerCase() === args[0].toLocaleLowerCase())
            
            coinsAdd = args[1]

            if (!member) 
                return message.reply({ content: "Can't find the member!" })
        }

        if (!coinsAdd) 
            return message.reply("Mention the amount of coins!")
        
        if (isNaN(coinsAdd)) 
            return message.reply("Coins amount must be an integer!")

        ///Adding the coins to the user
        Money.findOne({ memberId: member.id }, async (err, data) => {
            if (err) throw err
            if (data) {
                data.memberCoins += parseInt(coinsAdd)
            } else {
                data = new Money({ memberId: member.id, memberCoins: parseInt(coinsAdd) })
            }
            data.save()
        })
        message.reply({ content: `${message.author} has added \`${coinsAdd} Coins\` to ${member}'s Account'` })
    }
}
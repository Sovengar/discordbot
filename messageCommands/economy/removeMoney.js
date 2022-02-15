const { Message, Client, } = require("discord.js");
const Money = require("../../models/money")

module.exports = {
    name: 'money-rmv',
    aliases : ['removemoney', 'money-del'],
    description: "Removes money of the user",
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
        let member, coinsRmv

        ///CHECKING ARGUMENTS AND GETTING MEMBER AND COINS
        if(args.length > 2)
            return message.reply({ content: "This command only requires 2 arguments" })
        
        if(args.length === 1){
            member = message.member
            coinsRmv = args[0]
        } else {
            member = 
                message.mentions.members.first() || 
                message.guild.members.cache.get(args[0]) || 
                message.guild.members.cache.find(m => m.displayName.toLowerCase() === args[0].toLocaleLowerCase()) || 
                message.guild.members.cache.find(m => m.user.username.toLowerCase() === args[0].toLocaleLowerCase())
            
            coinsRmv = args[1]

            if (!member) 
                return message.reply({ content: "Can't find the member!" })
        }

        if (!coinsRmv) 
            return message.reply("Mention the amount of coins!")

        if (isNaN(coinsRmv)) 
            return message.reply("Coins amount must be an integer!")

        ///CHECKING THE CURRENT BALANCE OF THE USER
        const userBalance = (id) => new Promise(async ful => {
            const data = await Money.findOne({ memberId: id })
            if (!data) 
                return ful(0)
        
            ful(data.memberCoins)
        })
        const userBal = await userBalance(member.id)

        ///CHECKING IF THE USER HAS ENOUGH COINS TO BE REMOVED
        if (coinsRmv > userBal) 
            return message.reply(`${member} doesn't have enough coins to be removed!`)

        ///RETIRING THE COINS OF THE USER
        Money.findOne({ memberId: member.id }, async (err, data) => {
            if (err) throw err
            if (data) {
                data.memberCoins -= parseInt(coinsRmv)
            } else {
                data = new Money({ memberId: member.id, memberCoins: - parseInt(coinsRmv) })
            }
            data.save()
        })
        message.reply({ content: `${message.author} has removed \`${coinsRmv} Coins\` of ${member}'s Account'` })
    },
};
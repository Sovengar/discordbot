const { Message, Client, MessageEmbed, } = require("discord.js");
const Money = require("../../models/money")
const { getMember } = require('../../functions/utils')

module.exports = {
    name: 'money',
    aliases : ['money'],
    description: "Manages the member economy account. Add, remove or show the balance.",
    userPermissions: ["ADMINISTRATOR",],
    botPermissions: ["ADMINISTRATOR",],
    cooldown: 5,
    usage: "Example 1: command add/remove amount @member \nExample 2: command balance @member",
    /**
     *
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
    */
    run: async (client, message, args) => {
        let toggling = ["add", "remove", "balance"]
        if (!toggling.includes(args[0]?.toLowerCase())) 
            return message.reply({ embeds: [
                new MessageEmbed()
                    .setColor("RED")
                    .setDescription("‼ - Please provide a valid option between `add`, `remove` or `balance`!")
            ]})
        
        let member = getMember(client, message, args[1]) || getMember(client, message, args[2])
        if(!member) return message.reply("Invalid member!")

        Money.findOne({ memberId: member.id }, async (err, data) => {
            if (err) throw err
            
            if(!data){
                data = new Money({ memberId: member.id })
                data.save().catch(err => console.log(err))
			} 
            
            if(args[0] === 'balance'){
                let member = getMember(client, message, args[1])
                if(!member) return message.reply("Invalid member!")

                const userBalance = (id) => new Promise(async ful => {
                    if (!data) return ful(0)
                    ful(data.memberCoins)
                })
                const userBal = await userBalance(member.id)
                return message.reply({ content: `${member}'s current balance is : \`${userBal} Coins\`` }) 
            }

            else if(args[0] === 'add'){
                let member = getMember(client, message, args[2])
                if(!member) return message.reply("Invalid member!")

                const coinsAdd = args[1]
                if (!coinsAdd) return message.reply("Mention the amount of coins!")
                if (isNaN(coinsAdd)) return message.reply("Coins amount must be an integer!")
                data.memberCoins += parseInt(coinsAdd)
                message.reply({ content: `${message.author} has added \`${coinsAdd} Coins\` to ${member}'s Account'` })
            }

            else if(args[0] === 'remove'){
                let member = getMember(client, message, args[2])
                if(!member) return message.reply("Invalid member!")

                coinsRmv = args[1]
                if (!coinsRmv) return message.reply("Mention the amount of coins!")
                if (isNaN(coinsRmv)) return message.reply("Coins amount must be an integer!")

                const userBalance = (id) => new Promise(async ful => {
                    if (!data) return ful(0)
                    ful(data.memberCoins)
                })

                const userBal = await userBalance(member.id)
                if (coinsRmv > userBal) return message.reply(`${member} doesn't have enough coins to be removed!`)

                data.memberCoins -= parseInt(coinsRmv)  
                message.reply({ content: `${message.author} has removed \`${coinsRmv} Coins\` of ${member}'s Account'` })
            }

            data.save(err => {
				if (err) {
					console.log(err);
					return message.reply("An error occurred while trying to set the money!");
				}
			}) 
        }) 
    }
}
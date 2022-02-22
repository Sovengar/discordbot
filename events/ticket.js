const { Client, CommandInteraction, MessageEmbed, MessageActionRow, MessageButton, MessageAttachment } = require("discord.js")
const client = require("../client/discordBot")
const ticketTranscript = require("../models/ticketTranscript");
const fs = require('fs')

module.exports = { name: "ticket", };

client.on('messageCreate', async(message) => {
    //if(message.channel.parentID !== '756890395392081985') return;
    const channelName = `ticket-${message.author.id}`
    if(message.channel.name !== channelName) return; 

    ticketTranscript.findOne({ Channel : message.channel.id }, async(err, data) => {
        if(err) throw err;
        if(data) {
           data.Content.push(`${message.author.tag} : ${message.content}`) 
        } else {
            data = new ticketTranscript({ Channel : message.channel.id, Content: `${message.author.tag} : ${message.content}`})
        }
        await data.save().catch(err =>  console.log(err))
    })
})

client.on("interactionCreate", async (interaction) => {
    if (interaction.isButton()) {
        if (interaction.customId === 'delticket') {
            const channel = interaction.channel

            channel.send('Deleting ticket in 10 seconds.....')

            ticketTranscript.findOne({ Channel : channel.id }, async(err, data) => {
                if(err) throw err;
                if(data) {
                    await fs.writeFileSync(`../ticket-${channel.id}.txt`, data.Content.join("\n\n"))
                    //channel.send(`${interaction.guild.members.cache.get(ch.name).user.username}'s ticket have been closed.`)
                    channel.send(`${interaction.member}'s ticket have been closed.`)
                    const attachment = new MessageAttachment(fs.createReadStream(`../ticket-${channel.id}.txt`))
                    await channel.send({ files: [attachment] });
                    ticketTranscript.findOneAndDelete({ Channel : channel.id })
                }
            })

            setTimeout(() => {
                channel.delete().then(async ch=> {})
            }, 10000)
        }
    }
})
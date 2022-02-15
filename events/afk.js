const client = require("../client/discordBot")
const { afk } = require('../collections/index')
const moment = require('moment');

module.exports = { name: "afk", };

client.on("messageCreate", (message) => {
    if(!message.guild || message.author.bot) return;

    const mentionedMember = message.mentions.members.first();
    if(mentionedMember){
        const data = afk.get(mentionedMember.id)
        if(!data) return;

        const [ timestamp, reason] = data;
        const timeAgo = moment(timestamp).fromNow();
        message.reply(`${mentionedMember} is currently afk (${timeAgo})\nReason: ${reason}`);  
    }

    const getData = afk.get(message.author.id);
    if(!getData) return;
    afk.delete(message.author.id);
    message.reply(`${message.member} afk has been removed!`);
});
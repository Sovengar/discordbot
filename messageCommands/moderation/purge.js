const { Message, Client } = require("discord.js");
const ms = require('ms');
const { getMember } = require('../../functions/utils')

module.exports = {
    name : 'purge',
    aliases : ['purge'],
    description: "Delete x messages from the channel or a user",
    userPermissions: ["MANAGE_MESSAGES",],
    botPermissions: ["MANAGE_MESSAGES",], 
    usage: "<number> [UserMention] \nExample 1: command 5 \nExample 2: command 5 @randomUser",
    cooldown: 5,
    /**
     *
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
    */
    run: async (client, message, args) => {
        const numMessages = parseInt(args[0]);
        if(!numMessages) return message.reply('Please specify a number of messages to delete ranging from 1 - 99');
        if(isNaN(numMessages)) return message.reply('Only numbers are allowed');
        if(numMessages > 99) return message.reply('The max amount of messages that I can delete is 99');

        const allMessages = message.channel.messages.fetch();
        const member = getMember(client, message, args[1])
        
        if (member) {
            const userMessages = (await allMessages).filter((m) => m.author.id === member.id);
            const userMessagesToDelete = [];
            const size = userMessages.size;
            let counter = 0;
            if(size <= numMessages) {
                if(size === 0){
                    message.reply(`User ${member} doesnt have messages to delete.`);
                } else {
                    await message.channel.bulkDelete(userMessages, true) //bulkDelete true to bypass the 14 days error.
                    .then( () => {
                        message.channel.send({ content: 'Deleted ' + numMessages  + ` messages of user ${member}`, allowedMentions: { repliedUser: true}})
                        .then((msg) => {setTimeout( () => msg.delete(), ms('4 seconds') )});
                    })
                    .catch(err => { 
                        if(err.code !==10008) return console.log(err);
                    });
                    message.delete();
                }
            } else {
                for (const [key, value] of userMessages.entries()) {
                    counter++;
                    if(counter >= numMessages) {
                        userMessagesToDelete.push(key);
                        break;
                    } 
                    userMessagesToDelete.push(key);
                }
                await message.channel.bulkDelete(userMessagesToDelete, true) //bulkDelete true to bypass the 14 days error.
                .then( () => {
                    message.channel.send({ content: 'Deleted ' + numMessages  + ` messages of user ${member}`, allowedMentions: { repliedUser: true}})
                    .then((msg) => {setTimeout( () => msg.delete(), ms('4 seconds') )});
                })
                .catch(err => { 
                    if(err.code !==10008) return console.log(err);
                });
                message.delete().catch();
            }
        } else {
            await message.channel.bulkDelete(numMessages + 1, true) //bulkDelete true to bypass the 14 days error.
            .then( () => {
                message.channel.send({ content: 'Deleted ' + numMessages  + ` messages for user ${message.author}`, allowedMentions: { repliedUser: true}})
                .then((msg) => {setTimeout( () => msg.delete(), ms('4 seconds') )});
            })
            .catch(err => { 
                if(err.code !==10008) return console.log(err);
            });  
        }
    },
};
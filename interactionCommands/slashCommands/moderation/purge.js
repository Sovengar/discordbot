const { Client, CommandInteraction } = require("discord.js");
const ms = require('ms');

module.exports = {
    name : 'purge',
    description: "Delete x messages from the channel or a user",
    permissions: "MANAGE_MESSAGES",
    type: 'CHAT_INPUT',
    cooldown: 5,
    usage: "<number> [UserMention] \nExample 1: command 5 \nExample 2: command 5 @randomUser",
    options: [
        {
            name: "amount",
            description: "amount of messages that is gonna be deleted",
            type: "INTEGER",
            required: true,
        },
        {
            name: "user",
            description: "delete messages for user",
            type: "USER",
            required: false,
        }
    ],
        /**
        *
        * @param {Client} client
        * @param {CommandInteraction} interaction
        * @param {String[]} args
        */
    run : async (client, interaction, args) => {
       const numMessages = interaction.options.getInteger("amount");
       const allMessages = await interaction.channel.messages.fetch();

       let member = null;

       if(numMessages > 99) return interaction.followUp({content: "The maximum amount of messages you can delete is 99 messages",});
       if(numMessages < 1) return interaction.followUp({content: "You can't delete less than 1 message",});

        try {
            member = interaction.options.getUser("user");
        } catch (error) {
            //console.error(error);
        }

        if (member) {
            const userMessages = (await allMessages).filter((m) => m.author.id === member.id);
            const userMessagesToDelete = [];
            const size = userMessages.size;
            let counter = 0;

            if(size <= numMessages) {
                if(size === 0){
                    interaction.followUp(`User ${member} doesnt have messages to delete.`);
                } else {
                    interaction.channel.bulkDelete(userMessages, true) //Maybe needs await here. bulkDelete true to bypass the 14 days error.
                    .then( () => {
                        interaction.channel.bulkDelete(1); //Deletes the 'botname is thinking'
                        interaction.channel.send({ content: 'Deleted ' + numMessages  + ` messages of user ${member}`, allowedMentions: { repliedUser: true}})
                        .then((msg) => {setTimeout( () => msg.delete(), ms('4 seconds') )});
                    })
                    .catch(err => { 
                        if(err.code !==10008) return console.log(err);
                    });
                    console.log("b");
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
                interaction.channel.bulkDelete(userMessagesToDelete, true) //Maybe needs await here. bulkDelete true to bypass the 14 days error.
                .then( () => {
                    interaction.channel.bulkDelete(1); //Deletes the 'botname is thinking'
                    interaction.channel.send({ content: 'Deleted ' + numMessages  + ` messages of user ${member}`, allowedMentions: { repliedUser: true}})
                    .then((msg) => {setTimeout( () => msg.delete(), ms('4 seconds') )});
                })
                .catch(err => { 
                    if(err.code !==10008) return console.log(err);
                });    
            }
        } else {
            await interaction.channel.bulkDelete(allMessages, true) //bulkDelete true to bypass the 14 days error.
            .then( () => {
                interaction.channel.send({ content: `Deleted ${allMessages.size - 1} messages`, allowedMentions: { repliedUser: true}})
                .then((msg) => {setTimeout( () => msg.delete(), ms('4 seconds') )});
            })
            .catch(err => {
                if(err.code !==10008) return console.log(err);
            });
        }
        
    }
}
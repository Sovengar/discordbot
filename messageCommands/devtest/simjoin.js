module.exports = {
    name: 'simjoin',
    aliases: ["join"],
    description: "Simulates join event",
    permissions: "",
    run: async (client, message, args) => {
        if(message.author.id !== client.config.owner_id) 
            return message.reply("This command is classified!")

        client.on("guildMemberAdd", member => {
            message.channel.send("Simulated join event")
        })

        client.emit("guildMemberAdd", message.member)
    },
};
module.exports = {
    name: 'simleave',
    aliases: ["leave"],
    description: "Simulates leave event",
    permissions: "",
    run: async (client, message, cmd, args, Discord) => {
        if(message.author.id !== client.config.owner_id) return message.reply("This command is classified!")

        client.on("guildMemberRemove", member => {
            message.channel.send("Simulated leave event")
        })

        client.emit("guildMemberRemove", message.member)
    },
};
const { Client, MessageEmbed } = require("discord.js")
const GuildSettings = require("../models/GuildSettings");

/**
 * @param {Client} client
 */
module.exports = async (client) => {

    //Create a private text channel named error-logs copy his id and paste it here.
    const errChannel = client.config.errorLogsChannel;

    process.on('unhandledRejection', (reason, p) => {
        console.log(" [Anti-crash] :: Unhandled Rejection/Catch")
        console.log(reason, p)

        const errEmbed = new MessageEmbed()
            .setColor("RED")
            .setTitle("⚠ New Error")
            .setDescription("An error just occured in the bot console!**\n\nERROR:\n\n** ```" + reason + "\n\n" + p + "```")
            .setTimestamp()
            .setFooter({ text: 'Anti-Crash System', iconURL: ''})

        client.channels.cache.get(errChannel).send({ embeds: [errEmbed] })
    })

    process.on('uncaughtException', (err, origin) => {
        console.log(" [Anti-crash] :: Uncaught Exception/Catch")
        console.log(err, origin)

        const errEmbed = new MessageEmbed()
            .setColor("RED")
            .setTitle("⚠ New Error")
            .setDescription("An error just occured in the bot console!**\n\nERROR:\n\n** ```" + err + "\n\n" + origin + "```")
            .setTimestamp()
            .setFooter({ text: 'Anti-Crash System', iconURL: ''})

        client.channels.cache.get(errChannel).send({ embeds: [errEmbed] })
    })

    process.on('uncaughtExceptionMonitor', (err, origin) => {
        console.log(" [Anti-crash] :: Uncaught Exception/Catch (MONITOR)")
        console.log(err, origin)

        const errEmbed = new MessageEmbed()
            .setColor("RED")
            .setTitle("⚠ New Error")
            .setDescription("An error just occured in the bot console!**\n\nERROR:\n\n** ```" + err + "\n\n" + origin + "```")
            .setTimestamp()
            .setFooter({ text: 'Anti-Crash System', iconURL: ''})

        client.channels.cache.get(errChannel).send({ embeds: [errEmbed] })
    })

    process.on('multipleResolves', (type, promise, reason) => {
        console.log(" [Anti-crash] :: Multiple Resolves")
        console.log(type, promise, reason)

        const errEmbed = new MessageEmbed()
            .setColor("RED")
            .setTitle("⚠ New Error")
            .setDescription("An error just occured in the bot console!**\n\nERROR:\n\n** ```" + type + "\n\n" + promise + "\n\n" + reason + "```")
            .setTimestamp()
            .setFooter({ text: 'Anti-Crash System', iconURL: ''})

        client.channels.cache.get(errChannel).send({ embeds: [errEmbed] })
    })
}
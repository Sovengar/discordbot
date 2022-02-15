const { Client, MessageEmbed, CommandInteraction } = require("discord.js");
const os = require("os")
const moment = require("moment")
const cpuStat = require("cpu-stat")
const { connection } = require("mongoose")
require("../../../events/discordEvents/ready")

module.exports = {
    name: "botinfo",
    description: "Sends the bot's information and status",
    cooldown: 5,
    usage: "",
    permissions: "",
    type: 'CHAT_INPUT',
    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
    */
    run: async (client, interaction, args) => {
        const days = Math.floor(client.uptime / 86400000)
        const hours = Math.floor(client.uptime / 3600000) % 24
        const minutes = Math.floor(client.uptime / 60000) % 60
        const seconds = Math.floor(client.uptime / 1000) % 60

        cpuStat.usagePercent(function (error, percent) {

            if (error) 
                return interaction.followUp(error)

            const memoryUsage = formatBytes(process.memoryUsage().heapUsed)
            const node = process.version
            const CPU = percent.toFixed(2)
            const CPUModel = os.cpus()[0].model
            const cores = os.cpus().length

            const embed = new MessageEmbed()
                .setAuthor({ name: `${client.user.username}`, iconURL: client.user.displayAvatarURL({ dynamic: true }), url: '' },)
                .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
                .setTimestamp()
                .setColor("RED")
                .setDescription(`**Client:** \`🟢 ONLINE\` - \`${client.ws.ping}ms\`\n**Uptime:** <t:${parseInt(client.readyTimestamp / 1000)}:R>\n\n**Database:** \`${switchTo(connection.readyState)}\``)
                .addFields([
                    { name: "Name", value: `${client.user.tag}`, inline: true },
                    { name: "ID", value: `${client.user.id}`, inline: true },
                    { name: "Created At", value: `${moment.utc(client.user.createdAt).format('LLLL')}`, inline: true },
                    { name: "Added to Server", value: `${moment.utc(client.joinedAt).format('LLLL')}`, inline: true },
                    { name: "Servers", value: `${client.guilds.cache.size}`, inline: true },
                    { name: "Members in All Servers", value: `${client.users.cache.size}`, inline: true },
                    { name: "Channels in All Servers", value: `${client.channels.cache.size.toLocaleString()}`, inline: true },
                    { name: "Uptime", value: `\`${days}\` days, \`${hours}\` hours, \`${minutes}\` minutes, \`${seconds}\` seconds`, inline: true },
                    { name: "Node Version", value: `${node}`, inline: true },
                    { name: "Memory Usage", value: `${memoryUsage}`, inline: true },
                    { name: "CPU Usage", value: `${CPU}`, inline: true },
                    { name: "CPU Model", value: `${CPUModel}`, inline: true },
                    { name: "Cores", value: `${cores}`, inline: true },
                ])
            interaction.followUp({ embeds: [embed] })
        });

        function formatBytes(a, b) {
            let c = 1024
            d = b || 2
            e = ['B', 'KB', 'MB', 'GB', 'TB']
            f = Math.floor(Math.log(a) / Math.log(c))
            return parseFloat((a / Math.pow(c, f)).toFixed(d)) + '' + e[f]
        }

        function switchTo(val) {
            var status = " "
            switch (val) {
                case 0: status = `🔴 DISCONNECTED`
                    break;
                case 1: status = `🟢 CONNECTED`
                    break;
                case 2: status = `🟡 CONNECTING`
                    break;
                case 3: status = `🟠 DISCONNECTING`
                    break;
            }
            return status
        }
    },
};
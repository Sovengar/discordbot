const { Client, Message, MessageEmbed } = require("discord.js")
const backup = require("discord-backup")
backup.setStorageFolder(__dirname + "../../../backups/")


module.exports = {
    name: "backup",
    aliases: ["bkp"],
    description: "Checks, Creates or Restores a backup server",
    usage: "<create/infos/load/delete> <args> ",
    userPermissions: ["MANAGE_GUILD",],
    botPermissions: ["ADMINISTRATOR",],
    cooldown: 5,

    /**
     * @param {Client} client 
     * @param {Message} message 
     * @param {String[]} args 
     * @returns 
     */
    run: async (client, message, args, ) => {
        if (message.author.id !== message.guild.ownerId) return message.reply("Only the owner of the server can use this command!")

        let toggling = ["create", "load", "info", "delete"]
        if (!toggling.includes(args[0]?.toLowerCase())) 
            return message.reply({ embeds: [
                new MessageEmbed()
                    .setColor("RED")
                    .setDescription("‼ - Please provide a valid option between `create`, `load`, `info` or `delete`!")
            ]})

        if (args[0]?.toLowerCase() === "create") {
            backup.create(message.guild, {jsonBeautify: true}).then(async backupdata => {
                const Embed = new MessageEmbed()
                    .setColor("RED")
                    .setTitle("Backup Successful")
                    .setThumbnail(message.guild.iconURL({ dynamic: true }))
                    .setDescription(`Backup has successfully been create. Use \`backup load ${backupdata.id}\` to load the backup, or use \`backup delete ${backupdata.id}\` to delete the data.`)
                    .setTimestamp()

                message.reply({ embeds: [Embed] })
            })
        }

        if (args[0]?.toLowerCase() === "load") {
            const backupID = args[1]
            if (!backupID) return message.reply("Please provide a backup ID")

            backup.fetch(backupID)
                .then(async () => {
                    backup.load(backupID, message.guild).then(() => {clearGuildBeforeRestore: true, backup.remove(backupID)})
                })
                .catch(err => { message.reply("No backup was found with that ID!") })
        }

        if (args[0]?.toLowerCase() === "info") {
            const backupID = args[1]
            if (!backupID) return message.reply("Please provide a backup ID")

            backup.fetch(backupID).then((backupInfos) => {
                const date = new Date(backupInfos.data.createdTimestamp)
                const yyyy = date.getFullYear().toString(), mm = (date.getMonth() + 1).toString(), dd = date.getDate().toString()
                const formatedDate = `${yyyy}/${(mm[1] ? mm : "0" + mm[0])}/${(dd[1] ? dd : "0" + dd[0])}`

                let embed = new MessageEmbed()
                    .setAuthor({ name: "Backup Informations" })
                    .addField("Backup ID", backupInfos.id, false)
                    .addField("Server ID", backupInfos.data.guildID, false)
                    .addField("Size", `${backupInfos.size} kb`, false)
                    .addField("Created at", formatedDate, false)
                    .setColor("#FF0000")

                message.reply({ embeds: [embed] })
            }).catch((err) => { return message.channel.send("No backup was found with that ID!") })
        }

        if (args[0]?.toLowerCase() === "delete") {
            const backupID = args[1]
            if (!backupID) return message.reply("Please provide a backup ID")

            backup.remove(backupID)
                .then((backupInfos) => { message.reply("Backup data has successfully been deleted")})
                .catch((err) => { return message.channel.send("No backup was found with that ID!") })
        }
    },
}
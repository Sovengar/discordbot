const { Client, CommandInteraction, MessageEmbed } = require("discord.js")
const backup = require("discord-backup")
backup.setStorageFolder(__dirname + "/../../../backups/")

module.exports = {
    name: "backup",
    description: "Checks, Creates or Restores a backup server",
    usage: "<create/infos/load/delete> <args> ",
    type: "CHAT_INPUT",
    permissions: "ADMINISTRATOR",
    cooldown: 5,
    options: [
        { name: "action", description: "Choose an option between [create, load, info, delete]", type:"STRING", required: true},
        { name: "backup_id", description: "If necessary, type the backup id (for load, info and delete)", type:"STRING", required: false},
    ],
    /**
     * @param {Client} client 
     * @param {CommandInteraction} interaction 
     * @param {String[]} args 
     * @returns 
     */
    run: async (client, interaction, args) => {
        const actions = ["create", "load", "info", "delete"]
        const action = interaction.options.getString("action")
        const backup_id = interaction.options.getString("backup_id")

        if (interaction.user.id !== interaction.guild.ownerId) 
            return interaction.followUp("Only the owner of the server can use this command!")

        if (!actions.includes(args[0])) 
            return interaction.followUp("You can only choose among `create` / `load` / `info` / `delete`")

        if (args[0] === "create") {
            backup.create(interaction.guild, {jsonBeautify: true}).then(async backupdata => {
                const Embed = new MessageEmbed()
                    .setColor("RED")
                    .setTitle("Backup Successful")
                    .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
                    .setDescription(`Backup has successfully been create. Use \`backup load ${backupdata.id}\` to load the backup, or use \`backup delete ${backupdata.id}\` to delete the data.`)
                    .setTimestamp()

                interaction.followUp({ embeds: [Embed] })
            })
        }

        if (args[0] === "load") {

            if (!backup_id) 
                return interaction.followUp("Please provide a backup ID")

            backup.fetch(backup_id).then(async () => {
                backup.load(backup_id, interaction.guild).then(() => {clearGuildBeforeRestore: true, backup.remove(backupID)})
            }).catch(err => {
                interaction.followUp("No backup was found with that ID!")
            })
        }

        if (args[0] === "info") {
            if (!backup_id) 
                return interaction.followUp("Please provide a backup ID")

            backup.fetch(backup_id).then((backupInfos) => {
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

                interaction.followUp({ embeds: [embed] })
            }).catch((err) => { return interaction.channel.send("No backup was found with that ID!") })
        }

        if (args[0] === "delete") {
            if (!backup_id) 
                return interaction.followUp("Please provide a backup ID")

            backup.remove(backup_id).then((backupInfos) => { interaction.followUp("Backup data has successfully been deleted")})
                .catch((err) => { return interaction.channel.send("No backup was found with that ID!") })
        }
    },
}
const client = require("../client/discordBot")
const GuildSettings = require('../models/GuildSettings')

module.exports = { name: "mute", };

client.on("guildMemberAdd", async (member) => {
    const guildSettings = await GuildSettings.findOne({ guild_id: member.guild.id })
    if (!guildSettings) return;

    const user = guildSettings.mutedUsers.findIndex((prop) => prop === member.id)
    if (user < 0) return;

    const role = member.guild.roles.cache.find((role) => role.name === 'Muted')

    member.roles.add(role.id).catch(err => {
        if (err) 
            return console.log(err)
    })
}) 
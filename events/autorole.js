const { Member, } = require("discord.js")
const client = require('../client/discordBot')
const GuildSettings = require('../models/GuildSettings');

module.exports = { name: "autorole", };
/**
* @param {Member} member
*/
client.on("guildMemberAdd", async (member) => {
    const guildSettings = await GuildSettings.findOne({ guild_id: member.guild.id });
    if (!guildSettings) return;

    //ADDING MEMBER ROLE IF AUTOROLE IS ON
    const memberRole = member.guild.roles.cache.get(guildSettings.memberRoleId)
    if(guildSettings.allowAutoRole && memberRole) 
        member.roles.add(memberRole).catch(err => console.log(err))
});
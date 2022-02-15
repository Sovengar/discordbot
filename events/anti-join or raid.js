const { Member, } = require("discord.js");
const client = require('../client/discordBot')
const { antijoin } = require('../collections/index')

module.exports = { name: "anti-join",};
/**
* @param {Member} member
*/
client.on("guildMemberAdd", async (member) => {
    const getCollection = antijoin.get(member.guild.id);
    if(!getCollection) return;
    if(!getCollection.includes(member.user))
        getCollection.push(member.user)
    await member.send("Antijoin enabled, try other day.")
    member.kick({ reason: "Antijoin enabled" })
});
const { Member, MessageAttachment } = require("discord.js")
const client = require('../client/discordBot')
const ms = require('ms')

module.exports = { name: "anti-altAccounts",};
/**
* @param {Member} member
*/
client.on("guildMemberAdd", async (member) => {
    const accountAge = ms('2 days');
    const createdAt = new Date(member.user.createdAt).getTime();
    const difference = Date.now() - createdAt;

    if(difference < accountAge) {
        member.send('You are an alt account!');
        member.kick('This is an alt account');
    }
});
const client = require('../client/discordBot');
const { Collection, MessageEmbed } = require('discord.js')

module.exports = { name: "invite-tracker", };

const guildInvites = new Map()

client.on('inviteCreate', async invite => {
    const invites = await invite.guild.invites.fetch();

    const codeUses = new Map();
    invites.each(inv => codeUses.set(inv.code, inv.uses));

    guildInvites.set(invite.guild.id, codeUses);
})

client.once('ready', () => {
    client.guilds.cache.forEach(guild => {
        guild.invites.fetch()
            .then(invites => {
                //console.log("INVITES CACHED");
                const codeUses = new Map();
                invites.each(inv => codeUses.set(inv.code, inv.uses));

                guildInvites.set(guild.id, codeUses);
            })
            .catch(err => {
                console.log("OnReady Error:", err)
            })
    })
})

client.on('guildMemberAdd', async member => {
    const cachedInvites = guildInvites.get(member.guild.id)
    const newInvites = await member.guild.invites.fetch();
    try {
        const usedInvite = newInvites.find(inv => cachedInvites.get(inv.code) < inv.uses);
        //console.log("Cached", [...cachedInvites.keys()])
        //console.log("New", [...newInvites.values()].map(inv => inv.code))
        //console.log("Used", usedInvite)
        //console.log(`The code ${usedInvite.code} was just used by ${member.user.username}.`)

        let channelToSend;

        //CHECKING IF CHANNEL GENERAL EXISTS
        member.guild.channels.cache.forEach( channel => {
            if(channel.name === "general") 
                channelToSend = channel;
        })

        //CHECKING IF CHANNEL LOGS EXISTS
        member.guild.channels.cache.forEach( channel => {
            if(channel.name === "logs" && !channelToSend) 
                channelToSend = channel;
        })

        //GETS THE FIRST CHANNEL THAT HAS THE REQUIREMENTS EXPECIFIED IN THE IF
        member.guild.channels.cache.forEach( channel => {
            if(channel.type === "GUILD_TEXT" && !channelToSend && channel.permissionsFor(member.guild.me).has("SEND_MESSAGES"))
                channelToSend = channel;
        })

        if(!channelToSend) return;

        channelToSend.send({ embeds: [
            new MessageEmbed()
            .setColor("GREEN")
            .setAuthor({ name: `${member.guild.name}`, iconURL: member.guild.iconURL({ dynamic: true }), url: '' })
            .setDescription(`${member} was invited by ${usedInvite.inviter} with the code: ${usedInvite.code}`)
            .setTimestamp()
        ] })


    } catch (err) {
        console.log("OnGuildMemberAdd Error:", err)
    }

    newInvites.each(inv => cachedInvites.set(inv.code, inv.uses));
    guildInvites.set(member.guild.id, cachedInvites);
});
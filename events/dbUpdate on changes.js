const client = require("../client/discordBot")
const GuildSettings = require("../models/GuildSettings");

module.exports = { name: "dbUpdate on changes", };

client.on('roleDelete', async (role) => {
    GuildSettings.findOne({ guild_id: role.guild.id }, (err, data) => {
        if (err) return 
        if (!data) return 
        if(role.id !== data.memberRoleId) return
        
        data.memberRoleId = null
        data.save()
    })
})

client.on('channelDelete', async (channel) => {
    GuildSettings.findOne({ guild_id: channel.guild.id }, (err, data) => {
        if (err) return 
        if (!data) return 

        let index;

        index = data.antiLinkChannels.indexOf(channel.id);
        if (index > -1) 
            data.antiLinkChannels.splice(index, 1); // 2nd parameter means remove one item only

        index = data.disabledLevelingChannels.indexOf(channel.id);
        if (index > -1) 
            data.disabledLevelingChannels.splice(index, 1); // 2nd parameter means remove one item only

        if(data.welcomeChannelId === channel.id)
            data.welcomeChannelId = null;

        if(data.leaveChannelId === channel.id)
            data.leaveChannelId = null; 
   
        if(data.logChannelId === channel.id)
            data.logChannelId = null;     
        
        if(data.suggestionChannelId === channel.id)
            data.suggestionChannelId = null;  

        data.save()
    })
})


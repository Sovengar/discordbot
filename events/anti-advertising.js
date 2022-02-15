const client = require("../client/discordBot")
const GuildSettings = require('../models/GuildSettings')

module.exports = { name: "anti-advertising", };

client.on("ready", async(message) => {
    client.guilds.cache
        .filter( g => g.me.permissions.has("MANAGE_GUILD") ) //FILTERING OUT THE GUILDS WHERE WE DONT HAVE MANAGE_GUILD
        .forEach( g => g.invites.fetch({ cache: true }) ) //UPDATING THE CACHE FOR EVERY GUILD
});

client.on("messageCreate", async(message) => {
    if(!message.guild) return;
    if(message.member.permissions.has("MANAGE_MESSAGES")) return;

    const guildSettings = await GuildSettings.findOne({ guild_id: message.guild.id });
    if(!guildSettings || !guildSettings.allowAntiAdvertising) return;

    function deleteMessage(){
        message.delete();
        message.channel.send("No advertistments in here!");
    }

    const links = ["discord.gg/", "discord.com/invite/"];

    for (const link of links){
        if(!message.content.includes(link)) return;

        //GETTING THE CODE FROM THE LINK
        const code = message.content.split(link)[1].split(" ")[0];

        //CHECKING IF THE CODE IS FROM THIS SERVER
        const isGuildInvite = message.guild.invites.cache.has(code); //WE CAN ACCESS CACHE THANKS TO WHAT WE DID IN READY EVENT.

        if(!isGuildInvite){
            //CHECKING IF IS A VANITY URL (CUSTOM URL)
            try {
                const vanity = await message.guild.fetchVanityData();
                if (code !== vanity?.code) return deleteMessage();
            } catch (error) { //IF fetchVanityData doesnt find vanity returns an error, it means there is no vanity.
                deleteMessage();
            }
        }

    }
})
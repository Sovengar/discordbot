const { Client, Guild, MessageEmbed, } = require("discord.js")

//client.on("guildCreate", guild => { 
module.exports = {
    name: "guildCreate",
    /**
    * @param {Guild} guild
    * @param {Client} client
    */
    run: (guild, client) => {
      let channelToSend;

      //CHECKING IF CHANNEL GENERAL EXISTS
      guild.channels.cache.forEach( channel => {
        if(channel.name === "general") 
            channelToSend = channel;
      })

      //CHECKING IF CHANNEL LOGS EXISTS
      guild.channels.cache.forEach( channel => {
          if(channel.name === "logs" && !channelToSend) 
              channelToSend = channel;
      })

      //GETS THE FIRST CHANNEL THAT HAS THE REQUIREMENTS EXPECIFIED IN THE IF
      guild.channels.cache.forEach( channel => {
          if(channel.type === "GUILD_TEXT" && !channelToSend && channel.permissionsFor(guild.me).has("SEND_MESSAGES"))
              channelToSend = channel;
      })

      if(!channelToSend) return;

      channelToSend.send({ embeds: [
        new MessageEmbed()
          .setColor("GREEN")
          .setAuthor({ name: `${guild.name}`, iconURL: guild.iconURL({ dynamic: true }), url: '' })
          .setDescription(`Thanks for inviting me, my default prefix is ${process.env.PREFIX}`)
          .setTimestamp()
      ] })
    },
};
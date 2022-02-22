const { Message, Client, MessageEmbed, } = require("discord.js");
const Levels = require("discord-xp")
const client = require('../../client/discordBot')
const GuildSettings = require("../../models/GuildSettings");
Levels.setURL(client.config.mongoDB_url)

module.exports = {
    name: 'toprank',
    aliases: ["leaderboard", "lb", "top"],
    description: "Sends ranking leaderboard",
    usage: "",
    cooldown: 5,
    userPermissions: [,],
    botPermissions: [,],
    /**
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
    */
    run: async (client, message, args) => {
        GuildSettings.findOne({ guild_id: message.guild.id }, async (err, data) => {
			if (err) {
				console.log(err);
				return message.reply("An error occurred while trying to load the rank!");
			}

			if (!data) {
                data = new GuildSettings({
                    guild_id: message.guild.id,
                    prefix: process.env.PREFIX,
                })
                data.save().catch(err => console.log(err))
			} 
            
            const rawLeaderboard = await Levels.fetchLeaderboard(message.guild.id, 10)
            if (rawLeaderboard.length < 1) return message.reply("Nobody's in the leaderboard yet!")

            const leaderboard = await Levels.computeLeaderboard(client, rawLeaderboard, true)
            const lb = leaderboard.map(e => `\`${e.position}\` | ${e.username}#${e.discriminator} | **${e.level}** Level | **${e.xp.toLocaleString()}** XP`).join("\n")

            message.reply({ embeds: [
                new MessageEmbed()
                    .setColor("RED")
                    .setTitle(`Ranking Leaderboard of ${message.guild.name}`)
                    .setThumbnail(message.guild.iconURL({ dynamic: true }))
                    .setDescription(`${lb}`)
                    .setTimestamp()
            ] })
		})
    },
};
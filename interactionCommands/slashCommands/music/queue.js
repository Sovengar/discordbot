const player = require("../../../client/discordMusicPlayer");
const { Client, CommandInteraction, MessageEmbed } = require('discord.js')

module.exports = {
    name: "queue",
    description: "display the song queue",
    permissions: "",
    cooldown: 5,
    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
    */
    run: async (client, interaction, args) => {
        await interaction.deferReply()
        const queue = player.getQueue(interaction.guildId);

        if (!interaction.member.voice.channel) 
            return interaction.followUp({ embeds: [
                new MessageEmbed()
                .setColor('#3d35cc')
                .setDescription(`‼️ - You have to be in a Voice Channel to use this command!`)
            ] })

        if (!queue?.playing) 
            return interaction.followUp({ embeds: [
                new MessageEmbed()
                    .setColor("#3d35cc")
                    .setDescription(`‼️ - No music is currently be played in this server!`)
                ] })

        if (interaction.member.voice.channel.id !== interaction.guild.me.voice.channel.id) 
            return interaction.followUp({ embeds: [
                new MessageEmbed()
                .setColor('#3d35cc')
                .setDescription(`‼️ - Music is currently being played in **${interaction.guild.me.voice.channel.name}**. You've to be in the same Voice Channel to execute this command!`)
            ] })

        const currentTrack = queue.current

        const tracks = queue.tracks.slice(0, 10).map((m, i) => {
            return `\`${i + 1}.\` - [**${m.title}**](${m.url}) - \`${m.requestedBy.tag}\``
        })

        if(!tracks.length){
            return interaction.followUp({ embeds: [
                new MessageEmbed()
                    .setColor("#3d35cc")
                    .setTitle(`**🎶 Song queue - ${interaction.guild.name} 🎶**`)
                    .addFields([
                        { name: "Current:", value: `🎶 | [**${currentTrack.title}**](${currentTrack.url}) - \`${currentTrack.requestedBy.tag}\`\n\n` 
                        },
                    ])
                    .setThumbnail(currentTrack.thumbnail)
                    .setTimestamp()
                ] })
        } else{
            return interaction.followUp({ embeds: [
                new MessageEmbed()
                    .setColor("#3d35cc")
                    .setTitle(`**🎶 Song queue - ${interaction.guild.name} 🎶**`)
                    .addFields([
                        { name: "Current:", value: `🎶 | [**${currentTrack.title}**](${currentTrack.url}) - \`${currentTrack.requestedBy.tag}\`\n\n` },
                        {
                            name: "Queue:", value: `${tracks.join("\n")}${queue.tracks.length > tracks.length ? `\n...${queue.tracks.length - tracks.length === 1 ? `${queue.tracks.length - tracks.length} more track` : `${queue.tracks.length - tracks.length} more tracks`}` : ""}`
                        }
                    ])
                    .setThumbnail(currentTrack.thumbnail)
                    .setTimestamp()
                ] })
        }    
    },
};


// return interaction.reply({
//     embeds: [
//         {
//             title: "Song Queue",
//             description: `${tracks.join("\n")}${
//                 queue.tracks.length > tracks.length
//                     ? `\n...${
//                           queue.tracks.length - tracks.length === 1
//                               ? `${
//                                     queue.tracks.length - tracks.length
//                                 } more track`
//                               : `${
//                                     queue.tracks.length - tracks.length
//                                 } more tracks`
//                       }`
//                     : ""
//             }`,
//             color: "RANDOM",
//             fields: [
//                 {
//                     name: "Now Playing",
//                     value: `🎶 | [**${currentTrack.title}**](${currentTrack.url}) - ${currentTrack.requestedBy.tag}`,
//                 },
//             ],
//         },
//     ],
// });
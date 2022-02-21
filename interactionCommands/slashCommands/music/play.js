const { QueryType } = require("discord-player");
const player = require("../../../client/discordMusicPlayer");
const { Client, MessageEmbed, CommandInteraction } = require('discord.js')

module.exports = {
    name: "play",
    description: "play a song",
    cooldown: 1,
    permissions: "",
    options: [
        {
            name: "songtitle",
            description: "title of the song",
            type: "STRING",
            required: true,
        },
    ],
    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
    */
    run: async (client, interaction) => {
        await interaction.deferReply()
        const songTitle = interaction.options.getString("songtitle");
        
        if (!interaction.member.voice.channel) 
            return interaction.followUp({ embeds: [
                new MessageEmbed()
                    .setColor('#3d35cc')
                    .setDescription(`‼️ - You have to be in a Voice Channel to use this command!`)
                ] })

        const searchResult = await player.search(songTitle, { requestedBy: interaction.user, searchEngine: QueryType.AUTO,}).catch( (error) => {console.log(error)});

        const queue = await player.createQueue(interaction.guild, { metadata: interaction.channel,});

        if (!queue.connection) await queue.connect(interaction.member.voice.channel).catch( (error) => {console.log(error)});

        if (interaction.member.voice.channel.id !== interaction.guild.me.voice.channel.id) 
            return interaction.followUp({ embeds: [
                new MessageEmbed()
                .setColor('#3d35cc')
                .setDescription(`‼️ - Music is currently being played in **${message.guild.me.voice.channel.name}**. You've to be in the same Voice Channel to execute this command!`)
            ] })

        searchResult.playlist ? queue.addTracks(searchResult.tracks) : queue.addTrack(searchResult.tracks[0]);

        if (!queue.playing) await queue.play().catch( (error) => {console.log(error)})

        interaction.followUp({ embeds: [
            new MessageEmbed()
            .setColor("#3d35cc")
            .setDescription(`🎵 - Song added **${searchResult.tracks[0]}** - requested by **${interaction.user.tag}** - into **${interaction.member.voice.channel.name}**`)
        ] })
    },
};

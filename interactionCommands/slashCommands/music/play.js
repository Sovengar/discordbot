const { QueryType } = require("discord-player");
const player = require("../../../client/discordMusicPlayer");

module.exports = {
    name: "play",
    description: "play a song",
    cooldown: 5,
    permissions: "",
    options: [
        {
            name: "songtitle",
            description: "title of the song",
            type: "STRING",
            required: true,
        },
    ],
    run: async (client, interaction) => {
        const songTitle = interaction.options.getString("songtitle");
    
        if (!interaction.member.voice.channel)
            return interaction.followUp({content: "Please join a voice channel first!",});

        const searchResult = await player.search(songTitle, { requestedBy: interaction.user, searchEngine: QueryType.AUTO,}).catch( (error) => {console.log(error)});
        const queue = await player.createQueue(interaction.guild, { metadata: interaction.channel,});

        if (!queue.connection)
            await queue.connect(interaction.member.voice.channel).catch( (error) => {console.log(error)});

        interaction.followUp({ content: `Playing ${songTitle}` });

        searchResult.playlist ? queue.addTracks(searchResult.tracks) : queue.addTrack(searchResult.tracks[0]);

        if (!queue.playing) await queue.play().catch( (error) => {console.log(error)})
    },
};
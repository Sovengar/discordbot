const player = require("../../../client/discordMusicPlayer");

module.exports = {
    name: "skip",
    description: "skip the current song",
    permissions: "",
    cooldown: 5,
    run: async (client, interaction, args) => {
        const queue = player.getQueue(interaction.guildId);
        if (!queue?.playing)
            return interaction.followUp({
                content: "No music is currently being played",
            });

        await queue.skip();

        interaction.followUp({ content: "Skipped the current track!" });
    },
};

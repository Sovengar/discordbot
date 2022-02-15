const player = require("../../../client/discordMusicPlayer");

module.exports = {
    name: "pause",
    description: "pause the current song",
    cooldown: 5,
    permissions: "",
    run: async (client, interaction) => {
        const queue = player.getQueue(interaction.guildId);

        queue.setPaused(true);

        return interaction.followUp({ content: "Paused the current track!" });
    },
};

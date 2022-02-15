const player = require("../../../client/discordMusicPlayer");

module.exports = {
    name: "resume",
    description: "resume the current song",
    permissions: "",
    cooldown: 5,
    run: async (client, interaction) => {
        const queue = player.getQueue(interaction.guildId);

        queue.setPaused(false);

        return interaction.followUp({ content: "Resumed the current track!" });
    },
};

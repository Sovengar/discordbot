const player = require("../../../client/discordMusicPlayer");
const { Client, MessageEmbed, CommandInteraction } = require("discord.js");

module.exports = {
    name: "now-playing",
    description: "shows information about the current song",
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

        const progress = queue.createProgressBar();
        const perc = queue.getPlayerTimestamp();

        return interaction.followUp({
            embeds: [
                {
                    title: "Now Playing",
                    description: `🎶 | **${queue.current.title}**! (\`${perc.progress}%\`)`,
                    fields: [
                        {
                            name: "\u200b",
                            value: progress,
                        },
                    ],
                    color: client.config.clientColor,
                    footer: {
                        text: `Queued by ${queue.current.requestedBy.tag}`,
                    },
                },
            ],
        });
    },
};

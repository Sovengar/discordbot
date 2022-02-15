const { CommandInteraction, Client, MessageAttachment } = require("discord.js");
const discordTogether = require("../../../client/discordTogether");

module.exports = {
    name: "youtube",
    description: "Watch Youtube in a voice channel together!",
    type: 'CHAT_INPUT',
    cooldown: 5,
    permissions: "",
    usage: "<channel> \nExample 1: command channel_id \nExample 2: command (from a voice channel)",
    options: [
        { name: "channel", description: "channel you want to activate this activity", type:"CHANNEL", required: false},
    ],
    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */
    run: async (client, interaction, args) => {
        let channel;

        if(!args[0]){
            if(!interaction.member.voice.channel)
                return interaction.followUp({ content: "Please choose or join a voice channel" });
            channel = interaction.member.voice.channel;
        } else {
            channel = interaction.options.getChannel("channel")
        }

        if(channel.type !== 'GUILD_VOICE') 
            return interaction.followUp({ content: "Please choose a voice channel" });

        discordTogether.createTogetherCode(channel.id, "youtube")
            .then( (x) => interaction.followUp(x.code) );
    },
};
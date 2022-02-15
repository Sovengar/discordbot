const { Message, Client, MessageAttachment } = require("discord.js");
const { createAudioPlayer, AudioPlayerStatus, NoSubscriberBehavior,} = require('@discordjs/voice');
const { connectToChannel, playSong } = require('../functions/audioPlayer.js')

module.exports = {
    name: "calla",
    aliases: ['calla la boca'],
    description: "XokasW",
    cooldown: 5,
    usage: "",
    /**
     *
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */
    run: async (client, message, args) => {
        const channel = message.member.voice.channel;
        const fileName = message.content + '.mp3';
        const path = __dirname + "\\..\\mediaFiles\\audios\\"
        const attachment = new MessageAttachment('./mediaFiles/images/xokas_calla.gif')

        message.channel.send({ files: [attachment] }); 

        if (channel) {
			try {
                const player = createAudioPlayer({ behaviors: { noSubscriber: NoSubscriberBehavior.Pause,},}); //CREATING THE AUDIO PLAYER
                const connection = await connectToChannel(channel); //CREATING THE CONNECTION BETWEEN THE CHANNEL AND THE PLAYER
                connection.subscribe(player) //Connects the player to the voice channel
                await playSong(player, path, fileName) //Plays the audio on the player

                player.on(AudioPlayerStatus.Idle, () => {
                    player.stop();
                    connection.destroy();
                });
			} catch (error) {}
		}
    },
};

        //message.channel.send(`https://tenor.com/view/xokas-calla-shh-gif-24480633`);
        //const embed = new MessageEmbed().setImage('attachment://khe.png');
        //message.channel.send({ embeds: [embed], files: [attachment] }); 
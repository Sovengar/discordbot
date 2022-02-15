const { Message, Client, } = require("discord.js");
const { createAudioPlayer, AudioPlayerStatus, NoSubscriberBehavior,} = require('@discordjs/voice');
const { connectToChannel, playSong } = require('../../functions/audioPlayer.js')

module.exports = {
    name: "playlocal",
    aliases: ['pl'],
    description: "Only my creator can use this command :(",
    usage: "",
    cooldown: 5,
    userPermissions: ["CONNECT","SPEAK",],
    botPermissions: ["CONNECT","SPEAK",],
    /**
     *
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */
    run: async (client, message, args) => {
        if(message.author.id !== client.config.owner_id)
            return message.reply("Only my creator can use this command!")

        const channel = message.member.voice.channel;
        const fileName = args.join(" ") + '.mp3';
        const path = 'D:\\Music\\URBANA\\2021\\'
   
		if (channel) {
			try {
                const player = createAudioPlayer({ behaviors: { noSubscriber: NoSubscriberBehavior.Pause,},}); //CREATING THE AUDIO PLAYER
                const connection = await connectToChannel(channel); //CREATING THE CONNECTION BETWEEN THE CHANNEL AND THE PLAYER
                //message.guild.me.voice.setRequestToSpeak(true); //For Stage Channels 
                connection.subscribe(player) //Connects the player to the voice channel
                await playSong(player, path, fileName) //Plays the audio on the player

                player.on('error', error => {
                    console.error(`Error: ${error.message} with resource ${error.resource.metadata.title}`);
                    //player.play(getNextResource());
                });

                player.on(AudioPlayerStatus.Idle, () => {
                    //player.play(getNextResource());
                });
			} catch (error) {}
		}
    },
};
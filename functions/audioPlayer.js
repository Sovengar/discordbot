const {
	joinVoiceChannel,
	createAudioPlayer,
	createAudioResource,
	entersState,
	StreamType,
	AudioPlayerStatus,
	VoiceConnectionStatus,
    NoSubscriberBehavior,
} = require('@discordjs/voice');

const connectToChannel = async (channel) => {
	const connection = joinVoiceChannel({
		channelId: channel.id,
		guildId: channel.guild.id, 
		adapterCreator: channel.guild.voiceAdapterCreator
	});

	try {
		await entersState(connection, VoiceConnectionStatus.Ready, 30e3);
		return connection;
	} catch (error) {
		connection.destroy();
		throw error;
	}
}

const playSong = (player, path, fileName) => {
	const resource = createAudioResource(path + fileName, { inputType: StreamType.Arbitrary,});
	player.play(resource);
	return entersState(player, AudioPlayerStatus.Playing, 5e3);
}

module.exports =  { connectToChannel, playSong }

/*
You can call the pause() and unpause() methods. While the audio player is paused, no audio will be played. When it is resumed, it will continue where it left off.
player.pause();
setTimeout(() => player.unpause(), 5_000); Unpause after 5 seconds
*/
const { Player, QueryType, QueueRepeatMode } = require("discord-player");
const client = require("./discordBot.js");

const player = new Player(client, {
    ytdlOptions: {
        quality: "highestaudio",
        highWaterMark: 1 << 25,
    },
});

module.exports = player;

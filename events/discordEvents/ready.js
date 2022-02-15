const { Client } = require("discord.js")

module.exports = {
    name: "ready",
    once: true,
    /**
    * @param {Client} client
    */
    run: (client) => {
        console.log(`${client.user.tag} ready!`);
    },
};
const { Message, Client, CommandInteraction, } = require("discord.js");

const TicTacToe = require("discord-tictactoe")
const game = new TicTacToe({ language: "en" })

module.exports = {
    name: "tictactoe",
    description: "Play tictactoe with me or a friend!",
    usage: "[member]",
    cooldown: 5,
    type: "CHAT_INPUT",
    permissions: "",
    options: [
        { name: "opponent", description: "Choose a member of the server to play against!", type: "USER", required: false },
    ],
    /**
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */
    run: async (client, interaction, args) => {
        game.handleInteraction(interaction)
    },
};
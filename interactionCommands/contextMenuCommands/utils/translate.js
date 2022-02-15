const { Client, ContextMenuInteraction, MessageEmbed } = require("discord.js");
const translate = require('translate-google')

module.exports= {
    name : 'Translate to english',
    type: 'MESSAGE',
    cooldown: 5,
    permissions: "",
    usage: "Right click the avatar of any user, choose Apps, choose the app",
    /**
     * @param {Client} client
     * @param {ContextMenuInteraction} interaction
     * @param {String[]} args
    */
    run : async(client, interaction, args) => {
        const message = await (await interaction.channel.messages.fetch(interaction.targetId)).toString();

        translate(message, {to : 'en'})
        .then(msg => {
            const transEmbed = new MessageEmbed()
                .setColor("RED")
                .addField("Raw", "```" + message + "```")
                .addField("Translated", "```" + msg + "```")
            .   setTimestamp();
            interaction.followUp({ embeds: [transEmbed] });
        })
        .catch(err => {interaction.followUp('An error has occured');});
    }
}
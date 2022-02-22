const { Client, CommandInteraction, MessageEmbed, MessageActionRow, MessageSelectMenu } = require("discord.js");
const GuildSettings = require('../../../models/GuildSettings');

module.exports = {
    name: "help",
    description: "Shows slash and context menu commands.",
    cooldown: 5,
    type: 'CHAT_INPUT',
    usage: "[sub_command]\nExample 1: command \nExample 2: command ping",
    permissions: "",
    options: [
        { name: "command", description: "Name of the commmand", type: "STRING", required: false },
    ],
    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
    */
    run: async (client, interaction, args) => {
        await interaction.deferReply({ ephemeral: true }) //Opens a reply with message 'bot is thinking' for 15 mins
        const guildSettings = await GuildSettings.findOne({ guild_id: interaction.member.guild.id })
        let prefix = guildSettings?.prefix ? guildSettings.prefix : process.env.PREFIX
        const argsCommand = interaction.options.getString("command");

        const emojis = {
            info: '📔', 
            fun: '🥴',  
            utils: '🧰',
            moderation: '💻',
            music: '🎶', 
            economy: '🤑',
            community: '👩‍👩‍👧‍👦',
            devtest: '👾',
            setup: '🤖',
        }

        const roleColor =
            interaction.guild.me.displayHexColor === "#000000"
            ? "#ffffff"
            : interaction.guild.me.displayHexColor;
        
        //Adding directories 'fun', 'util', etc
        const directories = [...new Set(client.interactionCommands.map((cmd) => cmd.directory))];
        const formatString = (str) => `${str[0].toUpperCase()}${str.slice(1).toLowerCase()}`;
        const categories = directories.map((dir) => {
            const getCommands = client.interactionCommands
                .filter((cmd) => cmd.directory === dir)
                .filter( (cmd) => interaction.member.permissions.has(cmd.permissions || [])  ) //IF THE USER DOESNT HAVE THE PERMISSION THE COMMAND IS NOT SHOWN
                .map((cmd) => {
                if( !cmd.description &&  ["MESSAGE", "USER"].includes(cmd.type)){
                    return { name: cmd.name || 'there is no name', description: cmd.description || 'Context Commands doesnt have descriptions',}
                } else {
                    return { name: cmd.name || 'there is no name', description: cmd.description || 'there is no description',}
                };
            });
            return {
                directory: formatString(dir).charAt(0).toUpperCase() + formatString(dir).slice(1),
                commands: getCommands, 
            };
        });

        if(!argsCommand) {
            const embed = new MessageEmbed()
                .setDescription(`
                To see classic commands and ''commands'' with no prefix please use \`${prefix}help\`, then choose a category in the dropdown menu. Add the name of the command to get more info, like \`${prefix}help ping\`
                \nTo see slash commands use \`/help\`, then choose a category in the dropdown menu. Add the command to get more info, like \`/help ping\`  
                Or just \`/\` and scroll to search your command or click the bot image on the left. You can also type the command to filter the query. 
                \nContext menu commands are shown on \`/help\` too but you can right click on a message or user and click on Apps.`)
                .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true })})
                .setColor(roleColor);
                
            const components = (state) => [
                new MessageActionRow().addComponents(
                    new MessageSelectMenu()
                        .setCustomId("help-menu-interaction")
                        .setPlaceholder('Please select a category')
                        .setDisabled(state)
                        .addOptions(categories.map((cmd) => {
                            return {
                                label: cmd.directory,
                                value: cmd.directory.toLowerCase(),
                                description: `Commands from ${cmd.directory} category`,
                                emoji: emojis[cmd.directory.toLowerCase() || null]
                            }
                        }))
                ),
            ];

            const initialMessage = await interaction.editReply({ //Loads the embed and the component
                ephemeral: true,
                embeds: [embed],
                components: components(false), 
            }).catch(() => {})

            //FILTERING THE INTERACTION TO ONLY ALLOW THE AUTHOR TO USE THE COLLECTOR
            const filter = (filterInteraction) => filterInteraction.user.id === interaction.user.id;

            const collector = interaction.channel.createMessageComponentCollector({
                filter, 
                componentType: "SELECT_MENU", 
                time: 80000,
            });

            let selectMenuInteraction
            collector.on('collect', (select_menu_interaction) => {
                if (select_menu_interaction.customId !== "help-menu-interaction") return
                
                let [directory] = select_menu_interaction.values;
                const category = categories.find( (x) => x.directory.toLowerCase() === directory);
                directory = directory.charAt(0).toUpperCase() + directory.slice(1);
                
                const categoryEmbed = new MessageEmbed()
                    .setTitle(`${directory} commands`)
                    .addFields(category.commands.map( (cmd) => {
                        return {
                            name: `\`${cmd.name}\``,
                            value: cmd.description,
                            inline: true,
                        }; 
                    }))
                    .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true })})
                    .setColor(roleColor);

                select_menu_interaction.update({ embeds: [categoryEmbed], ephemeral: true});
                selectMenuInteraction = select_menu_interaction.id
            });

            collector.on('end', async (colInt) => {
                await interaction.editReply({ embeds: [embed], components: components(true), ephemeral: true}); //Loads the default embed and makes the select menu unclickable
                try {
                    await colInt.get(selectMenuInteraction).editReply({ components: [] }) //Removes the select menu
                } catch (error) {
                    interaction.editReply({ embeds: [embed], components: [], ephemeral: true});
                }
            });

        } else {
            const command = 
                client.interactionCommands.get(args[0].toLowerCase()) || 
                client.interactionCommands.find((c) => c.aliases && c.aliases.includes(args[0].toLowerCase()));

            if(!command) {
                const embed = new MessageEmbed()
                    .setTitle('Not Found')
                    .setDescription(`Command not found, Use \`/help\` for all commands available`)
                    .setColor(roleColor);
                return interaction.editReply({ embeds: [embed], ephemeral: true,})
            }
            
            const embed = new MessageEmbed()
                .setTitle("Command Details")
                .addField("COMMAND:",command.name ? `\`${command.name}\`` : "No name for this command")
                .addField("ALIASES:",command.aliases ? `\`${command.aliases.join("` `")}\`` : "No aliases for this command.")
                .addField("USAGE:",command.usage ? `\`/${command.name} ${command.usage}\`` : `\`/${command.name}\``)
                .addField("DESCRIPTION", command.description ? command.description : "No description for this command.")
                .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true })})
                .setColor(roleColor);
            return interaction.editReply({ embeds: [embed], ephemeral: true,});
        }
    },
};
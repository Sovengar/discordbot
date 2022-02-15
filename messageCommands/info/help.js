const { Client, Message, MessageEmbed, MessageActionRow, MessageSelectMenu, Permissions } = require("discord.js");
const GuildSettings = require('../../models/GuildSettings');

module.exports = {
  name: "help",
  aliases : ['h'],
  description: "Shows all available bot commands.",
  usage: "[sub_command]\nExample 1: command \nExample 2: command ping",
  cooldown: 5,
  userPermissions: [,],
  botPermissions: [,],
  /**
   * @param {Client} client 
   * @param {Message} message 
   * @param {String[]} args 
   */
  run: async (client, message, args) => {
    const guildSettings = await GuildSettings.findOne({ guild_id: message.member.guild.id })
    let prefix = guildSettings.prefix ? guildSettings.prefix : process.env.PREFIX

    const emojis = {
        info: '📔', 
        fun: '🥴',  
        utils: '🧰',
        moderation: '💻',
        music: '🎶',
        economy: '🤑',
        community: '👩‍👩‍👧‍👦',
        setup: '🤖',
        devtest: '👾',
        noprefix: '‼'  
    }
    const roleColor =
        message.guild.me.displayHexColor === "#000000"
        ? "#ffffff"
        : message.guild.me.displayHexColor;
    
    //Adding directories 'fun', 'util', etc
    const directories = [...new Set(client.messageCommands.map((cmd) => cmd.directory))];
    directories.push('No Prefix') //Adding special directory for no prefix commands.
    const formatString = (str) => `${str[0].toUpperCase()}${str.slice(1).toLowerCase()}`;
    const categories = directories.map((dir) => {
        if(dir !== 'No Prefix'){
            const getCommands = client.messageCommands
                .filter( (cmd) => cmd.directory === dir)
                .filter( (cmd) => message.member.permissions.has(cmd.userPermissions || []) ) //IF THE USER DOESNT HAVE THE PERMISSION THE COMMAND IS NOT SHOWN
                .map( (cmd) => {
                return { name: cmd.name || 'there is no name', description: cmd.description || 'there is no description',};
            });

            return {
               directory: formatString(dir).charAt(0).toUpperCase() + formatString(dir).slice(1),
               commands: getCommands, 
            };
        } else {
            const getCommands = client.noPrefixCommands.map((cmd) => {
                return { name: cmd.name || 'there is no name', description: cmd.description || 'there is no description',};
            });
            
            return {
               directory: formatString(dir).charAt(0).toUpperCase() + formatString(dir).slice(1),
               commands: getCommands, 
            };
        }
    });

    if(!args[0]) {
        const embed = new MessageEmbed()
        .setDescription(`
            To see classic commands and ''commands'' with no prefix please use \`${prefix}help\`, then choose a category in the dropdown menu. Add the name of the command to get more info, like \`${prefix}help ping\`
            \nTo see slash commands use \`/help\`, then choose a category in the dropdown menu. Add the command to get more info, like \`/help ping\`  
            Or just \`/\` and scroll to search your command or click the bot image on the left. You can also type the command to filter the query. 
            \nContext menu commands are shown on \`/help\` too but you can right click on a message or user and click on Apps.`)
        .setFooter({ text: `Requested by ${message.author.tag}`, iconURL: message.author.displayAvatarURL({ dynamic: true })})
        .setColor(roleColor);
        
        const components = (state) => [
            new MessageActionRow().addComponents(
                new MessageSelectMenu()
                    .setCustomId("help-menu")
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

        const initialMessage = await message.reply({
            embeds: [embed],
            components: components(false),
        });

        const filter = (interaction) => interaction.user.id === message.author.id;
        const collector = message.channel.createMessageComponentCollector({
            filter, 
            componentType: "SELECT_MENU", 
            time: 80000,
        });

        collector.on('collect', (interaction) => {
            let [directory] = interaction.values;
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
                .setFooter({ text: `Requested by ${message.author.tag}`, iconURL: message.author.displayAvatarURL({ dynamic: true })})
                .setColor(roleColor);

            interaction.update({ embeds: [categoryEmbed]});
        });

        collector.on('end', () => {
            initialMessage.edit({ components: components(true)});
        });
    } else {
        const command = 
            client.messageCommands.get(args[0].toLowerCase()) || 
            client.messageCommands.find((c) => c.aliases && c.aliases.includes(args[0].toLowerCase())) ||
            client.noPrefixCommands.get(args[0].toLowerCase()) ||
            client.noPrefixCommands.find((c) => c.aliases && c.aliases.includes(args[0].toLowerCase()));

        if(!command) {
            const embed = new MessageEmbed()
                .setTitle('Not Found')
                .setDescription(`Command not found, Use \`${prefix}help\` for all commands available`)
                .setColor(roleColor);
            return message.reply({ embeds: [embed]})
        }

        let embed;
        if(command.directory === 'noPrefixCommands') {
            embed = new MessageEmbed()
                .setTitle("Command Details")
                .addField("COMMAND:",command.name ? `\`${command.name}\`` : "No name for this command")
                .addField("ALIASES:",command.aliases ? `\`${command.aliases.join("` `")}\`` : "No aliases for this command.")
                .addField("USAGE:",command.usage ? `\`${command.name} ${command.usage}\`` : `\`${command.name}\``)
                .addField("DESCRIPTION", command.description ? command.description : "No description for this command.")
                .setFooter({ text: `Requested by ${message.author.tag}`, iconURL: message.author.displayAvatarURL({ dynamic: true })})
                .setColor(roleColor);
        } else {
            embed = new MessageEmbed()
                .setTitle("Command Details")
                .addField("COMMAND:",command.name ? `\`${command.name}\`` : "No name for this command")
                .addField("ALIASES:",command.aliases ? `\`${command.aliases.join("` `")}\`` : "No aliases for this command.")
                .addField("USAGE:",command.usage ? `\`${prefix}${command.name} ${command.usage}\`` : `\`${prefix}${command.name}\``)
                .addField("DESCRIPTION", command.description ? command.description : "No description for this command.")
                .setFooter({ text: `Requested by ${message.author.tag}`, iconURL: message.author.displayAvatarURL({ dynamic: true })})
                .setColor(roleColor);
        }
        return message.reply({ embeds: [embed]});
    }
  },
};
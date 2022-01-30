const { MessageAttachment, MessageEmbed } = require('discord.js');
const Discord = require('discord.js');

module.exports = function(msg, args) {
  const user = msg.author; //client.users.cache.get(User.id);
  const url = user.displayAvatarURL({ dynamic: true, size: 256});

  let roles = []

  msg.member.roles.cache.forEach(role=>{
    roles.push(role.name)
  })
  console.log(roles);

  const embed = new MessageEmbed()
    .setColor('#0099ff')
    //.setTitle(user.tag)
    .setURL('')
    .setAuthor(`${user.tag}`, user.avatarURL)
    .setDescription(`User from server ${msg.guild.name}\n
      ID: ${user.id}\n`)
    .setThumbnail(url)
    .addField('Roles:', `${roles}`, true)
    .setImage(url)
    .setTimestamp()
    .setFooter(`${user.username}`, user.avatarURL);

  msg.channel.send(embed);
};
const getMember = (client, message, args) => {
    return  message.mentions.members.first() || //Mention the member
            message.guild.members.cache.get(args) || //Send user id
            message.guild.members.cache.find(member => member.displayName.toLowerCase() === args?.toLocaleLowerCase()) || //Member nickname
            message.guild.members.cache.find(user => user.user.username.toLowerCase() === args?.toLocaleLowerCase()) //Username without #1234
}

module.exports =  { getMember, }
const replies = ['Hello!', 'What are you doing?', 'Hey waddup', 'Tu madre trabaja en colombia?'];

module.exports = function(msg, args) {
  const index = Math.floor(Math.random() * replies.length);
  msg.channel.send(replies[index]);
};

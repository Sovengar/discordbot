module.exports = async function(message) {
  message.channel.send('Loading data').then (async (msg) =>{
    msg.delete()
    message.channel.send(`🏓Latency is ${msg.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(message.client.ws.ping)}ms`);
  })
};
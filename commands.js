// Command Handler
// Discord Bots
// The Coding Train / Daniel Shiffman
// https://thecodingtrain.com/learning/bots/discord/06-command-handler.html
// https://youtu.be/B60Q74FHFBQ

const gif = require('./commands/gif.js');
const choochoo = require('./commands/choochoo.js');

const commands = { choochoo, gif };

module.exports = async function(msg) {
  if (msg.channel.id == '314720200337522688') {
    let tokens = msg.content.split(' ');
    let command = tokens.shift();
    if (command.charAt(0) === '!') {
      command = command.substring(1);
      commands[command](msg, tokens);
    }
  }
};

//Necesitamos mantener el host activo, lo haremos en 2 pasos:

//Paso 1, levantamos un server en el puerto especifico.
const http = require('http');
const server = http.createServer((req, res) => {
  res.writeHead(200);
  res.end('ok');
});
server.listen(3000);

//Paso 2, hacemos pings a ese server.

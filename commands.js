const gif = require('./commands/gif.js');
const hello = require('./commands/hello.js');
const ping = require('./commands/ping.js');
const te_meto_una_ostia = require('./commands/te_meto_una_ostia.js');
const khe = require('./commands/khe.js');
const profile = require('./commands/profile.js');

const commands = { 
  hello, 
  gif,
  ping,
  te_meto_una_ostia,
  khe,
  profile
 };

module.exports = async function(msg) {
  if (msg.channel.id == '314720200337522688') {
    let tokens = msg.content.split(' ');
    let command = tokens.shift();
    if (command.charAt(0) === '!') {
      command = command.substring(1);
      commands[command](msg, tokens);
    } else {
      if (msg.content.includes('te meto')) {
        commands['te_meto_una_ostia'](msg, tokens);
      }
      if (msg.content.includes('khe')) {
        commands['khe'](msg, tokens);
      }
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
//UptimeRobot.com, este paso no se hace en codigo
//
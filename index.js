console.log('Beep beep! 🤖');

//Loads bot.js - Loads the Discord bot.
require('./client/discordBot.js')

//Loads the server
//We need to keep doing pings to this server, i.e with UptimeRobot.com
require('./server/server.js') 


// Opens a server and a port to listen.
// const http = require('http');
// const server = http.createServer((req, res) => {
//   res.writeHead(200);
//   res.end('ok');
// });
// server.listen(3000);
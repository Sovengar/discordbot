const { glob } = require('glob')
const { promisify } = require('util')
const Ascii = require("ascii-table")
const { Events } = require("./Validation/EventNames")
const { customEvents } = require("./Validation/CustomEventNames")
const client = require('../client/discordBot')
const ticket = require('../events/ticket')
const globPromise = promisify(glob)

/**
 * @param {Client} client
 */
module.exports = async (client, Ascii) => { 
    const Table = new Ascii("Events");
    
    const eventFiles = await globPromise(`${process.cwd()}/events/**/*.js`);
    eventFiles.map( async (file) => {
        const event = require(file);
        const fileName = file.split(/(\\|\/)/g).pop()
        
        //CHECKING IF THE EVENT IS VALID
        if ( !event.name || ( !Events.includes(event.name) && !customEvents.includes(event.name) ) ) {
            const L = file.split("/");
            await Table.addRow(`${event.name || "MISSING"}`, `⛔ Event Name is either invalid or missing: ${L[6] + `/` + L[7]}`);
            return;
        }

        //EXECUTING EVENTS, CUSTOM EVENTS ARE ALREADY EXECUTED WHEN WE REQUIRE() THEM
        if(!customEvents.includes(event.name)){
            if (event.once) { // If the event is once
                client.once(event.name, (...args) => event.run(...args, client))
            } else { // If the event is not once i.e. on
                client.on(event.name, (...args) => event.run(...args, client))
            }
        } 

        //EVERYTHING IS RIGHT SO WE ADD THEM TO THE TABLE
        await Table.addRow(`${fileName}`,`${event.name}`, `✅ SUCCESSFUL`)
    });
    console.log(Table.toString())
};
const { glob } = require('glob')
const { promisify } = require('util')
const Ascii = require("ascii-table")
const globPromise = promisify(glob)
const { Perms } = require("./Validation/Permissions")

/**
 * @param {Client} client
 * @param {Ascii} Ascii
 */
module.exports = async (client, Ascii) => {
    const Table = new Ascii("Message Commands")

    const commandFiles = await globPromise(`${process.cwd()}/messageCommands/**/*.js`);
    commandFiles.map(async (file) => {
        const commandFile = require(file);
        const splitted = file.split("/");
        const directory = splitted[splitted.length - 2];

        if (!commandFile.description)
            return Table.addRow(commandFile.name, "🔸 FAILED", "Missing a description")

        if (commandFile.permissions) {
            if (Perms.includes(commandFile.permissions)) 
                commandFile.defaultPermission = false // The default premission should be for everyone
            else
                return Table.addRow(commandFile.name, "🔸 FAILED", "Permission is invalid")     
        }
        
        if (!commandFile.name)
            return Table.addRow(commandFile.split("/")[7], "🔸 FAILED", "Missing a name")
        
        const properties = { directory, ...commandFile };
        client.messageCommands.set(commandFile.name, properties);
        
        await Table.addRow(commandFile.name, "🔹 SUCCESSFUL")
    });
    console.log(Table.toString())

    /*
    Classic commands dont need to be imported to the guild like interaction commands.
    They just are accesed through client.messageCommands.
    Interaction commands do need to be imported so the API can show them on the interface.
    */
};
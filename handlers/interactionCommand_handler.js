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
    const Table = new Ascii("Interaction Commands");
    const arrayInteractionCommands = [];

    //Getting the Slashcommands and ContextMenuCommands from the files and pushing them to client.slashCommands and the array arrayInteractionCommands
    const slashCommands = await globPromise(`${process.cwd()}/interactionCommands/*/*/*.js`);
    slashCommands.map(async (file) => {
        const interactionCommandFile = require(file);
        const splitted = file.split("/");
        const directory = splitted[splitted.length - 2];

        //Checks if the command has name.
        if (!interactionCommandFile?.name) 
            return Table.addRow(file.split("/")[7], "🔸 FAILED", "Missing a name");

        //Checks if the command is an SlashCommand and has description.
        if (["CHAT_INPUT"].includes(interactionCommandFile.type) && !interactionCommandFile.description)
            return Table.addRow(interactionCommandFile.name, "🔸 FAILED", "Missing a description")

        //Deletes the description if is a ContextMenuCommand. 
        if (["MESSAGE", "USER"].includes(interactionCommandFile.type)) 
            delete interactionCommandFile.description;

        //CHECK IF THE PERMISSIONS OF THE INTERACTION COMMANDS ARE VALID PERMISSIONS.
        if (interactionCommandFile.permissions) {
            //If the command has a specific permission needed we are going to disable the command first.
            if (Perms.includes(interactionCommandFile.permissions))
                interactionCommandFile.defaultPermission = false
            else
                return Table.addRow(interactionCommandFile.name, "🔸 FAILED", "Permission is invalid")
        }
        
        //Adds the command to the array
        const properties = { directory, ...interactionCommandFile };
        client.interactionCommands.set(interactionCommandFile.name, properties); //client.interactionCommands.set(interactionCommandFile.name, interactionCommandFile);
        arrayInteractionCommands.push(interactionCommandFile);

        await Table.addRow(interactionCommandFile.name, "🔹 SUCCESSFUL")
    });

    console.log(Table.toString());

    ///ADDING INTERACTION COMMANDS AS GUILD COMMANDS OR APPLICATION COMMANDS
    client.on("ready", async () => {
        // await client.application.commands.set(arrayInteractionCommands); ????

        /// REGISTER FOR ALL GUILDS
        setInterval( async () => { //Once the bot is ready we need to re-do this for newer guilds
            await client.guilds.cache.forEach( guild => {
                guild.commands.set(arrayInteractionCommands) //Setting all the commands for the guild.
                    .then( (cmd) => { ///.THEN() FOR PERMISSION HANDLING ON INTERACTION COMMANDS FROM GUILD COMMANDS.

                        //FUNCTION, HIS JOB IS GETTING THE ROLES OF THE GUILD THAT ARE NOT MANAGED FROM DISCORD LIKE SERVER BOOSTER ROLE AND HAVE THE PERMISSIONS NEEDED FOR THE COMMAND
                        const getRoles = (commandName) => { 
                            //GETTING THE PERMISSIONS REQUIRED FOR THE SPECIFIC COMMAND
                            const permissions = arrayInteractionCommands.find( cmd => cmd.name === commandName).permissions;
                            if (!permissions) return null;   
                            return guild.roles.cache.filter( role => role.permissions.has(permissions) && !role.managed );
                        }; 

                        const fullPermissions = cmd.reduce( (accumulator, commandd) => {
                            const roles = getRoles(commandd.name); //At this point we have the roles that have the permissions that the command needs in order to function.
                            if(!roles) return accumulator;

                            const permissions = roles.reduce( (accumulator2, role) => { return [...accumulator2, {id: role.id, type: "ROLE", permission: true,},];}, []);
                            return [...accumulator, {id: commandd.id, permissions,},];
                        }, []);

                        // FINALLY SETTING THE PERMISSIONS FOR THE GUILD COMMANDS
                        guild.commands.permissions.set({ fullPermissions });
                    });
            })
        }, 20000)
    });
};



/*
/// Register for a single guild
const mainGuild = client.guilds.cache.get(client.config.devGuild);
await mainGuild.commands.set(arrayInteractionCommands) //Setting all the commands for the guild.
    .then( (cmd) => { ///.THEN() FOR PERMISSION HANDLING ON INTERACTION COMMANDS FROM GUILD COMMANDS.

        //FUNCTION, HIS JOB IS GETTING THE ROLES OF THE GUILD THAT ARE NOT MANAGED FROM DISCORD LIKE SERVER BOOSTER ROLE AND HAVE THE PERMISSIONS NEEDED FOR THE COMMAND
        const getRoles = (commandName) => { 
            //GETTING THE PERMISSIONS REQUIRED FOR THE SPECIFIC COMMAND
            const permissions = arrayInteractionCommands.find( cmd => cmd.name === commandName).permissions;
            if (!permissions) return null;   
            return mainGuild.roles.cache.filter( role => role.permissions.has(permissions) && !role.managed );
        }; 

        const fullPermissions = cmd.reduce( (accumulator, commandd) => {
            const roles = getRoles(commandd.name); //At this point we have the roles that have the permissions that the command needs in order to function.
            if(!roles) return accumulator;

            const permissions = roles.reduce( (accumulator2, role) => { return [...accumulator2, {id: role.id, type: "ROLE", permission: true,},];}, []);
            return [...accumulator, {id: commandd.id, permissions,},];
        }, []);

        // FINALLY SETTING THE PERMISSIONS FOR THE GUILD COMMANDS
        mainGuild.commands.permissions.set({ fullPermissions });
    });
*/
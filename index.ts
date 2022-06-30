const Discord = require("discord.js")
const client = new Discord.Client({ intents: ["GUILDS", "GUILD_MESSAGES"] })
require("dotenv").config()
client.login(process.env.TOKEN)



client.on("ready", ALIVE)
function ALIVE()
{
    console.log("BOT IS ACTIVE")
}

import DiscordJS, { Intents } from 'discord.js'
import dotenv from 'dotenv' // For the token
dotenv.config()

const client = new DiscordJS.Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES
    ]
})

client.on("ready", ()=>{
    console.log("IT IS ALIVE!")})

client.on("messageCreate", (message)=>{
    if (message.content === "marco"){
        message.reply({
            content: "polo"
        })
    }
})

client.login(process.env.TOKEN) 
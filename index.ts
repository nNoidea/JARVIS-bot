import { Message, TextChannel } from "discord.js"

const Discord = require("discord.js")
const client = new Discord.Client({ intents: ["GUILDS", "GUILD_MESSAGES"] })
require("dotenv").config()

client.login(process.env.TOKEN) // Log into discord
const currentYear = new Date().getFullYear(); // Gets the current year
let blacklist_categories = process.env.BLACK_LISTED_CATEGORIES?.split(",") // Gets the blacklisted categories where the bot shouldn't work


client.on("ready", ALIVE) // Logs when the bot is ready
function ALIVE() {
    console.log("BOT IS ACTIVE")
}

client.on("messageCreate", message_handler) // When a message send by someone, sends the message to `message_handler`
function message_handler(message: Message) {
    if (blacklist(message)) {
        archive_pdf_attachments(message)
        // ALL THE OTHER FUNCTIONS COME HERE!!!
    }
}


async function archive_pdf_attachments(message: Message) {
    let channel = message.channel
    if (!(channel instanceof TextChannel)) { return } // Makes sures no bad types get through

    let amount_of_attachments = message.attachments.size // Gets the amount of files
    let array: any = []

    if (amount_of_attachments > 0) {
        // filters out the pdf files and collects them in an array
        for (let i = 0; i < amount_of_attachments; i++) {
            let file_name = message.attachments.at(i)?.name // gets the file name
            let file_extension = get_file_extension(file_name!) // gets the file extension

            if (file_extension == "pdf") {
                array.push(message.attachments.at(i)) // Saves attachment that are a pdf into an array
            }
        }
        await channel.threads.fetchArchived() // Caches the archived threads, active ones are normally automatically cached. 'await' is needed, because the bot does not wait for that function and might continue executing following code without caching.

        let thread = channel.threads.cache.find((x: any) => x.name === `c - ${ currentYear }`);
        await thread?.setArchived(false); // Waits, because unarchiving is sometimes slower than the bot
        // If the thread does not exist, creates a thread
        if (thread == undefined) {
            thread = await create_thread(`c - ${ currentYear }`, channel)
        }

        // Sends all the files to the thread
        for (let x = 0; x < array.length; x++) {
            await thread.send({
                files: [array[x].attachment]
            })
        }
    }
    else { return 0 }
}


function blacklist(message: Message) {
    let channel = message.channel
    if (!(channel instanceof TextChannel)) { return } // Just making sure no funky buisness happens

    // Checks if the category the message is typed is blacklisted or not.
    let parentId = channel.parentId
    if (blacklist_categories?.find(element => element == parentId)) {
        console.log("Blacklisted")
        return false
    }
    else { return true }
}
function unarchive_thread(name: string, channel: TextChannel) {
    return null
}

// Creates a thread based on arguments
function create_thread(name: string, channel: TextChannel) {
    let thread = channel.threads.create({
        name: name,
        autoArchiveDuration: 10080 // By default we want the threads to be at max duration for visibility
    })
    return thread
}

// Gets the file extension
function get_file_extension(file_name: string) {
    let dot_index = file_name.lastIndexOf(".")
    let file_extension = file_name.substring(dot_index + 1) // +1 is there to not include the dot char itself
    return file_extension
}

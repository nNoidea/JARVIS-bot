import { Collection, Guild, Message, MessageAttachment, TextChannel, User } from "discord.js"

const Discord = require("discord.js")
const client = new Discord.Client({ intents: ["GUILDS", "GUILD_MESSAGES"] })
require("dotenv").config()

client.login(process.env.TOKEN) // Log into discord.
const currentYear = new Date().getFullYear(); // Gets the current year.

let blacklisted_servers = process.env.BLACKLISTED_SERVERS?.split(",") // Gets the blacklisted server list (mostly to ignore test servers etc).
let blacklisted_categories = process.env.BLACKLISTED_CATEGORIES?.split(",") // Gets the blacklisted categories where the bot shouldn't work.
let blacklisted_channels = process.env.BLACKLISTED_CHANNELS?.split(",")// Gets the blacklisted channels where the bot shouldn't work.
let blacklisted_users = process.env.BLACKLISTED_USERS?.split(",") // Gets the blacklisted user list.
let bot_id = process.env.BOT_ID // Bot's own id, to ignore his own messages if needed.


client.on("ready", ALIVE) // Logs when the bot is ready.
function ALIVE() {
    console.log("BOT IS ACTIVE")
}

client.on("messageCreate", message_handler) // When a message send by someone, sends the message to `message_handler`.
function message_handler(message: Message) {
    if (blacklist_server(message) && blacklist_category(message)) {
        archive_pdf_attachments(message)
        // ALL THE OTHER FUNCTIONS COME HERE!!!
    }
}


async function archive_pdf_attachments(message: Message) {
    let channel = message.channel
    if (!(channel instanceof TextChannel)) { return } // Makes sure no bad types get through

    let amount_of_attachments = message.attachments.size // Gets the amount of files
    let array: any = []

    if (amount_of_attachments > 0) {
        // Filters out the pdf files and collects them in an array.
        for (let i = 0; i < amount_of_attachments; i++) {
            let file_name = message.attachments.at(i)?.name // Gets the file name.
            let file_extension = get_file_extension(file_name!) // Gets the file extension.

            if (file_extension == "pdf") {
                array.push(message.attachments.at(i)) // Saves attachment that are a pdf into an array.
            }
        }

        let channel_name = channel.name
        let thread_name = `${ channel_name } - ${ currentYear }`

        let thread = await unarchive_thread(thread_name, channel)
        if (thread == false) {
            thread = await create_thread(thread_name, channel)
        }

        // Puts all the attachments in a single array
        let attachment_array: any = []
        for (let x = 0; x < array.length; x++) {
            attachment_array.push(array[x].attachment)
        }

        // Sends everything in 1 message, this permits async problems, 2 users sending files at the same time will still be separate in the thread
        let user_id = message.guild?.ownerId // Gets the id of the user
        await thread.send(vanilla_message(`:flushed: <@${ user_id }> :partying_face:`, [], attachment_array))
    }
    else { console.log("no attachments") }
}

// Sends a vanilla (not embedded) message. You can also mention users with text interpolation (`SOMETHING <@${ user_id }> SOMETHING`). 
// Leave the `notification_user_id_array` empty ([]) if you don't want anyone to get pinged, or fill it with user_id's to ping them.
// Also allows for sending attachments, leave it empty if there aren't any
function vanilla_message(message_content: string, notification_user_id_array = [], attachment_array = []) {
    let message: any = {
        content: message_content,
        allowedMentions: { users: notification_user_id_array },
        files: attachment_array
    }
    return message
}

// Ignores blacklisted servers
function blacklist_server(message: Message) {
    let server = message.guild
    if (!(server instanceof Guild)) { return } // Filtering out bad types.

    // Checks if the category the message is typed is blacklisted or not.
    let server_id = server.id
    if (blacklisted_servers?.find(element => element == server_id)) {
        console.log(`Blacklisted server | ${ server.name }: ${ server_id }`)
        return false
    }
    else { return true }
}

// Ignores blacklisted categories
function blacklist_category(message: Message) {
    let channel = message.channel
    if (!(channel instanceof TextChannel)) { return } // Just making sure no funky business happens

    // Checks if the category the message is typed is blacklisted or not.
    let parent_id = channel.parentId
    if (blacklisted_categories?.find(element => element == parent_id)) {
        console.log(`Blacklisted category | ${ channel.name } | ${ channel.parent?.name }: ${ parent_id }`)
        return false
    }
    else { return true }
}

//Unarchives the wanted thread and returns it
async function unarchive_thread(name: string, channel: TextChannel) {
    await channel.threads.fetchArchived() // Caches the archived threads, active ones are normally automatically cached. 'await' is needed, because the bot does not wait for that function and might continue executing following code without caching.

    let thread = channel.threads.cache.find((x: any) => x.name === name);
    thread?.setArchived(false); // Waits, because unarchiving is sometimes slower than the bot.
    if (thread == undefined) {
        return false
    }
    else { return thread }

}

// Creates a thread based on arguments
function create_thread(name: string, channel: TextChannel) {
    let thread = channel.threads.create({
        name: name,
        autoArchiveDuration: 10080 // By default we want the threads to be at max duration for visibility.
    })
    return thread
}

// Gets the file extension
function get_file_extension(file_name: string) {
    let dot_index = file_name.lastIndexOf(".")
    let file_extension = file_name.substring(dot_index + 1) // +1 is there to not include the dot char itself.
    return file_extension
}
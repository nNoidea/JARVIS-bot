require("dotenv").config()
const Discord = require("discord.js") // DON'T CHANGE THIS, IT WILL BREAK THE COMPILED JS FILE
const { GatewayIntentBits } = require('discord.js');
let needle = require('needle');
let fs = require(`fs`);

import { Guild, Message, TextChannel } from "discord.js"
const client = new Discord.Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent
	]
})

const whitelisted_servers: string[] = ["891008003908730961"] // Real server id.
//const whitelisted_servers: string[] = ["972173800508624936"] // Test server id.
const blacklisted_categories: string[] = ["892069299097854033", "974406410752389200", "893500599889453066", "921207383697555537", "892075698884333619", "921197835704205382", "973632998777970748", "970440283634417705"]
const blacklisted_channels: string[] = ["972174000430125126"]
const blacklisted_users: string[] = []
const bot_id = "923341724242313247"
const database_channel_id: string = "1000855719786066081"
const database_file = "database/database.txt"

const currentYear = new Date().getFullYear(); // Gets the current year.
let data_array: string[]

// -- Main functions. --

client.login(process.env.TOKEN) // Log into discord.
client.on("ready", ALIVE) // First function to be executed
async function ALIVE() {
	console.log("BOT IS ALIVE!")
	set_database()
}

client.on("messageCreate", message_handler) // When a message send by someone, sends the message to `message_handler`.
function message_handler(message: Message) {
	if (whitelist_server(message) && blacklisted(message)) {
		bad_get_user_score(message)
		archive_pdf_attachments(message)
	}
}

// -- Other functions.

async function archive_pdf_attachments(message: Message) {
	let channel = message.channel
	if (!(channel instanceof TextChannel)) { return } // Makes sure no bad types get through.

	let amount_of_attachments = message.attachments.size // Gets the amount of files.
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
		let user_id = message.author.id // Gets the id of the user.

		if (array.length > 0) {
			score_change(user_id, 1 * array.length)
			let channel_name = channel.name.toUpperCase() // This method returns the calling string value converted to uppercase.
			let thread_name = `ARCHIVE-${ channel_name }-${ currentYear }`

			let thread = await unarchive_thread(thread_name, channel)
			if (thread == false) {
				thread = await create_thread(thread_name, channel)
			}

			// Puts all the attachments in a single array.
			let attachment_array: any = []
			for (let x = 0; x < array.length; x++) {
				attachment_array.push(array[x].attachment)
			}

			let user_message = message.content // The content of the message.
			// Sends everything in 1 message, this permits async problems, 2 users sending files at the same time will still be separate in the thread.

			let user_name = message.author.username
			await thread.send(vanilla_message_create(`:star_struck: <@${ user_id }> :star_struck:\n ${ user_message }`, [], attachment_array))
			console.log(`FILE SEND BY: ${ user_name }: ${ user_id } - ${ user_message }`)
		}
	}
}

// Sends a vanilla (not embedded) message. You can also mention users with text interpolation (`SOMETHING <@${ user_id }> SOMETHING`). 
// Leave the `notification_user_id_array` empty ([]) if you don't want anyone to get pinged, or fill it with user_id's to ping them.
// Also allows for sending attachments, leave it empty if there aren't any
function vanilla_message_create(message_content: string = "", notification_user_id_array = [], attachment_array: any = []) {
	let message: any = {
		content: message_content,
		allowedMentions: { users: notification_user_id_array },
		files: attachment_array
	}
	return message
}


// for fast testing, need to change it into a slash command later
function bad_get_user_score(message: Message) {
	if (message.content == "Jarvis score") {
		let database = data_array
		let index = database.indexOf(message.author.id)
		let text = ""
		if (index != -1) {
			text = vanilla_message_create(database[index + 1])
		}
		else {
			text = "0"
		}
		message.channel.send(text)
	}
}

// Only allows whitelisted servers.
function whitelist_server(message: Message) {
	let server = message.guild
	if (!(server instanceof Guild)) { return } // Filtering out bad types.

	// Checks if the category the message is typed is blacklisted or not.
	let server_id = server.id
	if (whitelisted_servers?.find(element => element == server_id)) {

		return true
	}
	else {
		console.log(`Blacklisted server | ${ server.name }: ${ server_id }`)
		return false
	}
}



// Ignores blacklisted categories.
function blacklisted(message: Message) {
	let channel = message.channel
	let user = message.author
	// Just making sure no funky business happens, idk why TS does not requires the same for author.
	if (!(channel instanceof TextChannel)) { return }

	let category_id = channel.parentId
	let channel_id = channel.id
	let user_id = user.id
	// Check for blacklisted stuff
	if (user_id == bot_id) { // So that the bot does not react to his own messages.
		return false
	}
	else if (blacklisted_categories?.find(element => element == category_id)) {
		console.log(`Blacklisted category | ${ channel.parent?.name }: ${ category_id }`)
		return false
	}
	// Check for blacklisted channel
	else if (blacklisted_channels?.find(element => element == channel_id)) {
		console.log(`Blacklisted channel | ${ channel.name }: ${ channel_id }`)
		return false
	}
	// Check for blacklisted user
	else if (blacklisted_users?.find(element => element == user_id)) {
		console.log(`Blacklisted user | ${ user.username }: ${ user_id }`)
		return false
	}
	else { return true }
}

//Unarchives the wanted thread and returns it
async function unarchive_thread(name: string, channel: TextChannel) {
	await channel.threads.fetchArchived() // Caches the archived threads, active ones are normally automatically cached. 'await' is needed, because the bot does not wait for that function and might continue executing following code without caching.

	let thread = channel.threads.cache.find((x: any) => x.name == name);
	thread?.setArchived(false); // Waits, because unarchiving is sometimes slower than the bot.
	if (thread == undefined) {
		return false
	}
	else { return thread }
}

// Creates a thread based on arguments.
function create_thread(name: string, channel: TextChannel) {
	let thread = channel.threads.create({
		name: name,
		autoArchiveDuration: 10080 // By default we want the threads to be at max duration for visibility.
	})
	return thread
}

// Gets the file extension.
function get_file_extension(file_name: string): string {
	let dot_index = file_name.lastIndexOf(".")
	let file_extension = file_name.substring(dot_index + 1) // +1 is there to not include the dot char itself.
	return file_extension
}

// To be able to add further attributes to the database, each message will represent 1 sort of variable.
async function score_change(user_id: string, score_amount: number) {
	let index = data_array.indexOf(user_id)

	if (index != -1) {
		data_array[index + 1] = String(Number(data_array[index + 1]) + score_amount)
	}
	else {
		data_array.push(user_id + "," + String(score_amount))
	}

	let array_string = data_array.toString()
	fs.writeFileSync(database_file, array_string)

	let channel = await client.channels.cache.get(database_channel_id)
	await channel.send(vanilla_message_create("", [], [database_file]))
}

// Gets the message based on where the channel is and which message it is (ids).
function get_message(channel_id: string, message_id: string) {
	return client.channels.cache.get(channel_id).messages.fetch(message_id)
}

// Had to create a Promise, since createWriteStream() does not provide one.
function download_file(url: string, save_location: string) {
	return new Promise<void>((resolve, reject) => {
		needle.get(url).pipe(fs.createWriteStream(save_location)).on('done',
			function (err: any) {
				if (err) reject(err)

				resolve()
			})
	})
}

// Downloads the latest database version
async function set_database() {
	let channel = await client.channels.cache.get(database_channel_id) // Get channel.
	let last_message_id = channel.lastMessageId // Get last message id.
	let last_message = await get_message(database_channel_id, last_message_id) // Get last message.
	let url = last_message.attachments.at(0)?.url // Get the url of the last message's file.
	await download_file(url, database_file) // Download the file.

	let file: string[] = fs.readFileSync(database_file, 'utf8').replaceAll("\r", "").split(",") // replaceAll removes the carriages returns from
	data_array = file
	console.log("DATABASE READY")
}
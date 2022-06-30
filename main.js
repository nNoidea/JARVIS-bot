const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v10');
const Discord = require('discord.js');
const fs = require('fs');


const client = new Discord.Client({ intents: ['GUILDS', 'GUILD_MESSAGES', 'GUILD_MESSAGE_REACTIONS'] });


const dotenv = require('dotenv');
dotenv.config();
const TOKEN = process.env['TOKEN'];
const CLIENT_ID = process.env['BOT_ID']
const TEST_GUILD_ID = process.env['TEST_GUILD_ID'];
const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);


const commands = [];
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./other_commands').filter(file => file.endsWith('.js'));

console.log(commandFiles);

for (const file of commandFiles) {
    const command = require(`./other_commands/${file}`);
    console.log(command.data)
    commands.push(command.data.toJSON());
    console.log("tttt")
    client.commands.set(command.data.name, command);
}



(async () => {
    try {
        await rest.put(
            Routes.applicationGuildCommands(CLIENT_ID, TEST_GUILD_ID),
            { body: commands },
        );
    } catch (error) {
        console.error(error);
    }
})();


console.log("setup completed")

client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	const command = client.commands.get(interaction.commandName);
	if (!command) return;

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});
console.log("Bot is starting");
client.login(TOKEN)
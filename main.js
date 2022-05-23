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


for (const file of commandFiles) {
    const command = require(`./other_commands/${file}`);
    commands.push(command.data.toJSON());
    client.commands.set(command.data.name, command);
}



(async () => {
    try {
        console.log("test");
        await rest.put(
            Routes.applicationGuildCommands(CLIENT_ID, TEST_GUILD_ID),
            { body: commands },
        );
        console.log("test2");
    } catch (error) {
        console.error(error);
    }
})();



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

client.login(TOKEN)
const Discord = require('discord.js');
const fs = require('fs');

const client = new Discord.Client({ intents: ['GUILDS', 'GUILD_MESSAGES', 'GUILD_MESSAGE_REACTIONS'] });

const prefix = '!';

client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./tinygif').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(`./tinygif/${file}`);
  client.commands.set(command.name, command);
}


client.once('ready', () => {
    client.user.setPresence({
        status: 'online',
        activity: {
            name: '!help',
            type: 'PLAYING'
        }
    });
});


client.on('message', message => {
    if(!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).split(/ +/);
    const command = args.shift().toLowerCase();

    try {
        client.commands.get(command).execute(message, args);
    } catch (error) {
        console.error(error);
        message.reply('there was an error trying to execute that command!');
    }
});

client.login("OTY4MjMyNjIyNDAyNzExNTgy.GT4BQo.ULT2G09YBqagACvi66mPFt7AkwS2kIXGCRJQz0")
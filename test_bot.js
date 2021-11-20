
const Discord = require('discord.js')
const Config = require('./config');
const client = new Discord.Client();

var guild;

client.on('ready', () => {
    console.log(`${client.user.tag} ready!`);
    guild = client.guilds.cache.get('840180165665619998');
});

client.login(Config.discordTocens.testBot);
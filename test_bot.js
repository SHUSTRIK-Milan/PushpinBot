const Discord = require('discord.js');
const Config = require('./config');
const client = new Discord.Client();

var guild;
const dopBDmsg = `840180165665619998`;

client.on('ready', () => {
    console.log(`${client.user.tag} ready!`);
    guild = client.guilds.cache.get('814795850885627964');
});

//client.login(process.env.TestBOT_TOKEN);
client.login(`ODQwMjMwNTMxNjYwNTEzMjgw.YJVLqQ.Lr7HGn01gH50OUcHrHr4Rl-BpSM`);
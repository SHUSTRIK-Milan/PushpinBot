
const Discord = require('discord.js')
const Config = require('./config');
const client = new Discord.Client();

var guild;


client.on('ready', () => {
    console.log(`${client.user.tag} ready!`);
    guild = client.guilds.cache.get('840180165665619998');
});
client.on("messageDelete", (message) => {
    message.channel.send(message.author.username+' удалил сообщение: '+ message.content+message.channel.name)
})

client.on('message', (message) => {
    console.log(message.content);
    if(message.content == 'dest' && !message.author.bot){
        client.destroy();
    
    }
    if(message.content.toLowerCase() == "cock" && !message.author.bot){
        message.channel.send( ' Cock, please ')
    }
})

client.login(Config.discordTocens.testBot);


const Discord = require('discord.js')
const Config = require('./config');
const client = new Discord.Client();

var guild;


client.on('ready', () => {
    console.log(`${client.user.tag} ready!`);
    guild = client.guilds.cache.get('840180165665619998');
});
client.on("messageDelete", (message) => {
    message.channel.send(message.author.username+' удалил сообщение: '+message.content+'| Из: '+message.channel.name)
})

client.on('message', (message) => {
    console.log(message.content);
    if(message.content == 'dest' && !message.author.bot){
        client.destroy();
    
    }
    if(message.content.toLowerCase() == "cock" && !message.author.bot && message.channel.name !='adverts'){
        message.channel.send( ' Cock, please ')
    }
    if(message.author.bot == false && message.channel.name !='adverts' && message.content.toLowerCase() == "кусявка"){
        message.channel.send( 'Нет, блин, <@!473939629054361601>')
    }
    if(message.channel.name == 'adverts' && !message.author.bot && message.content.toLowerCase() == "apple") {
        message.channel.send( 'an apple a day keeps the doctor away', {files:['https://amaznginfo.com/wp-content/uploads/2016/03/green-apple-fruitwallpaper-1024x768.jpg']})
    }
    
})

client.login(Config.discordTocens.testBot);
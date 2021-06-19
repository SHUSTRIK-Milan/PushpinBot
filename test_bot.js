
const Discord = require('discord.js')
const Config = require('./config');
const client = new Discord.Client();

var guild;

function randomRange(min,max){
    let rand = min - 0.5 + Math.random() * (max - min + 1);
    return Math.round(rand);
}

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
        let apple_img;
        let rand = randomRange(1,4)
        console.log(rand);
        if(rand == 1) apple_img = `https://amaznginfo.com/wp-content/uploads/2016/03/green-apple-fruitwallpaper-1024x768.jpg`;
        if(rand == 2) apple_img = `https://www.gastronom.ru/binfiles/images/20160829/b15df714.jpg`;
        if(rand == 3) apple_img = `https://www.oblgazeta.ru/media/pressrelease_photos/65ee26bf961f702c062602c45af89af1d1fb1f409c2b49a407774021.jpg.1024x0_q85.jpg`;
        if(rand == 4) apple_img = `https://s0.rbk.ru/v6_top_pics/media/img/4/04/756183354675044.jpg`;

        message.channel.send( 'an apple a day keeps the doctor away', {files:[apple_img]})
    }
    if(message.channel.name == 'shust'){
        if(message.content == 'тест' && !message.author.bot){
            let filter = m => m.author.id === message.author.id
            message.channel.send('Write your Name')
            .then(() => {
                message.channel.awaitMessages(filter, {
                    max: 2,
                    time: 5000,
                    errors: ['time'],
                })
                .then(message => {
                    msgs = message.map(message => message)
                    msgs[0].channel.send(`Your Name is: ${msgs[0].content} ${msgs[1].content}`);
                })
                .catch(() => {
                    message.channel.send('You didnt write your name');
                });
            });
        }
    };
})

client.login(Config.discordTocens.testBot);
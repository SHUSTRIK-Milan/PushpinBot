
const Discord = require('discord.js')
const Config = require('./config');
const client = new Discord.Client();
const bdChannel = `863714740023197707`
const bdMsg = `863715737469583370`
var t = false

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

async function checkBD(text, messageG){
    let chnl = guild.channels.cache.get(bdChannel)
    let msg = await chnl.messages.fetch(bdMsg)
    let nMsg = msg.content.split('\n')

    let outF = nMsg.find(n => n.split('^')[0].toLowerCase() == text.toLowerCase())
    console.log(outF)

    if(outF != undefined && t == false) messageG.channel.send(`${outF.split('^')[1]} (от ${outF.split('^')[2]})`)
    if(outF == undefined && t == false){
        let filter = m => m.author.id === messageG.author.id && m.author.bot === false
        t = true
        messageG.channel.send('Я не знаю как мне на это ответить. Напиши, как мне на это отвечать:')
        .then(() => {
            messageG.channel.awaitMessages(filter, {
                max: 1,
                time: 10000,
                errors: ['time'],
            })
            .then(message => {
                msgs = message.map(message => message)
                let ed = `${msg.content}\n${messageG.content}^${msgs[0].content}^<@!${msgs[0].author.id}>`

                if(ed.length < 1800){
                    messageG.channel.send('Спасибо!');
                    msg.edit(ed)
                }
                if(ed.length > 1800){
                    messageG.channel.send('Ой... кажется моя память переполнена. Я все забыл. Давайте по новой!');
                    msg.edit(nMsg[0])
                }
                t = false
            })
            .catch(() => {
                messageG.channel.send('Вы так и не сказали, как мне на это отвечать.');
                t = false
            });
        });
        
    }
    return msg
}



client.on('message', (message) => {
    console.log(message.content);
    /* if(message.content == 'dest' && !message.author.bot){
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
    
    if(message.content == 'тест' && !message.author.bot){
        message.channel.createWebhook('test      ').then(hook => hook.send(message.content))
    }; */

    if(message.content.slice(0,4) == 'send'){
        message.channel.send(message.content.slice(4))
    }

    if(message.channel.id == '863714747161116672' && !message.author.bot){
        checkBD(message.content, message)
    }
})

client.login(Config.discordTocens.testBot);
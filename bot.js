const Discord = require('discord.js');
const client = new Discord.Client();
const prefix = '#';

let streets = [
    {
        name: 'Белт-Паркуэй',
        id: '001',
        radius: ['Бродвей']
    },
    {
        name: 'Бродвей',
        id: '002',
        radius: ['Белт-Паркуэй', 'Парк-авеню']
    },
    {
        name: 'Парк-авеню',
        id: '003',
        radius: ['Бродвей']
    }
];


client.on('ready', () => {
  console.log(`${client.user.tag} ready!`);
});

client.on('message', message => {
    let mb = message.author.bot;

    if (message.content.slice(0,12).toLowerCase() == `${prefix}осмотреться` && mb == false){
        message.delete();

        if(message.channel.name == "улица"){
            let out = streets.find(st => st.name == message.channel.parent.name);

            if (out != null){
                message.author.send(`Соседние улицы: ${out.radius.join(', ')}.`);
            };
        };
    };

    if (message.content.slice(0,5).toLowerCase() == `${prefix}идти` && mb == false){

        let homestreet = streets.find(st => st.name == message.channel.parent.name);
        let walkway = homestreet.radius.find(st => st.toLowerCase() == message.content.slice(6).toLowerCase());
        message.delete();

        if (walkway != null && message.channel.permissionOverwrites.get(message.author.id) != null){
            client.channels.cache.find(cat => cat.name == walkway).updateOverwrite(message.author, { VIEW_CHANNEL: true });
            message.channel.parent.permissionOverwrites.get(message.author.id).delete();
        }else{
            message.author.send(`Вероятнее всего улицы ${message.content.slice(6)} нет, либо вы ввели ее неправильно.`);
        };
    };

    if(message.content.slice(0,5).toLowerCase() == `${prefix}send` && message.author.id == `621917381681479693`){	
        let argsTx = message.content.slice(6, message.content.length);
    
        if(mb) return;	
        message.delete();	
        message.channel.send(`${argsTx}`);	
    };

});

client.login(process.env.BOT_TOKEN);
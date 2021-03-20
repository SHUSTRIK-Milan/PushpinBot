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

    if (message.content.slice(0,12).toLowerCase() == `${prefix}осмотреться` && message.channel.name == "улица" && mb == false){
        let out = streets.find(st => st.name == message.channel.parent.name);
        message.delete();

        if (out != null){
            message.author.send(`Соседние улицы: ${out.radius.join(', ')}.`);
            console.log(out);
        };
    };

    if (message.content.slice(0,5).toLowerCase() == `${prefix}идти` && mb == false){

        let homestreet = streets.find(st => st.name == message.channel.parent.name);
        let walkway = homestreet.radius.find(st => st.toLowerCase() == message.content.slice(6).toLowerCase());
        
        console.log(message.content.slice(0,5).toLowerCase());
        console.log(homestreet);
        console.log(homestreet.radius);
        console.log(walkway);

        /* if (walkway != null)
            client.channels.fetch(botChannelID)
                .then(channel => {
                channel.updateOverwrite(member, { VIEW_CHANNEL: true }
                )}); */

        if (walkway != null){
            client.channels.cache.find(cat => cat.name == walkway).updateOverwrite(message.author, { VIEW_CHANNEL: true });
            message.channel.parent.updateOverwrite(message.author, { VIEW_CHANNEL: false });
        }else{
            message.author.send(`Вероятнее всего улицы ${message.content.slice(6).toLowerCase()} нет, либо вы ввели ее неправильно.`);
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
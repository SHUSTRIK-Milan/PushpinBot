const Discord = require('discord.js');
const client = new Discord.Client();
const prefix = '!';

let streets = [
    {
        name: 'Белт-Паркуэй',
        id: '001',
        radius: ['Парк-авеню', 'Бродвей']
    },
    {
        name: 'Бродвей',
        id: '002',
        radius: ['Белт-Паркуэй', 'Парк-авеню']
    },
    {
        name: 'Парк-авеню',
        id: '003',
        radius: ['Бродвей', 'Белт-Паркуэй']
    }
];


client.on('ready', () => {
  console.log(`${client.user.tag} ready!`);
});

client.on('message', message => {
    let mb = message.author.bot;

    /* if (mb != true){
        let out = streets.find(st => st.name == message.channel.parent.name);

        if (out != null){
            message.channel.send(`Соседние улицы: ${out.radius.join(', ')}.`);
            console.log(out);
        };
    }; */

    if(message.content.slice(6).toLowerCase() == "send" && message.author.id == `621917381681479693`){	
        let argsTx = message.content.slice(6, message.content.length);
    
        if(mb) return;	
        message.delete();	
        message.channel.send(`${argsTx}`);	
    };

});

client.login(process.env.BOT_TOKEN);
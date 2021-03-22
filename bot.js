const Discord = require('discord.js');
const client = new Discord.Client();
const prefix = '!';

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
    const command = message.content.split(' ',2);
    const args = message.content.slice(separator.join(' ').length+1);

    let mb = message.author.bot;

    if (command[1] == `${prefix}осмотреться` && mb == false){
        message.delete();

        if(message.channel.name == "улица"){
            let out = streets.find(st => st.name == message.channel.parent.name);

            if (out != null){
                message.author.send(`Соседние улицы: ${out.radius.join(', ')}.`);
            };
        };
    };

    if (command[1] == `${prefix}идти` && mb == false && message.channel.name == 'улица'){
        if (command[2] == "на"){
            let homestreet = streets.find(st => st.name == message.channel.parent.name);
            let walkway = homestreet.radius.find(st => st.toLowerCase() == args.toLowerCase());
            message.delete();

            if (walkway != null && message.channel.permissionOverwrites.get(message.author.id) != null){
                client.channels.cache.find(cat => cat.name == walkway).updateOverwrite(message.author, { VIEW_CHANNEL: true });
                message.channel.parent.permissionOverwrites.get(message.author.id).delete();
            }else if (walkway == null && streets.find(st => st.name.toLowerCase() == args.toLowerCase())){
                message.author.send(`${args} не является соседней улицей с ${homestreet.name}.`);
            }else{
                message.author.send(`Вероятнее всего улицы ${args} нет, либо вы ввели ее неправильно.`);
            };
        };
    };

    if(command[1] == `${prefix}send` && message.author.id == `621917381681479693`){	
        if(mb) return;	
        message.delete();	
        message.channel.send(`${args}`);	
    };

});

client.login(process.env.BOT_TOKEN);
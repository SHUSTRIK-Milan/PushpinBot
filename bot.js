const Discord = require('discord.js');
const client = new Discord.Client();
const prefix = '!';

const street = [
    {
        name: 'Белт-Паркуэй',
        id: '001',
        radius: ['Бродвей'],
        desc: 'Прекрасный город. Отличное начало жизни в этом городе.',
        objects: [
            {
                name: 'Магазин',
                id: '001',
                addCondition: null
            },
            {
                name: 'Туалет',
                id: '0011',
                addCondition: 'Магазин'
            },
            {
                name: 'Дом-1',
                id: '002',
                addCondition: null
            }
        ]
    },
    {
        name: 'Бродвей',
        id: '002',
        radius: ['Белт-Паркуэй', 'Парк-авеню'],
        desc: 'Центр города.',
        objects: [
            {
                name: 'Полицейский Департамент',
                id: '001',
                addCondition: null
            }
        ]
    },
    {
        name: 'Парк-авеню',
        id: '003',
        radius: ['Бродвей'],
        desc: 'Самая зеленая улица города.',
        objects: [
            {
                name: 'Завод',
                id: '001',
                addCondition: null
            }
        ]
    }
];


client.on('ready', () => {
  console.log(`${client.user.tag} ready!`);
});

client.on('message', message => {
    const command = message.content.split(' ',2);
    const args = message.content.slice(command.join(' ').length+1);

    let mb = message.author.bot;

    if (command[0] == `${prefix}осмотреться` && mb == false){
        message.delete();
        let homestreet = street.find(st => st.name.toLowerCase() == message.channel.parent.name.toLowerCase());

        if(message.channel.name == "улица"){
            let objects = [];

            for (let pobj of homestreet.objects) if (pobj.addCondition == null) objects.push(pobj.name);

            if (homestreet != null){
                message.author.send(`Соседние улицы с ${homestreet.name}: ${homestreet.radius.join(', ')}.\nБлижайшие объекты: ${objects.join(', ')}.`);
            };
        }else if(homestreet.objects.filter(ob => ob.addCondition.toLowerCase() == message.channel.name.toLowerCase()) != null){
            let objects = [];
            let ofObj = homestreet.objects.filter(ob => ob.addCondition.toLowerCase() == message.channel.name.toLowerCase());

            for(let obj of ofObj) objects.push(obj.name);

            if (homestreet != null && objects != null){
                message.author.send(`Ближайшие помещения: ${objects.join(', ')}.`);
            };
        };
    };

    if (command[0] == `${prefix}идти` && mb == false && message.channel.name == 'улица'){
        if (command[1] == "на"){
            let homestreet = street.find(st => st.name == message.channel.parent.name);
            let walkway = homestreet.radius.find(st => st.toLowerCase() == args.toLowerCase());
            message.delete();

            if (walkway != null && message.channel.permissionOverwrites.get(message.author.id) != null){
                client.channels.cache.find(cat => cat.name == walkway).updateOverwrite(message.author, { VIEW_CHANNEL: true });
                message.channel.parent.permissionOverwrites.get(message.author.id).delete();
            }else if (walkway == null && street.find(st => st.name.toLowerCase() == args.toLowerCase())){
                message.author.send(`${args} не является соседней улицей с ${homestreet.name}.`);
            }else{
                message.author.send(`Вероятнее всего улицы ${args} нет, либо вы ввели ее неправильно.`);
            };
        };
    };

    if(command[0] == `${prefix}send` && message.author.id == `621917381681479693`){	
        if(mb) return;	
        message.delete();	
        message.channel.send(`${args}`);	
    };

});

client.login(process.env.BOT_TOKEN);
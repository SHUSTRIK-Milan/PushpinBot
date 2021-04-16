const Discord = require('discord.js');
const Config = require('./config');
const client = new Discord.Client();
const prefix = '!';

let guild;

client.on('ready', () => {
    console.log(`${client.user.tag} ready!`);
    guild = client.guilds.cache.get('814795850885627964');

    let offlinemember = guild.members.cache.filter(m => m.presence.status === 'offline').size;
    let member = guild.memberCount;
    let onlinemember = member - offlinemember - 1;

    if (onlinemember > 0){
      client.user.setPresence({
        status: "online",
        activity: {
            name: `на ${onlinemember} участников!`,
            type: "WATCHING",
        }
      });
    }else if (onlinemember == 0){
      client.user.setPresence({
        status: "idle",
        activity: {
            name: `в пустоту.`,
            type: "WATCHING",
        }
      });
    }
});

client.on('presenceUpdate', (om,nm) => {
    let offlinemember = guild.members.cache.filter(m => m.presence.status === 'offline').size;
    let member = guild.memberCount;
    let onlinemember = member - offlinemember - 1;

    if (onlinemember > 0){
      client.user.setPresence({
        status: "online",
        activity: {
            name: `на ${onlinemember} участников!`,
            type: "WATCHING",
        }
      });
    }else if (onlinemember == 0){
      client.user.setPresence({
        status: "idle",
        activity: {
            name: `в пустоту.`,
            type: "WATCHING",
        }
      });
    }
});

function member(nick, name, money, status, car) {
    this.nick = nick;
    this.name = name;
    this.money = money;
    this.status = status;
    this.car = car;
};

async function GetStats(idChl, idMsg) {
    let channel = client.channels.cache.get(idChl);
    let msg = await channel.messages.fetch(idMsg);
    try{
        mainArray = [];
        let messageNormal = msg.content.split('\n');
        messageNormal.splice(0,1);
        for(let msg of messageNormal){
            let split = msg.split(':');
            if (split[0] != ''){
                mainArray.push(split);
            }else{
                split.splice(0,1);
                mainArray.push(split);
            }
        };
        membersArray = [];
        for(let i of mainArray){
            var newMember = new member(i[0], i[1], i[2]);
            membersArray.push(newMember);
        };
        return membersArray;
    }catch{
        return null;
    };
};

async function SetStats(idChl, idMsg, nick, id, SteamID) {
    let channel = client.channels.cache.get(idChl);
    let msg = await channel.messages.fetch(idMsg);
    try{
        msg.edit(msg.content + `\n:${nick}:${id}:${SteamID}`)
        return;
    }catch{
        return null;
    };
};

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
                addCondition: ''
            },
            {
                name: 'Туалет',
                id: '0011',
                addCondition: 'Магазин'
            },
            {
                name: 'Дом-1',
                id: '002',
                addCondition: ''
            },
            {
                name: 'Дом-2',
                id: '003',
                addCondition: ''
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
                addCondition: ''
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
                addCondition: ''
            }
        ]
    }
];

function sendLog(message,cat,act,status,add){
    let img;
    if (status == 'Успешно') img = `https://i.imgur.com/cjSSwtu.png`;
    if (status == 'Ошибка') img = `https://i.imgur.com/utuBexR.png`;

    let color = 11645371;
    if (cat == 'Админ') color = 4105807;
    if (cat == 'Глобальное') color = 14560833;
    if (cat == 'Общее') color = 11645371;

    if (add.slice(0,1) == prefix) act = 'Воспользовался командой.';

    if(Object.values(Config.BLChannelsID).find(chl => chl == message.channel.id) == null){
        client.channels.cache.get(Config.BLChannelsID.logsId).send({embed: {
            color: color,
            author: {
                name: message.author.username,
                icon_url: message.author.avatarURL()
            },
            thumbnail: {
                url: img
            },
            title: `[${cat}] ${act}`,
            fields: [{
                name: `Допольнительно:`,
                value: `${add}`
            }],
            
            timestamp: new Date()
            }
        });

        return;
    }else{
        return;
    }
};

function comand(message){
    let msg = message.content;
    let com = {
        сom: msg.split(" ", 1).join('').slice(0,prefix.length),
        arg: msg.slice(com.length+prefix.length+1),
        slArg: arg.splite(" ")
    }
    return com;
};

client.on('messageDelete', (message) => {
    sendLog(message,'Общее','Сообщение удалено.','Успешно',`Содержимое сообщения: ${message.content}`)
});

client.on('message', message => {
    const command = message.content.split(' ',2);
    const args = message.content.slice(command.join(' ').length+1);

    let mb = message.author.bot;

    sendLog(message,`Общее`,`Отправил сообщение.`,`Успешно`,message.content);

    console.log(comand().com);
    console.log(comand().arg);
    console.log(comand().slArg);

    if (command[0] == `${prefix}осмотреться` && mb == false){
        message.delete();
        let homestreet = street.find(st => st.name.toLowerCase() == message.channel.parent.name.toLowerCase());

        if(message.channel.name == "улица"){
            let objects = [];

            for (let pobj of homestreet.objects) if (pobj.addCondition == '') objects.push(pobj.name);

            if (homestreet != null){
                message.author.send(`Соседние улицы с ${homestreet.name}: ${homestreet.radius.join(', ')}.\nБлижайшие объекты: ${objects.join(', ')}.`);
                sendLog(message,`Общее`,`Осмотрелся на улице.`,`Успешно`,`Вывод: Соседние улицы с ${homestreet.name}: ${homestreet.radius.join(', ')}.\nБлижайшие объекты: ${objects.join(', ')}.`);
            };
        }else if(homestreet.objects.filter(ob => ob.addCondition.toLowerCase() == message.channel.name.toLowerCase()) != null){
            let objects = [];

            for (let pobj of homestreet.objects) if (pobj.addCondition.toLowerCase() == message.channel.name.toLowerCase()) objects.push(pobj.name);

            if (homestreet != null && objects != null){
                message.author.send(`Ближайшие помещения: ${objects.join(', ')}.`);
                sendLog(message,`Общее`,`Осмотрелся в объекте.`,`Успешно`,`Вывод: Ближайшие помещения: ${objects.join(', ')}.`);
            };
        }else{
            message.author.send(`Вызов команды \`осмотреться\` должны выполнятся на улицах или внутри помещений.`);
            sendLog(message,`Общее`,`Попытался осмотреться.`,`Ошибка`,`Вызов команды \`осмотреться\` должны выполнятся на улицах или внутри помещений.`);
        };
    };

    if (command[0] == `${prefix}идти` && mb == false){
        message.delete();
        let homestreet = street.find(st => st.name == message.channel.parent.name);

        if (command[1] == "на" && message.channel.name == 'улица'){
            let walkway = homestreet.radius.find(st => st.toLowerCase() == args.toLowerCase());

            if (walkway != null && message.channel.parent.permissionOverwrites.get(message.author.id) != null){
                let cat = client.channels.cache.find(cat => cat.name == walkway);
                if (cat.type == 'category'){
                    client.channels.cache.find(cat => cat.name == walkway).updateOverwrite(message.author, { VIEW_CHANNEL: true });
                    message.channel.parent.permissionOverwrites.get(message.author.id).delete();
                    sendLog(message,`Общее`,`Пошел.`,`Успешно`,`Перешел с ${homestreet.name} на ${walkway}.`);
                };
            }else if (walkway == null && street.find(st => st.name.toLowerCase() == args.toLowerCase()) != null){
                message.author.send(`${args} не является соседней улицей с ${homestreet.name}.`);
                sendLog(message,`Общее`,`Попытался пойти.`,`Ошибка`,`Вывод: ${args} не является соседней улицей с ${homestreet.name}.`);
            }else{
                message.author.send(`Вероятнее всего улицы ${args} нет, либо вы ввели ее неправильно.`);
                sendLog(message,`Общее`,`Попытался пойти.`,`Ошибка`,`Вывод: Вероятнее всего улицы ${args} нет, либо вы ввели ее неправильно.`);
            };
        }else if (command[1] == "в"){
            let walkway = homestreet.objects.find(st => st.name.toLowerCase() == args.toLowerCase());
        }else{
            message.author.send(`Вызов команды \`идти\` должны выполнятся с дополнительными аргументами: на - для перехода на улицу или в - для перехода в помещение/объект.`);
            sendLog(message,`Общее`,`Попытался пойти.`,`Ошибка`,`Вывод: Вызов команды \`идти\` должны выполнятся с дополнительными аргументами: на - для перехода на улицу или в - для перехода в помещение/объект.`);
        }
    };

    if(command[0] == `${prefix}send` && message.author.id == `621917381681479693`){	
        if(mb) return;	
        message.delete();	
        message.channel.send(`${args}`);	
    };

    if(command[0] == `${prefix}очистить` && mb == false && message.guild.member(message.author).roles.cache.get(`822493460493500436`) != null){
        let arg = parseInt(command[1]);
        
        if (arg > 0 && arg < 100){
            message.channel.bulkDelete(arg, true);
            sendLog(message,`Админ`,`Удалил сообщения.`,`Успешно`,`Удалено ${arg} сообщений.`);
        }else if (arg >= 100){
            sendLog(message,`Админ`,`Попытался удалить сообщения.`,`Ошибка`,`Попытка удалить более 100 сообщений.`);
        }else{
            sendLog(message,`Админ`,`Попытался удалить сообщения.`,`Ошибка`,`Неверный аргумент.`);
        };
    };

    const Exargs = message.content.slice(prefix.length).trim().split(' ');
    const Excommand = Exargs.shift();
    
    if(Excommand.toLowerCase() == "edit" && message.author.id == `621917381681479693`){

      const argsTx = message.content.slice(prefix.length).split(`${Excommand} `).join('').split(`${Exargs[0]} `).join('').split(`${Exargs[1]} `).join('')

      message.channel.guild.channels.cache.find(id => id == `${Exargs[0]}`).messages.fetch(`${Exargs[1]}`)
        .then(message =>{

          if(!message.author.bot) return;
          message.edit(`${argsTx}`);
        
        })
        .catch(console.error);
    };

});

client.login(process.env.BOT_TOKEN);

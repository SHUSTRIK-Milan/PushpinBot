const Discord = require('discord.js');
const Config = require('./config');
const Func = require('./func');

const client = new Discord.Client();

const prefix = '!';
const BDpref = '^';

var guild;
var BDchnl = `833225101218152459`;
var dopBDmsg = `833260237481705502`;

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

client.on('messageDelete', (message) => {
    Func.sendLog(message,'Общее',`Сообщение удалено`,'Успешно',`Содержимое сообщения: ${message.content}`)
});

client.on('message', message => {
    let mb = message.author.bot;

    Func.sendLog(message,`Общее`,`Отправил сообщение.`,`Успешно`,`${message.content}`);

    if (Func.comand(message).com == 'осмотреться' && mb == false){
        message.delete();
        let homestreet = Config.street.find(st => st.name.toLowerCase() == message.channel.parent.name.toLowerCase());

        if(message.channel.name == "улица"){
            let objects = [];

            for (let pobj of homestreet.objects) if (pobj.addCondition == '') objects.push(pobj.name);

            if (homestreet != null && objects.join(', ') != ''){
                message.author.send(`Соседние улицы с ${homestreet.name}: ${homestreet.radius.join(', ')}.\nБлижайшие объекты: ${objects.join(', ')}.`);
                Func.sendLog(message,`Общее`,`Осмотрелся на улице.`,`Успешно`,`Вывод: Соседние улицы с ${homestreet.name}: ${homestreet.radius.join(', ')}.\nБлижайшие объекты: ${objects.join(', ')}.`);
            }else{
                message.author.send(`Соседние улицы с ${homestreet.name}: ${homestreet.radius.join(', ')}.\nБлижайшие объекты отсутствуют.`);
                Func.sendLog(message,`Общее`,`Осмотрелся на улице.`,`Успешно`,`Вывод: Соседние улицы с ${homestreet.name}: ${homestreet.radius.join(', ')}.\nБлижайшие объекты отсутствуют.`);
            };
        }else if(homestreet.objects.filter(ob => ob.addCondition.toLowerCase() == message.channel.name.toLowerCase()) != null){
            let objects = [];

            for (let pobj of homestreet.objects) if (pobj.addCondition.toLowerCase() == message.channel.name.toLowerCase()) objects.push(pobj.name);

            if (homestreet != null && objects.join(', ') != ''){
                message.author.send(`Ближайшие помещения: ${objects.join(', ')}.`);
                Func.sendLog(message,`Общее`,`Осмотрелся в объекте.`,`Успешно`,`Вывод: Ближайшие помещения: ${objects.join(', ')}.`);
            }else{
                message.author.send(`Ближайшие помещения отсутствуют.`);
                Func.sendLog(message,`Общее`,`Осмотрелся в объекте.`,`Успешно`,`Вывод: Ближайшие помещения отсутствуют.`);
            };
        }else{
            message.author.send(`Вызов команды \`осмотреться\` должны выполнятся на улицах или внутри помещений.`);
            Func.sendLog(message,`Общее`,`Попытался осмотреться.`,`Ошибка`,`Вызов команды \`осмотреться\` должны выполнятся на улицах или внутри помещений.`);
        };
    };

    if (Func.comand(message).com == 'идти' && mb == false){
        message.delete();
        let homestreet = Config.street.find(st => st.name == message.channel.parent.name);

        if (Func.comand(message).sarg[0] == 'на' && message.channel.name == 'улица'){
            let walkway = homestreet.radius.find(st => st.toLowerCase() == Func.comand(message).arg);

            if (walkway != null && message.channel.parent.permissionOverwrites.get(message.author.id) != null){
                let cat = client.channels.cache.find(cat => cat.name == walkway);
                if (cat.type == 'category'){
                    client.channels.cache.find(cat => cat.name == walkway).updateOverwrite(message.author, { VIEW_CHANNEL: true });
                    message.channel.parent.permissionOverwrites.get(message.author.id).delete();
                    Func.sendLog(message,`Общее`,`Пошел.`,`Успешно`,`Перешел с ${homestreet.name} на ${walkway}.`);
                };
            }else if (walkway == null && Config.street.find(st => st.name.toLowerCase() == Func.comand(message).arg) != null){
                message.author.send(`${Func.comand(message).arg} не является соседней улицей с ${homestreet.name}.`);
                Func.sendLog(message,`Общее`,`Попытался пойти.`,`Ошибка`,`Вывод: ${Func.comand(message).arg} не является соседней улицей с ${homestreet.name}.`);
            }else{
                message.author.send(`Вероятнее всего улицы ${Func.comand(message).arg} нет, либо вы ввели ее неправильно.`);
                Func.sendLog(message,`Общее`,`Попытался пойти.`,`Ошибка`,`Вывод: Вероятнее всего улицы ${Func.comand(message).arg} нет, либо вы ввели ее неправильно.`);
            };
        }else if (Func.comand(message).sarg[0] == 'в'){
            let walkway = homestreet.objects.find(st => st.name.toLowerCase() == Func.comand(message).arg);
        }else{
            message.author.send(`Вызов команды \`идти\` должны выполнятся с дополнительными аргументами: на - для перехода на улицу или в - для перехода в помещение/объект.`);
            Func.sendLog(message,`Общее`,`Попытался пойти.`,`Ошибка`,`Вывод: Вызов команды \`идти\` должны выполнятся с дополнительными аргументами: на - для перехода на улицу или в - для перехода в помещение/объект.`);
        }
    };

    if(Func.comand(message).com == `send` && message.author.id == `621917381681479693`){	
        if(mb) return;	
        message.delete();	
        message.channel.send(`${Func.comand(message).arg}`);	
    };

    if(Func.comand(message).com == `clear` && mb == false && message.guild.member(message.author).roles.cache.get(`822493460493500436`) != null){
        let arg = parseInt(Func.comand(message).sarg[0]);
        
        if (arg > 0 && arg < 100){
            message.channel.bulkDelete(arg+1, true);
            Func.sendLog(message,`Админ`,`Удалил сообщения.`,`Успешно`,`Удалено ${arg} сообщений.`);
        }else if (arg >= 100){
            Func.sendLog(message,`Админ`,`Попытался удалить сообщения.`,`Ошибка`,`Попытка удалить более 100 сообщений.`);
        }else{
            Func.sendLog(message,`Админ`,`Попытался удалить сообщения.`,`Ошибка`,`Неверный аргумент.`);
        };
    };
    
    if(Func.comand(message).com == `edit` && message.author.id == `621917381681479693`){
        message.delete();
        message.channel.guild.channels.cache.find(id => id == `${Func.comand(message).sarg[0]}`).messages.fetch(`${Func.comand(message).sarg[1]}`)
        .then(msg =>{

            if(!msg.author.bot) return;
            msg.edit(Func.comand(message,2).carg);
        
        })
        .catch(console.error);
    };

    if(Func.comand(message).com == `sbd` && guild.member(message.author).roles.cache.get(`822493460493500436`) != null){
        message.delete();
        Func.SetStats(`${message.author.username}`,`${Math.random()}`,`В розыске`,`Отсутствует`,`<@${message.author.id}>`,`${Math.random()}`);
    }; 

});

client.login(process.env.BOT_TOKEN);

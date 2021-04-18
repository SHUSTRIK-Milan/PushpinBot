const Discord = require('discord.js');
const Config = require('./config');
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

function member(nick, name, money, status, car, user, steamID) {
    this.nick = nick;
    this.name = name;
    this.money = money;
    this.status = status;
    this.car = car;
    this.user = user;
    this.steamID = steamID;
};

async function GetStats() {
    let channel = client.channels.cache.get(BDchnl); //получаем канал в котором находится наша БД
    let oMsg = await channel.messages.fetch(dopBDmsg);
    let nMsg = oMsg.content.split('\n');
    let fMsg = nMsg[nMsg.length-1].split(BDpref);
    if (fMsg[0] == ''){
        fMsg.splice(0,1);
    };
    let msg = await channel.messages.fetch(fMsg[0]); //подключаемся к сообщению, получая о нем все данные.
    try{
        mainArray = []; //задаем новый массив X
        let messageNormal = msg.content.split('\n'); //массив, который разбивает сообщение на строки (\n)
        messageNormal.splice(0,1); //удаляем первый элемент всех строк, так как это название БД.
        for(let msg of messageNormal){ //перебераем строки сообщения и задаем каждой строке переменную msg
            let split = msg.split(BDpref); //разделяем каждое сообщение по двоеточиям, задавая переменную split
            if (split[0] != ''){ //проверка на пустоту элементов. Если не пустой, то запускаем разделеное сообщение в массив X
                mainArray.push(split);
            }else{
                split.splice(0,1); //Если пустой, то удаляем пустой элемент и делаем ту-же операцию.
                mainArray.push(split);
            }
        };
        membersArray = []; //задаем массив участников
        for(let i of mainArray){ //перебераем массив X со всеми данными и сортируем их в объект member, который отправляем в массив участников
            var newMember = new member(i[0], i[1], i[2], i[3], i[4], i[5], i[6]);
            membersArray.push(newMember);
        };
        return membersArray; //возвращаем массив участников
    }catch{
        return null;
    };
};

async function SetStats(nick, money, status, car, user, steamID) {
    let channel = client.channels.cache.get(BDchnl); //получаем канал в котором находится наша БД
    let oMsg = await channel.messages.fetch(dopBDmsg); //получаем сообщение доп бд
    let nMsg = oMsg.content.split('\n'); //разделяем доп бд на строки
    let fMsg = nMsg[nMsg.length-1].split(BDpref); //получаем последние данные в доп бд
    if (fMsg[0] == ''){
        fMsg.splice(0,1);
    };
    let msg = await channel.messages.fetch(fMsg[0]); //подключаемся к сообщению, получая о нем все данные.
    try{
        if ((`${msg.content}\n${BDpref}${nick}${BDpref}${money}${BDpref}${status}${BDpref}${car}${BDpref}${user}${BDpref}${steamID}`).length < 2000){ //если сообщение меньше лимита, то редактируем его и допооняем БД
            let nnMsg = msg.content.split('\n').slice(1);
            let edMsg = nnMsg.push(`${BDpref}${nick}${BDpref}${money}${BDpref}${status}${BDpref}${car}${BDpref}${user}${BDpref}${steamID}`)

            msg.edit(`> **БАЗА ДАННЫХ ПОЛЬЗОВАТЕЛЕЙ ${fMsg[1]}**`+edMsg.join('\n'));

            /* msg.edit(`> **БАЗА ДАННЫХ ПОЛЬЗОВАТЕЛЕЙ ${fMsg[1]}**` + `\n${nnMsg.slice(1)}`) //изменяем название нового БД, добавляя цифру
            await msg.edit(msg.content + `\n${BDpref}${nick}${BDpref}${money}${BDpref}${status}${BDpref}${car}${BDpref}${user}${BDpref}${steamID}`) //редактируем сообщение, добавляя еще одного пользователя */
            return;
        }else if ((`${msg.content}\n${BDpref}${nick}${BDpref}${money}${BDpref}${status}${BDpref}${car}${BDpref}${user}${BDpref}${steamID}`).length >= 2000){ //если сообщение привышает лимит
            channel.send(`> **БАЗА ДАННЫХ ПОЛЬЗОВАТЕЛЕЙ ${fMsg[1]}**`).then(msg => { //пишем новое сообщение
                oMsg.edit(oMsg.content + `\n${BDpref}${msg.id}${BDpref}${nMsg.length}`) //записываем в доп.БД id и номер нового БД.
            });
        };
    }catch{
        return null;
    };
};

function sendLog(message,cat,act,status,add){
    let img = `https://i.imgur.com/cjSSwtu.png`;
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
                value: `${add}\n[<#${message.channel.id}>]`
            }],
            
            timestamp: new Date()
            }
        });
        return;
    }else{
        return;
    }
};

function comand(message,countS){

    if (countS == undefined) countS = 0;
    let msg = message.content;
    if(msg.slice(0,1) != prefix) return false;
    
    let com = msg.split(" ", 1).join('').slice(prefix.length);
    let arg = msg.slice(com.length+prefix.length+1);
    let sarg = arg.split(" ");
    let carg = sarg.slice(countS).join(' ');

    var comand = {
        com: com,
        arg: arg,
        sarg: sarg,
        carg: carg
    };

    return comand;
};

client.on('messageDelete', (message) => {
    sendLog(message,'Общее',`Сообщение удалено`,'Успешно',`Содержимое сообщения: ${message.content}`)
});

client.on('message', message => {
    let mb = message.author.bot;

    sendLog(message,`Общее`,`Отправил сообщение.`,`Успешно`,`${message.content}`);

    if (comand(message).com == 'осмотреться' && mb == false){
        message.delete();
        let homestreet = Config.street.find(st => st.name.toLowerCase() == message.channel.parent.name.toLowerCase());

        if(message.channel.name == "улица"){
            let objects = [];

            for (let pobj of homestreet.objects) if (pobj.addCondition == '') objects.push(pobj.name);

            if (homestreet != null && objects.join(', ') != ''){
                message.author.send(`Соседние улицы с ${homestreet.name}: ${homestreet.radius.join(', ')}.\nБлижайшие объекты: ${objects.join(', ')}.`);
                sendLog(message,`Общее`,`Осмотрелся на улице.`,`Успешно`,`Вывод: Соседние улицы с ${homestreet.name}: ${homestreet.radius.join(', ')}.\nБлижайшие объекты: ${objects.join(', ')}.`);
            }else{
                message.author.send(`Соседние улицы с ${homestreet.name}: ${homestreet.radius.join(', ')}.\nБлижайшие объекты отсутствуют.`);
                sendLog(message,`Общее`,`Осмотрелся на улице.`,`Успешно`,`Вывод: Соседние улицы с ${homestreet.name}: ${homestreet.radius.join(', ')}.\nБлижайшие объекты отсутствуют.`);
            };
        }else if(homestreet.objects.filter(ob => ob.addCondition.toLowerCase() == message.channel.name.toLowerCase()) != null){
            let objects = [];

            for (let pobj of homestreet.objects) if (pobj.addCondition.toLowerCase() == message.channel.name.toLowerCase()) objects.push(pobj.name);

            if (homestreet != null && objects.join(', ') != ''){
                message.author.send(`Ближайшие помещения: ${objects.join(', ')}.`);
                sendLog(message,`Общее`,`Осмотрелся в объекте.`,`Успешно`,`Вывод: Ближайшие помещения: ${objects.join(', ')}.`);
            }else{
                message.author.send(`Ближайшие помещения отсутствуют.`);
                sendLog(message,`Общее`,`Осмотрелся в объекте.`,`Успешно`,`Вывод: Ближайшие помещения отсутствуют.`);
            };
        }else{
            message.author.send(`Вызов команды \`осмотреться\` должны выполнятся на улицах или внутри помещений.`);
            sendLog(message,`Общее`,`Попытался осмотреться.`,`Ошибка`,`Вызов команды \`осмотреться\` должны выполнятся на улицах или внутри помещений.`);
        };
    };

    if (comand(message).com == 'идти' && mb == false){
        message.delete();
        let homestreet = Config.street.find(st => st.name == message.channel.parent.name);

        if (comand(message).sarg[0] == 'на' && message.channel.name == 'улица'){
            let walkway = homestreet.radius.find(st => st.toLowerCase() == comand(message).arg);

            if (walkway != null && message.channel.parent.permissionOverwrites.get(message.author.id) != null){
                let cat = client.channels.cache.find(cat => cat.name == walkway);
                if (cat.type == 'category'){
                    client.channels.cache.find(cat => cat.name == walkway).updateOverwrite(message.author, { VIEW_CHANNEL: true });
                    message.channel.parent.permissionOverwrites.get(message.author.id).delete();
                    sendLog(message,`Общее`,`Пошел.`,`Успешно`,`Перешел с ${homestreet.name} на ${walkway}.`);
                };
            }else if (walkway == null && Config.street.find(st => st.name.toLowerCase() == comand(message).arg) != null){
                message.author.send(`${comand(message).arg} не является соседней улицей с ${homestreet.name}.`);
                sendLog(message,`Общее`,`Попытался пойти.`,`Ошибка`,`Вывод: ${comand(message).arg} не является соседней улицей с ${homestreet.name}.`);
            }else{
                message.author.send(`Вероятнее всего улицы ${comand(message).arg} нет, либо вы ввели ее неправильно.`);
                sendLog(message,`Общее`,`Попытался пойти.`,`Ошибка`,`Вывод: Вероятнее всего улицы ${comand(message).arg} нет, либо вы ввели ее неправильно.`);
            };
        }else if (comand(message).sarg[0] == 'в'){
            let walkway = homestreet.objects.find(st => st.name.toLowerCase() == comand(message).arg);
        }else{
            message.author.send(`Вызов команды \`идти\` должны выполнятся с дополнительными аргументами: на - для перехода на улицу или в - для перехода в помещение/объект.`);
            sendLog(message,`Общее`,`Попытался пойти.`,`Ошибка`,`Вывод: Вызов команды \`идти\` должны выполнятся с дополнительными аргументами: на - для перехода на улицу или в - для перехода в помещение/объект.`);
        }
    };

    if(comand(message).com == `send` && message.author.id == `621917381681479693`){	
        if(mb) return;	
        message.delete();	
        message.channel.send(`${comand(message).arg}`);	
    };

    if(comand(message).com == `clear` && mb == false && message.guild.member(message.author).roles.cache.get(`822493460493500436`) != null){
        let arg = parseInt(comand(message).sarg[0]);
        
        if (arg > 0 && arg < 100){
            message.channel.bulkDelete(arg+1, true);
            sendLog(message,`Админ`,`Удалил сообщения.`,`Успешно`,`Удалено ${arg} сообщений.`);
        }else if (arg >= 100){
            sendLog(message,`Админ`,`Попытался удалить сообщения.`,`Ошибка`,`Попытка удалить более 100 сообщений.`);
        }else{
            sendLog(message,`Админ`,`Попытался удалить сообщения.`,`Ошибка`,`Неверный аргумент.`);
        };
    };
    
    if(comand(message).com == `edit` && message.author.id == `621917381681479693`){
        message.channel.guild.channels.cache.find(id => id == `${comand(message).sarg[0]}`).messages.fetch(`${comand(message).sarg[1]}`)
        .then(msg =>{

            if(!msg.author.bot) return;
            msg.edit(comand(message,2).carg);
        
        })
        .catch(console.error);
    };

    if(comand(message).com == `sbd` && guild.member(message.author).roles.cache.get(`822493460493500436`) != null){
        SetStats(`${message.author.username}`,`${Math.random()}`,`В розыске`,`Отсутствует`,`<@${message.author.id}>`,`${Math.random()}`);
    }; 

});

client.login(process.env.BOT_TOKEN);

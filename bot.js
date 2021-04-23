const Discord = require('discord.js');
const Config = require('./config');
const client = new Discord.Client();
const prefix = '!';
const BDpref = '^';
const urlSteam = `https://steamcommunity.com/`;

var guild;
const BDchnl = `833225101218152459`;
const dopBDmsg = `833260237481705502`;

const SteamAPI = require('steamapi');
const steam = new SteamAPI('52E6781CF3B4EB4234DC424555A7AD9C');

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
        guild.channels.cache.get(Config.BLChannelsID.logsId).send({embed: {
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

    var comand = {
        com: '0',
        arg: '0',
        sarg: '0',
        carg: '0'
    };

    if(msg.slice(0,1) != prefix) return comand;
    
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

    /* if (comand.com == 'cm'){
        console.log(`com: ${com}`);
        console.log(`arg: ${arg}`);
        console.log(`sarg: ${sarg}`);
        console.log(`carg: ${carg}`);
    } */

    return comand;
};

function haveRole(message, roleid){
    let haveorno = false;
    if (guild.member(message.author).roles.cache.get(roleid) != null) haveorno = true;
    return haveorno;
};

function member(id, user, money, status, car, steamID) {
    this.id = id;
    this.user = user;
    this.money = money;
    this.status = status;
    this.car = car;
    this.steamID = steamID;
};

async function GetStats() {
    let channel = guild.channels.cache.get(BDchnl); //получаем канал в котором находится наша БД
    let oMsg = await channel.messages.fetch(dopBDmsg); //получаем сообщение доп бд
    let nMsg = oMsg.content.split('\n'); //разделяем доп бд на строки
    let fMsg = nMsg[nMsg.length-1].split(BDpref); //получаем последние данные в доп бд
    if (fMsg[0] == ''){
        fMsg.splice(0,1);
    };
    let msg = await channel.messages.fetch(fMsg[0]); //подключаемся к сообщению, получая о нем все данные.
    try{
        mainArray = []; //задаем новый массив X
        let messageNormal = msg.content.split('\n'); //массив, который разбивает сообщение на строки (\n)
        messageNormal.splice(0,1); //удаляем первый элемент всех строк, так как это название БД.
        for(let msg of messageNormal){ //перебераем строки сообщения и задаем каждой строке переменную msg
            let split = msg.split(BDpref); //разделяем каждое сообщение по префиксу, задавая переменную split
            if (split[0] != ''){ //проверка на пустоту элементов. Если не пустой, то запускаем разделеное сообщение в массив X
                mainArray.push(split);
            }else{
                split.splice(0,1); //Если пустой, то удаляем пустой элемент и делаем ту-же операцию.
                mainArray.push(split);
            }
        };
        membersArray = []; //задаем массив участников
        for(let i of mainArray){ //перебераем массив X со всеми данными и сортируем их в объект member, который отправляем в массив участников
            var newMember = new member(i[0], i[1], i[2], i[3], i[4], i[5]);
            membersArray.push(newMember);
        };
        return membersArray; //возвращаем массив участников
    }catch{
        return null;
    };
};

async function AddStats(user, money, status, car, steamID) {
    let channel = guild.channels.cache.get(BDchnl); //получаем канал в котором находится наша БД
    let oMsg = await channel.messages.fetch(dopBDmsg); //получаем сообщение доп бд
    let nMsg = oMsg.content.split('\n'); //разделяем доп бд на строки
    let fMsg = nMsg[nMsg.length-1].split(BDpref); //получаем последние данные в доп бд
    if (fMsg[0] == ''){
        fMsg.splice(0,1);
    };
    let msg = await channel.messages.fetch(fMsg[0]); //подключаемся к сообщению, получая о нем все данные.
    try{
        let id = `${fMsg[1]}-${msg.content.split('\n').length}`;
        let bdInfo = `${BDpref}${id}${BDpref}${user}${BDpref}${money}${BDpref}${status}${BDpref}${car}${BDpref}${steamID}`;
        if ((`${msg.content}\n${bdInfo}`).length < 2000){ //если сообщение меньше лимита, то редактируем его и допооняем БД
            let nnMsg = msg.content.split('\n').slice(1);
            nnMsg.push(`${bdInfo}`);
            msg.edit(`> **БАЗА ДАННЫХ ПОЛЬЗОВАТЕЛЕЙ ${fMsg[1]}**\n`+nnMsg.join('\n'));
            return;
        }else if ((`${msg.content}\n${bdInfo}`).length >= 2000){ //если сообщение привышает лимит
            channel.send(`> **БАЗА ДАННЫХ ПОЛЬЗОВАТЕЛЕЙ ${fMsg[1]}**`).then(msg => { //пишем новое сообщение
                oMsg.edit(oMsg.content + `\n${BDpref}${msg.id}${BDpref}${nMsg.length}`) //записываем в доп.БД id и номер нового БД.
            });
            AddStats(user, money, status, car, steamID);
        };
    }catch{
        return null;
    };
};

async function EditStats(id, stat, dat){
    var bdnum = id.split('-')[0];
    var idnum = id.split('-')[1];
    var AllStats = await GetStats();
    var person = AllStats.find(pers => pers.id == id);

    if(stat == 'user') stat = 1;
    if(stat == 'money') stat = 2;
    if(stat == 'status') stat = 3;
    if(stat == 'car') stat = 4;
    if(stat == 'steamID') stat = 5;

    var channel = guild.channels.cache.get(BDchnl); //получаем канал в котором находится наша БД
    var oMsg = await channel.messages.fetch(dopBDmsg);

    let nMsg = oMsg.content.split('\n'); //разделяем доп бд на строки
    nMsg.splice(0,1);
    let fMsg = nMsg[parseInt(bdnum)-1].split(BDpref); //получаем последние данные в доп бд
    if (fMsg[0] == ''){
        fMsg.splice(0,1);
    };

    var msg = await channel.messages.fetch(fMsg[0]);
    var nnMsg = msg.content.split('\n');

    var eStat = [];
    for(let s in person) eStat.push(person[s]);
    eStat.splice(stat,1,dat);
    nnMsg.splice(parseInt(idnum),1,`^${eStat.join(BDpref)}`);
    console.log(eStat);
    console.log(nnMsg.join('\n').length)

    if (nnMsg.join('\n').length > 2000){
        console.log('больше');
        nnMsg.splice(parseInt(idnum),1);
        AddStats(eStat[0],eStat[1],eStat[2],eStat[3],eStat[4],eStat[5]);
    }
        
    msg.edit(nnMsg.join('\n'));
    
};

async function Stats(message){
    var AllStats = await GetStats();
    var person = AllStats.find(pers => pers.user == `<@${message.author.id}>`);
    var steamProfile;
    var steamNick = `[PP] ${message.author.username}`.slice(0,32);
    if (comand(message).sarg[0].slice(0,urlSteam.length) == urlSteam) var steamProfile = await steam.resolve(comand(message).sarg[0]);

    if (comand(message).com != `подтвердить`){
        message.author.send(`
> **Это к чему?** 🤖
Извини, я робот и не понимаю к чему это сообщение. Если это шутка, то она очень смешная!
        `)
    }; //рандомное сообщение

    if (person != undefined && comand(message).com == `подтвердить`){ //пользователь зарегистрирован
        message.author.send(`
> **Вы уже зарегистрированы** 📟
Вы уже зарегистрированы в базе данных пользователей. Если вы желаете обнулить свой аккаунт, обратитесь к администрации проекта.
        `)
    }else if (person == undefined && comand(message).com == `подтвердить` && steamProfile == null){ //пользователь не зарегистрирован
        message.author.send(`
> **Процесс регистрации** 📚
Привет! Я PushPin бот, а вы пользователь, желающий пройти верификацию. Всё верно? Если так, то давайте начнём.

> **Для начала повторите команду, дополнив её ссылкой на свой стим-профиль** 📬
Ссылка на стим-профиль получается очень просто. Вам достаточно повторять действия, отмеченные на этой справке.
        `,{
            files: [{
                attachment: 'https://i.imgur.com/vVTXtbD.png',
                name: 'howToGetSteamProfileLink.png'
            }]
        });
    }else if (comand(message).com == `подтвердить` && steamProfile == null){ //ошибка
        message.author.send(`
> **Возникла ошибка** 🔏
Возникла непредвиденная ошибка. Обратитесь к администрации проекта.
        `);
        sendLog(message,'Глобальное','Попытался(-ась) подтвердить свой аккаунт.', 'Ошибка', `SteamID: ${steamProfile}`)
    }; //информационная справка при отправке команды "подтвердить"

    if (person == undefined && comand(message).com == `подтвердить` && steamProfile != null && AllStats.find(pers => pers.steamID == steamProfile) == null){
        var steamProfileInfo = await steam.getUserSummary(steamProfile);
        if (steamProfileInfo.nickname == steamNick){
            message.author.send(`
> **Успешно! Ваш аккаунт зарегистрирован** 🎉
Все прошло успешно! Теперь вы свободно можете играть на проекте PushPin!
            `)
            AddStats(`<@${message.author.id}>`,250,'Нет','Нет',steamProfile)
            sendLog(message,'Глобальное','Подтвердил(а) свой аккаунт.', 'Успешно', `SteamID: ${steamProfile}`)
        }else if (steamProfileInfo.nickname != steamNick){
            message.author.send(`
> **Измените имя** 📝
Чтобы успешно завершить аутентификацию временно измените имя своего профиля на \`${steamNick}\` и повторите попытку, дополнив команду ссылкой на свой стим-профиль. 
            `)
        }else{
            message.author.send(`
> **Возникла ошибка** 🔏
Возникла непредвиденная ошибка. Обратитесь к администрации проекта.
            `);
            sendLog(message,'Глобальное','Попытался(-ась) подтвердить свой аккаунт.', 'Ошибка', `SteamID: ${steamProfile}`)
        }
    }else if(person == undefined && comand(message).com == `подтвердить` && steamProfile != null && AllStats.find(pers => pers.steamID == steamProfile) != null){
        message.author.send(`
> **Я был о вас лучшего мнения** 😢
Не пытайтесь меня обмануть. Ваш стим-аккаунт уже привязан к одному из участников.
            `)
    }
    
};

client.on('messageDelete', (message) => {
    sendLog(message,'Общее',`Сообщение удалено`,'Успешно',`Содержимое сообщения: ${message.content}`)
});

client.on('message', message => {
    let mb = message.author.bot;

    if (mb == false) sendLog(message,`Общее`,`Отправил сообщение.`,`Успешно`,`${message.content}`);

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

    if(comand(message).com == `clear` && mb == false && haveRole(message, `822493460493500436`) == true){
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
    
    if(comand(message).com == `edit` && haveRole(message, `833778527609552918`) == true){
        message.delete();
        message.channel.guild.channels.cache.find(id => id == `${comand(message).sarg[0]}`).messages.fetch(`${comand(message).sarg[1]}`)
        .then(msg =>{

            if(!msg.author.bot) return;
            msg.edit(comand(message,2).carg);
        
        })
        .catch(console.error);
    };

    if(comand(message).com == 'cbd' && message.author.id == `621917381681479693`){
        message.delete()
        let channel = guild.channels.cache.get(BDchnl); //получаем канал в котором находится наша БД
        channel.messages.fetch(dopBDmsg).then(oMsg => { //получаем сообщение доп бд
            let nMsg = oMsg.content.split('\n'); //разделяем доп бд на строки
            try{
                nMsg.splice(0,1);
                let fMsg = nMsg[parseInt(comand(message).sarg[0])-1].split(BDpref); //получаем последние данные в доп бд
                if (fMsg[0] == ''){
                    fMsg.splice(0,1);
                };
                message.channel.send(`!edit 833225101218152459 ${fMsg[0]} > **БАЗА ДАННЫХ ПОЛЬЗОВАТЕЛЕЙ 1**`);
            }catch{
                console.log(`Недостача аргументов`);
            }
        });
    };

    if(comand(message).com == 'cdbd' && message.author.id == `621917381681479693`){
        message.delete()
        message.channel.send(`!edit 833225101218152459 833260237481705502 > **ДОПОЛНИТЕЛЬНАЯ БАЗА ДАННЫХ ЗНАЧЕНИЙ**\n^833260177443651604^1`);
    };

    if(comand(message).com == `tbd` && message.author.id == `621917381681479693`){
        message.delete();
        setTimeout(() => AddStats(`<@${message.author.id}>`,25,'В розыске','Отсутствует',101), 1000);
    };

    if(comand(message).com == `ebd` && message.author.id == `621917381681479693`){
        message.delete();
        EditStats(comand(message).sarg[0],comand(message).sarg[1], comand(message).sarg[2])
    };

    if(message.guild == undefined && mb == false){
        Stats(message);
    };

});

client.login(process.env.BOT_TOKEN);

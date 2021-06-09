const Discord = require('discord.js');
const Config = require('./config');
const client = new Discord.Client();
const prefix = '!';
const BDpref = '^';
const urlSteam = `https://steamcommunity.com/`;

var guild;
const BDchnl = Config.channelsID.bd;
const dopBDmsg = `838003963412480070`;
const policeBDmsg = `851070854259277855`;

const SteamAPI = require('steamapi');
var GitHub = require('github-api');
const steam = new SteamAPI('52E6781CF3B4EB4234DC424555A7AD9C');
var gitA = new GitHub({
    token: process.env.git
});
var fork = gitA.getRepo('SHUSTRIK-Milan','PushpinBot');

client.on('ready', () => {
    console.log(`${client.user.tag} ready!`);
    guild = client.guilds.cache.get('814795850885627964');

    let offlinemember = guild.members.cache.filter(m => m.presence.status === 'offline').size;
    let member = guild.memberCount;
    let onlinemember = member - offlinemember - 2;

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
    let onlinemember = member - offlinemember - 2;

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

client.on('guildMemberAdd', (member) => {
    const role = "829423238169755658";
    member.roles.add(role).catch(console.error);
});

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
    
    let com = msg.split(" ", 1).join('').slice(prefix.length); // команда, первый слитнонаписанный текст
    let arg = msg.slice(com.length+prefix.length+1); // все, что идет после команды
    let sarg = arg.split(" "); // разбитый аргумент на пробелы
    let carg = sarg.slice(countS).join(' '); // отрезанние от разбитого аргумента первых аргументов
    var comand = {
        com: com,
        arg: arg,
        sarg: sarg,
        carg: carg
    };

    return comand;
};

function haveRole(member, roleid){
    let have = false;
    if(member == null) console.log(member);
    if (member.roles.cache.get(roleid) != null) have = true;
    return have;
};

function giveRole(member, roleId){
    member.roles.add(roleId, `Добавил роль под ID: ${roleId}.`).catch(console.error);
};

function removeRole(member, roleId){
    member.roles.remove(roleId, `Удалил роль под ID: ${roleId}.`).catch(console.error);
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

    if (Object.values(Config.BLChannelsID).find(chl => chl == message.channel.id) == null){
        guild.channels.cache.get(Config.channelsID.logs).send({embed: {
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

function createEx(rule,status,num,add,message){
    let img = `https://i.imgur.com/cjSSwtu.png`;
    if (status == 'Правильно') img = `https://i.imgur.com/cjSSwtu.png`;
    if (status == 'Неправильно') img = `https://i.imgur.com/utuBexR.png`;

    let color = 11645371; 
    if (status == 'Правильно') color = 9819812;
    if (status == 'Неправильно') color = 14508910;

    message.channel.send({embed: {
            color: color,
            thumbnail: {
                url: img
            },
            fields: [{
                name: `[${rule}] Пример #${num}`,
                value: `${add}`
            }]
        }
    });
    return;
};

function createLore(title,img,desc,message){
    message.channel.send({embed: {
            color: 15521158,
            fields: [{
                name: `${title}`,
                value: `${desc}`
            }],
            image:{url:img}
        }
    });
    return;
};

async function createCom(embd, message){
    let act = null;
    for(let a of embd.title.split(':')){
        if(a.slice(-6) == 'closed') act = 'merge';
        if(a.slice(-7) == 'commits' || a.slice(-6) == 'commit') act = 'commit';
    };
    if(act == 'commit'){
        let nTitle = embd.title.split(' ')[0].split(':')[1].slice();
        let branch = nTitle.slice(0,nTitle.length-1);
        let commits = await fork.listCommits({sha:branch});
        message.delete()
        let countC = parseInt(embd.title.split(' ')[1]);
        let lastcom = await commits.data[countC-1];

        let nCommits = [];
        for (let i = countC-1; i > -1; i--) {
            lastcom = await commits.data[i];
            nCommits.push(`[\`${lastcom.html_url.slice(52).slice(0,7)}\`](${lastcom.html_url}) — ${lastcom.commit.message}`);
        }

        let color = 11645371;
        if(countC>0) color = 8506509;
        guild.channels.cache.get(Config.channelsID.commits).send({embed: {
            title: `[PushpinBot:${branch}] ${countC} коммит(ов).`,
            description: nCommits.join('\n'),
            url: lastcom.html_url,
            color: color,
            author: {
                name: lastcom.author.login,
                icon_url: lastcom.author.avatar_url
            },
            fields: [],
            timestamp: new Date()
        }});
    }else if(act == 'merge'){
        let req = await fork.listPullRequests({state:'close'});
        let lastReq = await req.data[0];
        message.delete();
        guild.channels.cache.get(Config.channelsID.commits).send({embed: {
            title: `[PushpinBot:${lastReq.head.ref}] Новое слияние веток.`,
            description: `\`(${lastReq.head.ref} → ${lastReq.base.ref})\` ${lastReq.title}`,
            url: lastReq.url,
            color: 13158471,
            author: {
                name: lastReq.user.login,
                icon_url: lastReq.user.avatar_url
            },
            fields: [],
            timestamp: new Date()
        }});
    }else{
        message.delete()
    }
    return;
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
    nMsg.splice(0,1); //удаляем заголовок

    let idmsgs = [];
    let fmsgt = []
    for(n of nMsg){
        let nidmsg = n.split('\n');
        for(nm of nidmsg) idmsgs.push(nm.split('^')[1]);
    };
    for(m of idmsgs){
        let msg = await channel.messages.fetch(m);
        let nmsg = msg.content.split('\n');
        for(m of nmsg) if(m.slice(0,8) != '> **БАЗА')fmsgt.push(m);
    }

    mainArray = []; //задаем новый массив X
    for(let msg of fmsgt){ //перебераем строки сообщения и задаем каждой строке переменную msg
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
};

async function AddStats(user, money, status, car, steamID) {
    async function refDI(){
        var channel = guild.channels.cache.get(BDchnl); //получаем канал в котором находится наша БД
        var oMsg = await channel.messages.fetch(dopBDmsg); //получаем сообщение доп бд
        var nMsg = oMsg.content.split('\n'); //разделяем доп бд на строки
        var fMsg = nMsg[nMsg.length-1].split(BDpref); //получаем последние данные в доп бд
        if (fMsg[0] == ''){
            fMsg.splice(0,1);
        }; //удаляем пустые строки
        var msg = await channel.messages.fetch(fMsg[0]); //подключаемся к сообщению, получая о нем все данные.
        return{channel:channel,oMsg:oMsg,nMsg:nMsg,fMsg:fMsg,msg:msg}; //возвращаю все переменные
    };
    try{
        let dbd = await refDI(); //получая данные с доп бд
        let id = `${dbd.fMsg[1]}-${dbd.msg.content.split('\n').length}`; //создаю ID
        let bdInfo = `${BDpref}${id}${BDpref}${user}${BDpref}${money}${BDpref}${status}${BDpref}${car}${BDpref}${steamID}`; //создаю переменную всех данных
        if ((`${dbd.msg.content}\n${bdInfo}`).length < 2000){ //если сообщение меньше лимита, то редактируем его и допооняем БД
            let nnMsg = dbd.msg.content.split('\n').slice(1); //разделяю сообщение на строки, удаляя название
            nnMsg.push(`${bdInfo}`); //добавляю к разделеному сообщению данные
            dbd.msg.edit(`> **БАЗА ДАННЫХ ПОЛЬЗОВАТЕЛЕЙ ${dbd.fMsg[1]}**\n`+nnMsg.join('\n')); //редактирую сообщение со всеми данными
            return;
        }else if ((`${dbd.msg.content}\n${bdInfo}`).length >= 2000){ //если сообщение привышает лимит
            let dbd = await refDI(); //получаю данные
            let smsg = await dbd.channel.send(`> **БАЗА ДАННЫХ ПОЛЬЗОВАТЕЛЕЙ**`); //пишем новое сообщение
            await dbd.oMsg.edit(dbd.oMsg.content + `\n${BDpref}${smsg.id}${BDpref}${dbd.nMsg.length}`); //записываем в доп.БД id и номер нового БД

            dbd = await refDI(); //получаю данные
            let id = `${dbd.fMsg[1]}-${smsg.content.split('\n').length}`; //создаю ID
            let bdInfo = `${BDpref}${id}${BDpref}${user}${BDpref}${money}${BDpref}${status}${BDpref}${car}${BDpref}${steamID}`; //создаю переменную всех данных

            let nnMsg = smsg.content.split('\n').slice(1); //разделяю сообщение на строки, удаляя название
            nnMsg.push(`${bdInfo}`); //добавляю к разделеному сообщению данные
            smsg.edit(`> **БАЗА ДАННЫХ ПОЛЬЗОВАТЕЛЕЙ ${dbd.fMsg[1]}**\n`+nnMsg.join('\n')); //редактирую сообщение со всеми данными
        };
    }catch{
        return null;
    };
};

async function EditStats(id, stat, dat){
    if (id == null){return}; 
    var bdnum = id.split('-')[0];
    var idnum = id.split('-')[1];
    var AllStats = await GetStats();
    var person = AllStats.find(pers => pers.id == id);

    if(stat == 'user') stat = 0;
    if(stat == 'money') stat = 1;
    if(stat == 'status') stat = 2;
    if(stat == 'car') stat = 3;
    if(stat == 'steamID') stat = 4;

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
    eStat.splice(0,1);
    eStat.splice(stat,1,dat);

    nnMsg.splice(parseInt(idnum),1,`^${id}^${eStat.join(BDpref)}`);

    if (nnMsg.join('\n').length > 2000){
        nnMsg.splice(parseInt(idnum),1);
        AddStats(eStat[0],eStat[1],eStat[2],eStat[3],eStat[4]);
    }
        
    msg.edit(nnMsg.join('\n'));
    return;
};

async function delStats(id){
    if (id == ''){return}; 
    var bdnum = id.split('-')[0];
    
    var channel = guild.channels.cache.get(BDchnl); //получаем канал в котором находится наша БД
    var oMsg = await channel.messages.fetch(dopBDmsg);

    let nMsg = oMsg.content.split('\n'); //разделяем доп бд на строки
    nMsg.splice(0,1);
    if(nMsg[parseInt(bdnum)-1] == undefined){return};
    let fMsg = nMsg[parseInt(bdnum)-1].split(BDpref); //получаем последние данные в доп бд
    if (fMsg[0] == ''){
        fMsg.splice(0,1);
    };

    var msg = await channel.messages.fetch(fMsg[0]);
    var nnMsg = msg.content.split('\n');
    var stat = nnMsg.find(n => n.split(BDpref)[1] == id);
    if (stat == undefined){return};

    nnMsg.splice(nnMsg.indexOf(stat),1);
    msg.edit(nnMsg.join('\n'));
};

async function Stats(message){
    var AllStats = await GetStats();
    var person = AllStats.find(pers => pers.user == `<@!${message.author.id}>`);
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
            AddStats(`<@!${message.author.id}>`,250,'Нет','Нет',steamProfile)
            guild.members.fetch(message.author.id).then(member => {removeRole(member,`829423238169755658`),giveRole(member,`836269090996879387`)});
            sendLog(message,'Глобальное','Подтвердил(а) свой аккаунт.', 'Успешно', `SteamID: ${steamProfile}`)
            guild.channels.cache.get(`837644857098108948`).updateOverwrite(guild.members.cache.get(message.author.id),{'VIEW_CHANNEL': true});
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
    let mg = message.guild == undefined;
    let head = haveRole(message.member, '822493460493500436')

    if (!mb && !mg) sendLog(message,`Общее`,`Отправил сообщение.`,`Успешно`,`${message.content}`);

    if (message.channel.id == Config.channelsID.offers && !mb){
        message.react("👍");
        message.react("👎");
        console.log('Новое сообщение в offers')
    };

    if (comand(message).com == 'осмотреться' && !mb && !mg){
        message.delete();
        let homestreet = Config.streets.find(st => `«${st.name.toLowerCase()}»` == message.channel.parent.name.toLowerCase());

        if(message.channel.name == "улица"){   
            let objects = [];

            for (let pobj of homestreet.objects) if (pobj.addCondition == '') objects.push(pobj.name);

            if (homestreet != null && objects.join(', ') != ''){
                message.author.send(`Соседние улицы с ${homestreet.name}:\n> ${homestreet.radius.join(';\n> ')}.\nБлижайшие объекты:\n> ${objects.join(';\n> ')}.`);
                sendLog(message,`Общее`,`Осмотрелся на улице.`,`Успешно`,`Вывод: Соседние улицы с ${homestreet.name}: ${homestreet.radius.join(', ')}.\nБлижайшие объекты: ${objects.join(', ')}.`);
            }else{
                message.author.send(`Соседние улицы с ${homestreet.name}:\n> ${homestreet.radius.join(';\n> ')}.\nБлижайшие объекты отсутствуют.`);
                sendLog(message,`Общее`,`Осмотрелся на улице.`,`Успешно`,`Вывод: Соседние улицы с ${homestreet.name}: ${homestreet.radius.join(', ')}.\nБлижайшие объекты отсутствуют.`);
            };
        }else if(homestreet.objects.filter(ob => ob.addCondition.toLowerCase() == message.channel.name.toLowerCase()) != null){
            let objects = [];
            for (let pobj of homestreet.objects) if (pobj.addCondition.toLowerCase() == message.channel.name.toLowerCase()) objects.push(pobj.name);

            if (homestreet != null && objects.join(', ') != ''){
                message.author.send(`Ближайшие помещения:\n> ${objects.join(';\n> ')}.\nПуть для выхода: Улица.`);
                sendLog(message,`Общее`,`Осмотрелся в объекте.`,`Успешно`,`Вывод: Ближайшие помещения: ${objects.join(', ')}.`);
            }else{
                message.author.send(`Ближайшие помещения отсутствуют.\nПуть для выхода: Улица.`);
                sendLog(message,`Общее`,`Осмотрелся в объекте.`,`Успешно`,`Вывод: Ближайшие помещения отсутствуют.`);
            };
        }else{
            message.author.send(`Вызов команды \`осмотреться\` должны выполнятся на улицах или внутри помещений.`);
            sendLog(message,`Общее`,`Попытался осмотреться.`,`Ошибка`,`Вызов команды \`осмотреться\` должны выполнятся на улицах или внутри помещений.`);
        };
    };

    if (comand(message).com == 'идти' && !mb && !mg){
        message.delete();
        let homestreet = Config.streets.find(st => `«${st.name.toLowerCase()}»` == message.channel.parent.name.toLowerCase());
        let argsStreet = guild.channels.cache.get(comand(message,1).carg.slice(2).slice(0,-1));
        if(argsStreet != undefined) argsStreet = argsStreet.name.slice(1).slice(0,-1).toLowerCase();
        if(argsStreet == undefined) argsStreet = comand(message,1).carg;

        if (comand(message).sarg[0] == 'на' && message.channel.name == 'улица'){
            let walkway = homestreet.radius.find(st => st.toLowerCase() == argsStreet);
            if(walkway == undefined) walkway = homestreet.radius.find(st => st.toLowerCase() == argsStreet.toLowerCase());
            console.log(argsStreet);
            console.log(walkway)

            if (walkway != null && message.channel.parent.permissionOverwrites.get(message.author.id) != null){
                let cat = guild.channels.cache.find(cat => cat.name.toLowerCase() == `«${walkway}»`.toLowerCase());
                if (cat.type == 'category'){
                    guild.channels.cache.find(cat => cat.name.toLowerCase() == `«${walkway}»`.toLowerCase()).updateOverwrite(message.author, { 'VIEW_CHANNEL': true });
                    message.channel.parent.permissionOverwrites.get(message.author.id).delete();
                    sendLog(message,`Общее`,`Пошел.`,`Успешно`,`Перешел с ${homestreet.name} на ${walkway}.`);
                };
            }else if (walkway == null && Config.streets.find(st => st.name.toLowerCase() == argsStreet.toLowerCase()) != null){
                message.author.send(`${argsStreet} не является соседней улицей с ${homestreet.name}.`);
                sendLog(message,`Общее`,`Попытался пойти.`,`Ошибка`,`Вывод: ${argsStreet} не является соседней улицей с ${homestreet.name}.`);
            }else{
                message.author.send(`Вероятнее всего улицы ${argsStreet} нет, либо вы ввели ее неправильно.`);
                sendLog(message,`Общее`,`Попытался пойти.`,`Ошибка`,`Вывод: Вероятнее всего улицы ${argsStreet} нет, либо вы ввели ее неправильно.`);
            };
        }else if (comand(message).sarg[0] == 'в'){
            /* let walkway = homestreet.objects.find(obj => obj.name.toLowerCase() == argsStreet.toLowerCase());
            console.log(walkway);
            if (walkway != null && walkway.addCondition == ''){
                let cat = guild.channels.cache.find(cat => cat.type == 'category' && cat.name.toLowerCase() == `«${homestreet.name.toLowerCase()}»` && cat.children.find(channel => channel.name == walkway.name.toLowerCase()) != undefined);
                cat.children.find(channel => channel.name == walkway.name.toLowerCase()).updateOverwrite(message.author, { 'VIEW_CHANNEL': true });
                message.channel.permissionOverwrites.get(message.author.id).delete();
            }else if(walkway != null && walkway.addCondition != ''){
                let cat = guild.channels.cache.find(cat => cat.type == 'category' && cat.name.toLowerCase() == `«${homestreet.name.toLowerCase()}»` && cat.children.find(channel => channel.name == walkway.name.toLowerCase()) != undefined);
                cat.children.find(channel => channel.name == walkway.name.toLowerCase() && message.channel.name == walkway.addCondition.toLowerCase()).updateOverwrite(message.author, { 'VIEW_CHANNEL': true });
                try{
                    message.channel.permissionOverwrites.get(message.author.id).delete();
                }catch{console.log('Не выполнилы условия')}
            }else if(walkway == null && Config.streets.find(st => st.objects.find(obj => obj.name.toLowerCase() == argsStreet.toLowerCase() != null))){
                message.author.send(`${argsStreet} не является объектом улицы ${homestreet.name}.`);
                sendLog(message,`Общее`,`Попытался пойти.`,`Ошибка`,`Вывод: ${argsStreet} не является объектом улицы ${homestreet.name}.`);
            } */
        }else{
            message.author.send(`Вызов команды \`идти\` должны выполнятся с дополнительными аргументами: на - для перехода на улицу или в - для перехода в помещение/объект.`);
            sendLog(message,`Общее`,`Попытался пойти.`,`Ошибка`,`Вывод: Вызов команды \`идти\` должны выполнятся с дополнительными аргументами: на - для перехода на улицу или в - для перехода в помещение/объект.`);
        }
    };

    if(comand(message).com == `баланс` && !mb && !mg){
        message.delete();
        let moneyT = new Intl.NumberFormat("ru", {
            style: "currency",
            currency: "USD",
            minimumSignificantDigits: 1
        })
        GetStats().then(stats => message.author.send(`Текущий баланс: ${moneyT.format(parseInt(stats.find(stat => stat.user == `<@!${message.author.id}>`).money))}`));
    }

    if(comand(message).com == `заплатить` && !mb && !mg ||
    comand(message).com == `платить` && !mb && !mg){
        async function pay(com){
            stats = await GetStats();
            if (stats.length == 0){return};

            let moneyT = new Intl.NumberFormat("ru", {
                style: "currency",
                currency: "USD",
                minimumSignificantDigits: 1
            })

            let user = stats.find(stat => stat.user == `<@!${message.author.id}>`);
            let gUser = stats.find(stat => stat.user == com.sarg[0]);
            if (user.id == gUser.id){return};
            let money = com.sarg[1];

            let user_user = message.author;
            let gUser_user = guild.members.cache.get(gUser.user.replace(/[<@!>]/g,'')).user;
            
            if(user == undefined){return}
            if(gUser == undefined){ message.author.send(`> Пользователь не найден, либо вы вводите его никнейм не правильно. Для корректной работы команды упомяните игрока, которому вы желаете переслать средства.`); return};
            if(isNaN(parseInt(money))){ message.author.send(`> Деньги стоит записывать в цифрах, иначе ничего не удастся.`); return};
            if(parseInt(user.money) < parseInt(money)){ message.author.send(`> У вас недостаточно средств.`); return};

            EditStats(user.id,`money`,`${parseInt(user.money) - parseInt(money)}`);
            setTimeout(() => EditStats(gUser.id,`money`,`${parseInt(gUser.money) + parseInt(money)}`), 250);
            
            user_user.send(`> Вы дали ${gUser_user.username}: ${moneyT.format(parseInt(money))}`);
            gUser_user.send(`> ${user_user.username} дал вам: ${moneyT.format(parseInt(money))}`);
            return;
        };
        pay(comand(message));
        message.delete();
    };

    if(comand(message).com == `форма` && !mb && !mg){
        message.delete();
        if(message.channel.name == 'полицейский-департамент'){
            let channel = guild.channels.cache.get(BDchnl);
            channel.messages.fetch(policeBDmsg).then(oMsg => {
                let role = '851059230710693911';
                let nMsg = oMsg.content.split('\n');
                nMsg.splice(0,1);

                if(nMsg.find(member => member == message.member.id) != null){
                    if(haveRole(message.member, role)){
                        removeRole(message.member, '851059230710693911');
                        removeRole(message.member, '851059555499638825');
                        removeRole(message.member, '836183994646921248');
                    }
                    if(!haveRole(message.member, role)){
                        giveRole(message.member, '851059230710693911');
                        giveRole(message.member, '851059555499638825');
                        giveRole(message.member, '836183994646921248');
                    }
                }else{
                    message.author.send(`Вы отсутствуете в базе данных полицейских. Обратитесь к капитану полиции.`);
                };
            });
        };
    };

    if(comand(message).com == `911` && !mb && !mg ||
    comand(message).com == `511` && !mb && !mg){
        message.delete();
        let role = '851059230710693911';
        let cops = guild.members.cache.filter(member => haveRole(member, role));
        for(let cop of cops){
            cop[1].send(`${message.member.nickname} вызывал(а) полицию с таким текстом: ${comand(message).arg}`)
        }
    };

    if(comand(message).com == `send` && !mb && !mg && (haveRole(message.member, `833778527609552918`) || head)){	
        message.delete();	
        message.channel.send(`${comand(message).arg}`);	
    };

    if(comand(message).com == `clear` && !mb && !mg && (haveRole(message.member, `833778527609552918`) || head)){
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
    
    if(comand(message).com == `edit` && !mg && (haveRole(message.member, `833778527609552918`) || head)
    || comand(message).com == `edit` && !mg && (haveRole(message.member, `822501730964078633`) || head)){
        message.delete();
        message.channel.guild.channels.cache.find(id => id == `${comand(message).sarg[0]}`).messages.fetch(`${comand(message).sarg[1]}`)
        .then(msg =>{

            if(!msg.author.bot) return;
            msg.edit(comand(message,2).carg);
        
        })
        .catch(console.error);
    };

    if(comand(message).com == `checkm` && message.author.id == `621917381681479693` && !mb && !mg){
        console.log(comand(message));
    };

    if(comand(message).com == 'cbd' && message.author.id == `621917381681479693` && !mb && !mg){
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
                message.channel.send(`!edit ${BDchnl} ${fMsg[0]} > **БАЗА ДАННЫХ ПОЛЬЗОВАТЕЛЕЙ 1**`);
            }catch{
                console.log(`Недостача аргументов`);
            }
        });
    };

    if(comand(message).com == 'cdbd' && message.author.id == `621917381681479693` && !mb && !mg){
        message.delete()
        message.channel.send(`!edit ${BDchnl} ${dopBDmsg} > **ДОПОЛНИТЕЛЬНАЯ БАЗА ДАННЫХ ЗНАЧЕНИЙ**\n^838003797149220884^1`);
    };

    if(comand(message).com == `tbd` && haveRole(message.member,`822493460493500436`) && !mb && !mg){
        message.delete();
        setTimeout(() => AddStats(`<@!${message.author.id}>`,25,'В розыске','Отсутствует',101), 1000);
    };

    if(comand(message).com == `ebd` && message.author.id == `621917381681479693` && !mb && !mg){
        message.delete();
        EditStats(comand(message).sarg[0],comand(message).sarg[1], comand(message,2).carg)
    };

    if(comand(message).com == `delbd` && message.author.id == `621917381681479693` && !mb && !mg){
        message.delete();
        delStats(comand(message).sarg[0])
    };

    if(comand(message).com == `gbd` && message.author.id == `621917381681479693` && !mb && !mg){
        message.delete();
        GetStats().then(stats => console.log(stats));
    };

    if(comand(message).com == `cex` && message.author.id == `621917381681479693` && !mb && !mg){
        message.delete();
        createEx(comand(message).sarg[0],comand(message).sarg[1],comand(message).sarg[2],comand(message,3).carg,message)
    };

    if(comand(message).com == `clore` && message.author.id == `621917381681479693` && !mb && !mg){
        createLore(comand(message).sarg[0],comand(message).sarg[1],comand(message,2).carg,message)
        message.delete();
    };

    if(!mb && mg){
        Stats(message);
    };

    if(message.channel.id == Config.channelsID.commits && message.author.id != '822500483826450454' && !mg){
        createCom(message.embeds[0],message);
    }

    if(comand(message).com == `checkpos` && message.author.id == `621917381681479693` && !mb && !mg){
        message.delete();
        console.log(`1: ${message.channel.position}`);
        console.log(`2: ${message.channel.parent.position}`);
    }

});

client.login(process.env.BOT_TOKEN);
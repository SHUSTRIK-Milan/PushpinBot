const Discord = require('discord.js');
const Config = require('./config');
const client = new Discord.Client();
const prefix = '!';
const BDpref = '^';
const urlSteam = `https://steamcommunity.com/`;

var guild;
const BDchnl = Config.channelsID.bd;
const dopBDmsg = `838003963412480070`;
const timeOfDelete = 250;

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
    if(member == null){return have};
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
    if (cat == 'РП') color = 11382073;

    if (add.slice(0,1) == prefix) act = 'Воспользовался командой.';

    if (Object.values(Config.logChannels).find(chl => chl == message.channel.id) != null){
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
                value: `${add}\n[<#${message.channel.id}>, https://discord.com/channels/814795850885627964/${message.channel.id}/${message.id}]`
            }],
            
            timestamp: new Date()
            }
        });
        return;
    }else if(cat == 'РП'){
        guild.channels.cache.get(Config.channelsID.rp_logs).send({embed: {
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
Все прошло успешно! Установите ролевое имя перед тем как начать игру!
            `)

            function verificate(){
                AddStats(`<@!${message.author.id}>`,250,'Нет','Нет',steamProfile)

                guild.members.fetch(message.author.id).then(member =>{
                    giveRole(member,`854315001543786507`); //citizen
                    giveRole(member,`851059555499638825`); //rp-role
                    giveRole(member,`836183994646921248`); //pushpin
                    giveRole(member,`836269090996879387`); //user
                    removeRole(member,`829423238169755658`); //ooc
                });

                sendLog(message,'Глобальное','Подтвердил(а) свой аккаунт.', 'Успешно', `SteamID: ${steamProfile}`)
                guild.channels.cache.get(`849709660579954748`).updateOverwrite(guild.members.cache.get(message.author.id),{'VIEW_CHANNEL': true});
            };

            function rpName(){
                let filter = m => m.author.id === message.author.id
                message.author.send('> Введите свое ролевое имя 👥')
                .then(() => {
                    message.channel.awaitMessages(filter, {
                        max: 1,
                        time: 120,
                        errors: ['time'],
                    })
                    .then(message => {
                        msgs = message.map(message => message)
                        msgs[0].author.send(`> Вы установили свое ролевое имя. Сменить его вы можете только при помощи администратора 📌`);
                        verificate();
                    })
                    .catch(() => {
                        message.author.send('test');
                    });
                });
            };

            rpName();
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
        setTimeout(() => message.delete(), timeOfDelete);
        let homePos = Config.objects.find(st => `«${st.name.toLowerCase()}»` == message.channel.parent.name.toLowerCase().slice(3));

        let objects = [];
        for (let room of homePos.rooms) objects.push(room.slice(0,1).toUpperCase()+room.slice(1));

        if (homePos != null && objects.join(', ') != ''){
            message.author.send(`Соседние объекты с ${homePos.name}:\n> ${homePos.radius.join(';\n> ')}.\nБлижайшие комнаты:\n> ${objects.join(';\n> ')}.`);
            sendLog(message,`РП`,`Осмотрелся на улице.`,`Успешно`,`Вывод: Соседние объекты с ${homePos.name}:\n> ${homePos.radius.join(';\n> ')}.\nБлижайшие комнаты:\n> ${objects.join(';\n> ')}.`);
        }else{
            message.author.send(`Соседние объекты с ${homePos.name}:\n> ${homePos.radius.join(';\n> ')}.\nБлижайшие комнаты отсутствуют.`);
            sendLog(message,`РП`,`Осмотрелся на улице.`,`Успешно`,`Вывод: Соседние объекты с ${homePos.name}:\n> ${homePos.radius.join(';\n> ')}.\nБлижайшие комнаты отсутствуют.`);
        };
    };

    if (comand(message).com == 'идти' && !mb && !mg){
        setTimeout(() => message.delete(), timeOfDelete);
        let homePos = Config.objects.find(st => `«${st.name.toLowerCase()}»` == message.channel.parent.name.toLowerCase().slice(3));
        //ищим среди улиц такую улицу, которая будет ровна категории нашего канал.
        let argsObj = guild.channels.cache.get(comand(message).arg.slice(2).slice(0,-1));
        if(argsObj != undefined) argsObj = argsObj.name.slice(1).slice(0,-1).toLowerCase().split('-').join(' ');
        if(argsObj == undefined) argsObj = comand(message).arg;
        console.log(argsObj);
        //проверяю не канал ли аргумент, если нет, то просто беру написанное.
        let walkway = homePos.radius.find(obj => obj.toLowerCase() == argsObj.toLowerCase());
        //ищу среди радиуса домашнего объекта тот объект, который был указан в аргументе.

        if (walkway != null){
            let cat = guild.channels.cache.find(cat => cat.name.toLowerCase().slice(3) == `«${walkway}»`.toLowerCase());
            //ищем каналы чье имя будет равно имени объекта пути
            if(cat != undefined || cat != null) if (cat.type == 'category'){
            //проверяем канал на тип категории
                if (haveRole(message.member,'835630198199681026')){ message.author.send('> Вы находитесь в админ-моде.'); return};
                cat.updateOverwrite(message.author, { 'VIEW_CHANNEL': true });
                //даем право читать сообщения в категории.
                message.channel.parent.permissionOverwrites.get(message.author.id).delete();
                //удаляем право читать сообщения в прошлой категории
                sendLog(message,`РП`,`Пошел.`,`Успешно`,`Перешел с ${homePos.name} на ${walkway}.`);
            };
        }else if (walkway == null && Config.objects.find(st => st.name.toLowerCase() == argsObj.toLowerCase()) != null){
            message.author.send(`${argsObj} не является соседним объектом с ${homePos.name}.`);
            sendLog(message,`РП`,`Попытался пойти.`,`Ошибка`,`Вывод: ${argsObj} не является соседней улицей с ${homePos.name}.`);
        }else{
            message.author.send(`Вероятнее всего объекта ${argsObj} нет, либо вы ввели его неправильно.`);
            sendLog(message,`РП`,`Попытался пойти.`,`Ошибка`,`Вывод: Вероятнее всего улицы ${argsObj} нет, либо вы ввели ее неправильно.`);
        };
    };

    if(comand(message).com == `баланс` && !mb && !mg){
        setTimeout(() => message.delete(), timeOfDelete);
        let moneyT = new Intl.NumberFormat("ru", {
            style: "currency",
            currency: "USD",
            minimumSignificantDigits: 1
        })
        GetStats().then(stats => {
            if (stats.length == 0){return};
            message.author.send(`Текущий баланс: ${moneyT.format(parseInt(stats.find(stat => stat.user == `<@!${message.author.id}>`).money))} 💰`);
            sendLog(message,'РП','Узнал свой баланс.','Успешно',`Вывод: Текущий баланс: ${moneyT.format(parseInt(stats.find(stat => stat.user == `<@!${message.author.id}>`).money))} 💰`);
        });
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

            let user_user = message.member;
            let gUser_user = guild.members.cache.get(gUser.user.replace(/[<@!>]/g,''));
            
            if(user == undefined){return}
            if(user == gUser_user){return}
            if(gUser == undefined){
                message.author.send(`> Пользователь не найден, либо вы вводите его никнейм не правильно. Для корректной работы команды упомяните игрока, которому вы желаете переслать средства 🙅`);
                sendLog(message,'РП','Попробовал передать деньги.','Ошибка',`Вывод: Пользователь не найден, либо вы вводите его никнейм не правильно. Для корректной работы команды упомяните игрока, которому вы желаете переслать средства 🙅`);
                return;
            };
            if(isNaN(parseInt(money))){ message.author.send(`> Деньги стоит записывать в цифрах, иначе ничего не удастся 🔢`); sendLog(message,'Общее','Попробовал передать деньги.','Ошибка',`Вывод: Деньги стоит записывать в цифрах, иначе ничего не удастся 🔢`); return};
            if(parseInt(user.money) < parseInt(money)){ message.author.send(`> У вас недостаточно средств.`); sendLog(message,'Общее','Попробовал передать деньги.','Ошибка',`Вывод: У вас недостаточно средств.`); return};

            EditStats(user.id,`money`,`${parseInt(user.money) - parseInt(money)}`);
            setTimeout(() => EditStats(gUser.id,`money`,`${parseInt(gUser.money) + parseInt(money)}`), 250);
            
            user_user.send(`> Вы дали ${gUser_user.nickname}: ${moneyT.format(parseInt(money))}`);
            gUser_user.send(`> ${user_user.nickname} дал вам: ${moneyT.format(parseInt(money))}`);

            sendLog(message,'РП','Передал деньги.','Успешно',`Вывод: Вы дали ${gUser_user.nickname}: ${moneyT.format(parseInt(money))}`)
            return;
        };
        pay(comand(message));
        setTimeout(() => message.delete(), timeOfDelete);
    };

    if(comand(message).com == `форма` && !mb && !mg){
        setTimeout(() => message.delete(), timeOfDelete);
        function giveForm(member, role){
            if(haveRole(member, role)){
                removeRole(member, role);
                giveRole(member, '854315001543786507');
                sendLog(message,'РП','Снял форму организации.','Успешно',`Роль: ${guild.roles.cache.get(role).name}`)
            }
            if(!haveRole(member, role)){
                if(!haveRole(member, `854315001543786507`)){
                    message.author.send(`**Вы не можете взять несколько форм организаций** 🗂️`);
                    sendLog(message,'РП','Попытался взять несколько ролей организации.','Ошибка',`Вывод: **Вы не можете взять несколько форм организаций** 🗂️`)
                    return;
                }
                giveRole(member, role);
                removeRole(member, '854315001543786507');
                sendLog(message,'РП','Взял форму организации.','Успешно',`Роль: ${guild.roles.cache.get(role).name}`)
            }
        };
        for(let dept in Config.departments){
            if(message.channel.id == Config.departments[dept][0]){
                let channel = guild.channels.cache.get(BDchnl);
                channel.messages.fetch(Config.departments[dept][1]).then(oMsg => {
                    let nMsg = oMsg.content.split('\n');
                    nMsg.splice(0,1);
    
                    if(nMsg.find(member => member == message.member.id) != null){
                        giveForm(message.member, Config.departments[dept][2]);
                    }else{
                        message.author.send(`**Вы отсутствуете в базе данных организации** 🗂️ Обратитесь к управляющему.`);
                        sendLog(message,'РП','Попытался взять форму.','Ошибка',`Вывод: **Вы отсутствуете в базе данных организации** 🗂️ Обратитесь к управляющему.`)
                    };
                });
            };
        }
    };

    if(comand(message).com == `911` && !mb && !mg){
        setTimeout(() => message.delete(), timeOfDelete);
        let object = message.channel.parent.name.slice(4).slice(0,-1);
        let room = message.channel.name;
        let adres = `${object.slice(0,1).toUpperCase()+object.slice(1)}, ${room.slice(0,1).toUpperCase()+room.slice(1)}`
        if(comand(message).sarg[0] == '1'){
            let staff = guild.members.cache.filter(member => haveRole(member, Config.departments.fire[2]));
            if(staff.size == 0){
                message.author.send(`**На данный момент пожарные на службе отсутствуют** 🔥`);
                sendLog(message,'РП','Попытался вызвать пожарную службу.','Ошибка',`Вывод: **На данный момент пожарные на службе отсутствуют** 🔥`)
            }else{
                message.author.send(`**Вы вызывали пожарную службу** 🔥\n> ${comand(message,1).carg}`);
                sendLog(message,'РП','Вызвал пожарную службу.','Успешно',`Вывод: **Вы вызывали пожарную службу** 🔥\n> ${comand(message,1).carg}`)
                for(let worker of staff){
                    worker[1].send(`**${message.member.nickname} вызывал(а) пожарную службу** 🔥\n> ${comand(message,1).carg}\n**Адрес:**\n> ${adres}`)
                }
            }
        }else if(comand(message).sarg[0] == '2'){
            let staff = guild.members.cache.filter(member => haveRole(member, Config.departments.police[2]));
            if(staff.size == 0){
                message.author.send(`**На данный момент полицейские на службе отсутствуют** 🚔`);
                sendLog(message,'РП','Попытался вызвать полицию.','Ошибка',`Вывод: **На данный момент полицейские на службе отсутствуют** 🚔`)
            }else{
                message.author.send(`**Вы вызывали полицию** 🚔\n> ${comand(message,1).carg}`);
                sendLog(message,'РП','Вызвал полицию.','Успешно',`Вывод: **Вы вызывали полицию** 🚔\n> ${comand(message,1).carg}`)
                for(let worker of staff){
                    worker[1].send(`**${message.member.nickname} вызывал(а) полицию** 🚔\n> ${comand(message,1).carg}\n**Адрес:**\n> ${adres}`)
                }
            }
        }else if(comand(message).sarg[0] == '3'){
            let staff = guild.members.cache.filter(member => haveRole(member, Config.departments.med[2]));
            if(staff.size == 0){
                message.author.send(`**На данный момент медики на службе отсутствуют** ⚕️`);
                sendLog(message,'РП','Попытался вызвать медицинскую службу.','Ошибка',`Вывод: **На данный момент медики на службе отсутствуют** ⚕️`)
            }else{
                message.author.send(`**Вы вызывали медицинскую службу** ⚕️\n> ${comand(message,1).carg}`);
                sendLog(message,'РП','Вызвал медицинскую службу.','Успешно',`Вывод: **Вы вызывали медицинскую службу** ⚕️\n> ${comand(message,1).carg}`)
                for(let worker of staff){
                    worker[1].send(`**${message.member.nickname} вызывал(а) медицинскую службу** ⚕️\n> ${comand(message,1).carg}\n**Адрес:**\n> ${adres}`)
                }
            }
        }else{
            message.author.send(`**Для вызова служб по номеру 911 используйте дополнительный код службы** ☎️
> 1 – пожарная служба.
> 2 – полиция.
> 3 – медицинская служба.
            `);
        };
        sendLog(message,'РП','Вызвал 911 без доп. кода.','Успешно',`Вывод: **Для вызова служб по номеру 911 используйте дополнительный код службы** ☎️`)
    };

    if(comand(message).com == 'admin' && !mb && !mg && (haveRole(message.member, '830061387849662515') || head)){
        setTimeout(() => message.delete(), timeOfDelete);
        if(haveRole(message.member, '835630198199681026')){
            removeRole(message.member, '835630198199681026');
            message.channel.parent.updateOverwrite(message.member, {'VIEW_CHANNEL': true})
            sendLog(message,'РП','Вышел из админ-мода.','Успешно',` `)
        }
        if(!haveRole(message.member, '835630198199681026')){
            giveRole(message.member, '835630198199681026');
            message.channel.parent.permissionOverwrites.get(message.author.id).delete();
            sendLog(message,'РП','Вошел в админ-мод.','Успешно',` `)
        }
    };

    if(comand(message).com == `@` && !mb && !mg && !haveRole(message.member, '830061387849662515')){
        setTimeout(() => message.delete(), timeOfDelete);
        let staff = guild.members.cache.filter(member => (haveRole(member, '830061387849662515') || head) && member.presence.status != 'offline');
        console.log(staff.size);
        if(staff.size == 0){
            message.author.send(`**На данный момент администраторы в сети отсутствуют. Мы оповестили их о вашей жалобе** 👥`);
            sendLog(message,'РП','Попытался вызвать администратора.','Ошибка',`Вывод: **На данный момент администраторы в сети отсутствуют. Мы оповестили их о вашей жалобе** 👥`)
            guild.channels.cache.get(Config.channelsID.admin_claim).send(`<@&830061387849662515>, **${message.author.tag} написал жалобу, но администраторов нет в сети:**`, {embed: {
                    thumbnail: {
                        url: message.author.displayAvatarURL()
                    },
                    fields: [{
                        name: `Текст жалобы:`,
                        value: `${comand(message).arg}`
                    }],
                    fields: [{
                        name: `Местоположение:`,
                        value: `${message.channel.parent.name} -> <#${message.channel.id}>`
                    }],
                }
            });
        }else{
            message.author.send(`**Вы вызывали администратора** 👥\n> ${comand(message).arg}`);
            sendLog(message,'РП','Вызвал администратора.','Успешно',`Вывод: **Вы вызывали администратора** 👥\n> ${comand(message).arg}`)
            for(let worker of staff){
                worker[1].send(`**${message.member.nickname} вызывал(а) администратора** 👥\n> ${comand(message).arg}\n**Местоположение:**\n> ${message.channel.parent.name} -> <#${message.channel.id}>`)
            }
        }
    };

    if(comand(message).com == `send` && !mb && !mg && (haveRole(message.member, `833778527609552918`) || head)){	
        setTimeout(() => message.delete(), timeOfDelete);	
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
        setTimeout(() => message.delete(), timeOfDelete);
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
        setTimeout(() => message.delete(), timeOfDelete);
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
        setTimeout(() => message.delete(), timeOfDelete);
        message.channel.send(`!edit ${BDchnl} ${dopBDmsg} > **ДОПОЛНИТЕЛЬНАЯ БАЗА ДАННЫХ ЗНАЧЕНИЙ**\n^838003797149220884^1`);
    };

    if(comand(message).com == `tbd` && haveRole(message.member,`822493460493500436`) && !mb && !mg){
        setTimeout(() => message.delete(), timeOfDelete);
        setTimeout(() => AddStats(`<@!${message.author.id}>`,25,'В розыске','Отсутствует',101), 1000);
    };

    if(comand(message).com == `ebd` && message.author.id == `621917381681479693` && !mb && !mg){
        setTimeout(() => message.delete(), timeOfDelete);
        EditStats(comand(message).sarg[0],comand(message).sarg[1], comand(message,2).carg)
    };

    if(comand(message).com == `delbd` && message.author.id == `621917381681479693` && !mb && !mg){
        setTimeout(() => message.delete(), timeOfDelete);
        delStats(comand(message).sarg[0])
    };

    if(comand(message).com == `gbd` && message.author.id == `621917381681479693` && !mb && !mg){
        setTimeout(() => message.delete(), timeOfDelete);
        GetStats().then(stats => console.log(stats));
    };

    if(comand(message).com == `cex` && message.author.id == `621917381681479693` && !mb && !mg){
        setTimeout(() => message.delete(), timeOfDelete);
        createEx(comand(message).sarg[0],comand(message).sarg[1],comand(message).sarg[2],comand(message,3).carg,message)
    };

    if(comand(message).com == `clore` && message.author.id == `621917381681479693` && !mb && !mg){
        createLore(comand(message).sarg[0],comand(message).sarg[1],comand(message,2).carg,message)
        setTimeout(() => message.delete(), timeOfDelete);
    };

    if(!mb && mg){
        console.log(message.member);
        Stats(message);
    };

    if(message.channel.id == Config.channelsID.commits && message.author.id != '822500483826450454' && !mg){
        createCom(message.embeds[0],message);
    }

    if(comand(message).com == `checkpos` && message.author.id == `621917381681479693` && !mb && !mg){
        setTimeout(() => message.delete(), timeOfDelete);
        console.log(`1: ${message.channel.position}`);
        console.log(`2: ${message.channel.parent.position}`);
    }

});

client.login(process.env.BOT_TOKEN);
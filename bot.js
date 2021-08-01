const Discord = require('discord.js');
const Config = require('./config');
const client = new Discord.Client();
const {DiscordInteractions} = require("slash-commands");
const axios = require("axios");
axios.defaults.headers.common['Authorization'] = `Bot ${process.env.BOT_TOKEN}`;
const prefix = '!';
const BDpref = '^';
const urlSteam = `https://steamcommunity.com/`;

var guild;
var allChannels = [];
var rpChannels = [];
var rpchannel;
const BDchnl = Config.channelsID.bd;
var ROFLbdMsg = `863733070308966422`
var t = false
const dopBDmsg = `838003963412480070`;
const timeOfDelete = 350;

const SteamAPI = require('steamapi');
var GitHub = require('github-api');
const steam = new SteamAPI('52E6781CF3B4EB4234DC424555A7AD9C');
var gitA = new GitHub({
    token: process.env.git
});
var fork = gitA.getRepo('SHUSTRIK-Milan','PushpinBot');

client.on('ready', () => {
    console.log(`${client.user.tag} готов!`);
    guild = client.guilds.cache.get('814795850885627964');
    for(let channel of guild.channels.cache) allChannels.push(channel[0])
    for(let channel of allChannels) if(Object.values(Config.channelsID).find(chl => chl == channel) == null) rpChannels.push(channel);
    for(let t of rpChannels){ console.log(guild.channels.cache.get(t).name)}
    
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

function random(min, max) {
    let rand = min + Math.random() * (max + 1 - min);
    return Math.floor(rand);
}

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

function roll(){
    return random(0, 100)
}

function coinFlip(){
    let rand = random(0, 1)
    if(rand == 0) rand = 'Решка'
    else if(rand == 1) rand = 'Орёл'
    return rand
}

function card(){
    let rand = random(1, 13)
    if(rand == 1) rand = 'Двойка'
    else if(rand == 2) rand = 'Тройка'
    else if(rand == 3) rand = 'Четверка'
    else if(rand == 4) rand = 'Пятерка'
    else if(rand == 5) rand = 'Шестерка'
    else if(rand == 6) rand = 'Семерка'
    else if(rand == 7) rand = 'Восьмерка'
    else if(rand == 8) rand = 'Девятка'
    else if(rand == 9) rand = 'Десятка'
    else if(rand == 10) rand = 'Валет'
    else if(rand == 11) rand = 'Дама'
    else if(rand == 12) rand = 'Король'
    else if(rand == 13) rand = 'Туз'

    let rand_sec = random(1, 4)
    if(rand_sec == 1) rand_sec = 'черви' 
    else if(rand_sec == 2) rand_sec = 'буби'
    else if(rand_sec == 3) rand_sec = 'трефы'
    else if(rand_sec == 4) rand_sec = 'пики'
    return `${rand} ${rand_sec}`
}

function cube(){
    let rand = random(0, 5)
    console.log(rand)
    if(rand == 0) rand = '1'
    else if(rand == 1) rand = '2'
    else if(rand == 2) rand = '3'
    else if(rand == 3) rand = '4'
    else if(rand == 4) rand = '5'
    else if(rand == 5) rand = '6'
    return rand
}

function sendLog(message,cat,act,status,add){
    let img = `https://i.imgur.com/cjSSwtu.png`;
    if (status == 'Успешно') img = `https://i.imgur.com/cjSSwtu.png`;
    if (status == 'Ошибка') img = `https://i.imgur.com/utuBexR.png`;

    let color = 11645371; 
    if (cat == 'Админ') color = 4105807;
    if (cat == 'Глобальное') color = 14560833;
    if (cat == 'Общее') color = 11645371;
    if (cat == 'РП') color = 11382073;
    
    if(cat != 'РП'){
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
    };
    if(cat == 'РП'){
        guild.channels.cache.get(Config.channelsID.rp_logs).send({embed: {
            color: color,
            author: {
                name: `${message.author.username} - ${message.member.nickname}`,
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

    function verificate(name){
        guild.members.cache.get(message.author.id).setNickname(name);
        AddStats(`<@!${message.author.id}>`,250,'Нет','Нет',steamProfileInfo.steamID)

        guild.members.fetch(message.author.id).then(member =>{
            setTimeout(() => giveRole(member,`854315001543786507`), timeOfDelete); //citizen
            setTimeout(() => giveRole(member,`851059555499638825`), timeOfDelete); //rp-role
            setTimeout(() => giveRole(member,`836183994646921248`), timeOfDelete); //pushpin
            setTimeout(() => giveRole(member,`836269090996879387`), timeOfDelete); //user
            setTimeout(() => removeRole(member,`829423238169755658`), timeOfDelete); //ooc
        });

        sendLog(message,'Глобальное','Подтвердил(а) свой аккаунт.', 'Успешно', `SteamID: ${steamProfile}`)
        guild.channels.cache.get(`849709660579954748`).updateOverwrite(guild.members.cache.get(message.author.id),{'VIEW_CHANNEL': true});
    };

    function rpName(){
        let filter = m => m.author.id === message.author.id
        message.author.send('> Для окончания регистрации требуется лишь одна маленькая условность 👥\nПожалуйста, введите свое ролевое имя ')
        .then(() => {
            message.channel.awaitMessages(filter, {
                max: 1,
                time: 120000,
                errors: ['time'],
            })
            .then(message => {
                msgs = message.map(message => message)
                if(msgs[0].content.length <= 32 && typeof(msgs[0].content) == 'string' && (msgs[0].content != " " || msgs[0].content != "")){
                    msgs[0].author.send(`
> **Успешно! Ваш аккаунт зарегистрирован** 🎉\nВы установили свое ролевое имя. Сменить его вы сможете только при помощи администратора.
                    `)
                    verificate(msgs[0].content);
                }else{
                    rpName();
                }
            })
            .catch(() => {
                rpName();
            });
        });
    };

    if(person == undefined && haveRole(guild.members.cache.get(message.author.id), `829423238169755658`)){
        rpName()
    }else if(person != undefined && haveRole(guild.members.cache.get(message.author.id), `829423238169755658`)){
        message.author.send('> С возвращением!')
        rpName()
    }else{
        message.author.send('> Вы уже зарегистрированы.')
    }
    
};

async function minusMoney(member, money){
    stats = await GetStats();
    if (stats.length == 0){return};

    let user = stats.find(stat => stat.user == `<@!${member.id}>`);
    if(user == undefined){return}

    if(parseInt(user.money) < parseInt(money)){return false}
    EditStats(user.id,`money`,`${parseInt(user.money) - parseInt(money)}`);
    return true;
};

async function plusMoney(member, money){
    stats = await GetStats();
    if (stats.length == 0){return};

    let user = stats.find(stat => stat.user == `<@!${member.id}>`);
    if(user == undefined){return false}

    EditStats(user.id,`money`,`${parseInt(user.money) + parseInt(money)}`);
    return true;
};

async function pay(message, userDate, money, functionSend){
    stats = await GetStats();
    if (stats.length == 0){return};

    let moneyT = new Intl.NumberFormat("ru", {
        style: "currency",
        currency: "USD",
        minimumSignificantDigits: 1
    })

    let user = stats.find(stat => stat.user == `<@!${message.author.id}>`);
    let gUser = stats.find(stat => stat.user == `<@!${userDate}>`);
    if(gUser == undefined){
        functionSend(`> Пользователь не найден, либо вы вводите его никнейм не правильно. Для корректной работы команды упомяните игрока, которому вы желаете переслать средства 🙅`);
        sendLog(message,'РП','Попробовал передать деньги.','Ошибка',`Вывод: Пользователь не найден, либо вы вводите его никнейм не правильно. Для корректной работы команды упомяните игрока, которому вы желаете переслать средства 🙅`);
        return;
    };

    console.log(user);
    console.log(gUser)
    
    if (user.id == gUser.id){return};

    let user_user = message.member;
    let gUser_user = guild.members.cache.get(userDate);

    if(gUser == undefined){
        functionSend(`> Пользователь не найден, либо вы вводите его никнейм не правильно. Для корректной работы команды упомяните игрока, которому вы желаете переслать средства 🙅`);
        sendLog(message,'РП','Попробовал передать деньги.','Ошибка',`Вывод: Пользователь не найден, либо вы вводите его никнейм не правильно. Для корректной работы команды упомяните игрока, которому вы желаете переслать средства 🙅`);
        return;
    };
    if(isNaN(parseInt(money))){ functionSend(`> Деньги стоит записывать в цифрах, иначе ничего не удастся 🔢`); sendLog(message,'Общее','Попробовал передать деньги.','Ошибка',`Вывод: Деньги стоит записывать в цифрах, иначе ничего не удастся 🔢`); return};
    if(parseInt(user.money) < parseInt(money)){ functionSend(`> У вас недостаточно средств.`); sendLog(message,'Общее','Попробовал передать деньги.','Ошибка',`Вывод: У вас недостаточно средств.`); return};

    setTimeout(() => minusMoney(user_user, money), 500);
    setTimeout(() => plusMoney(gUser_user, money), 1000);
    
    functionSend(`> Вы дали ${gUser_user.nickname}: ${moneyT.format(parseInt(money))}`);
    gUser_user.send(`> ${user_user.nickname} дал вам: ${moneyT.format(parseInt(money))}`);

    sendLog(message,'РП','Передал деньги.','Успешно',`Вывод: Вы дали ${gUser_user.nickname}: ${moneyT.format(parseInt(money))}`)
    return;
};

async function roflBot(text, messageG){
    let chnl = guild.channels.cache.get(BDchnl)
    let msg = await chnl.messages.fetch(ROFLbdMsg)
    let nMsg = msg.content.split('\n')

    let outF = nMsg.find(n => n.split('^')[0].toLowerCase() == text.toLowerCase())
    console.log(outF)

    if(outF != undefined && t == false){
        if(outF.split('^')[3] == undefined) messageG.channel.send(`${outF.split('^')[1]} (от ${outF.split('^')[2]})`)
        if(outF.split('^')[3] != undefined) messageG.channel.send(`${outF.split('^')[1]} (от ${outF.split('^')[2]})`, {files: [outF.split('^')[3]]})
    }
    if(outF == undefined && t == false){
        let filter = m => m.author.id === messageG.author.id && m.author.bot === false
        t = true
        messageG.channel.send(`Я не знаю как мне на это ответить. Напиши, как мне на это отвечать, <@!${messageG.author.id}>.`)
        .then(() => {
            messageG.channel.awaitMessages(filter, {
                max: 1,
                time: 10000,
                errors: ['time'],
            })
            .then(message => {
                msgs = message.map(message => message)
                let ed = `${msg.content}\n${messageG.content}^${msgs[0].content}^<@!${msgs[0].author.id}>`
                console.log(msgs[0])
                if(msgs[0].attachments.first() != undefined) ed = `${msg.content}\n${messageG.content}^${msgs[0].content}^<@!${msgs[0].author.id}>^${msgs[0].attachments.first().url}`

                if(ed.length < 1800){
                    messageG.channel.send(`Спасибо, <@!${messageG.author.id}>!`);
                    msg.edit(ed)
                }
                if(ed.length > 1800){
                    messageG.channel.send(`Ой... кажется моя память переполнена. Я все забыл. Давайте по новой, <@!${messageG.author.id}>.`);
                    msg.edit(nMsg[0])
                }
                t = false
            })
            .catch(() => {
                messageG.channel.send(`Вы так и не сказали, как мне на это отвечать, <@!${messageG.author.id}>.`);
                t = false
            });
        });
        
    }
    return msg
}

client.on('messageDelete', (message) => {
    rpchannel = rpChannels.find(channel => channel == message.channel.id) != null;
    let mb = message.author.bot;
    let mg = message.guild == undefined;
    if(!mb && !mg && rpchannel) sendLog(message, 'РП', "Сообщение удалено", "Успешно", `Содержимое сообщения: ${message.content}`)
    if(!mb && !mg && !rpchannel) sendLog(message,'Общее',`Сообщение удалено`,'Успешно',`Содержимое сообщения: ${message.content}`)
});

client.on('messageUpdate', (messageOld, messageNew) =>{    
    rpchannel = rpChannels.find(channel => channel == messageNew.channel.id) != null;
    let mb = messageNew.author.bot;
    let mg = messageNew.guild == undefined;
    if(!mb && !mg && rpchannel) sendLog(messageNew, 'РП', "Отредактировал сообщение", "Успешно", `**Старое сообщение:** ${messageOld.content}\n**Новое сообщение:** ${messageNew.content}`)
    if(!mb && !mg && !rpchannel) sendLog(messageNew, 'Общее', "Отредактировал сообщение", "Успешно", `**Старое сообщение:** ${messageOld.content}\n**Новое сообщение:** ${messageNew.content}`)
    
})

client.on('message', message => {
    let mb = message.author.bot;
    let mg = message.guild == undefined;
    let head = (haveRole(message.member, '833226140755689483') || haveRole(message.member, '833227050550296576'));
    let rpCreator = haveRole(message.member, '856092976702816287')

    rpchannel = rpChannels.find(channel => channel == message.channel.id) != null;
    if(!mb && !mg && !rpchannel) sendLog(message,`Общее`,`Отправил сообщение.`,`Успешно`,`${message.content}`)
    if(!mb && !mg && rpchannel) sendLog(message,`РП`,`Отправил сообщение.`,`Успешно`,`${message.content}`)

    if(message.content == '⠀' && message.author.bot){
        setTimeout(() => message.delete(), timeOfDelete);
    }

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
        setTimeout(() => message.delete(), timeOfDelete);
        console.log(comand(message));
        console.log(message)
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

    if(comand(message).com == `ebd` && (haveRole(message.member, `833778527609552918`) || head) && !mb && !mg){
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

    if(message.channel.id == Config.channelsID.commits && message.author.id != '822500483826450454' && !mg){
        createCom(message.embeds[0],message);
    }

    if(comand(message).com == `checkpos` && message.author.id == `621917381681479693` && !mb && !mg){
        setTimeout(() => message.delete(), timeOfDelete);
        let t = undefined
        t.split(1)
    }

    if(comand(message).com == `ban` && (haveRole(message.member, `833778527609552918`) || head) && !mb && !mg){
        setTimeout(() => message.delete(), timeOfDelete);
        let userbanned = guild.members.cache.get(comand(message).sarg[0].slice(3).slice(0,-1));

        if(userbanned != undefined){
            let reason = comand(message, 1).carg;
            console.log(reason);
            for (let [id, channel] of guild.channels.cache) {
                if(Object.values(Config.channelsID).find(chl => chl == channel.id) == null && channel.type == 'category'){
                    if(channel.permissionOverwrites.get(userbanned.id) != undefined) channel.permissionOverwrites.get(userbanned.id).delete();
                }
            }
            userbanned.send(`**Вы были забанены администратором ${message.author.tag}** 🔨\n> ${reason}`);
            sendLog(message,'РП','Забанил игрока.','Успешно',`Вывод: **Вы были забанены администратором ${message.author.tag}** 🔨\n> ${reason}`)
        };
    }

    if(comand(message).com == `unban` && (haveRole(message.member, `833778527609552918`) || head) && !mb && !mg){
        setTimeout(() => message.delete(), timeOfDelete);
        let userunbanned = guild.members.cache.get(comand(message).sarg[0].slice(3).slice(0,-1));

        if(userunbanned != undefined){
            let reason = comand(message, 1).carg;
            console.log(reason);
            guild.channels.cache.get(`849709660579954748`).updateOverwrite(userunbanned,{'VIEW_CHANNEL': true});
            userunbanned.send(`**Вы были разбанены администратором ${message.author.tag}** 🔨\n> ${reason}`);
            sendLog(message,'РП','Разбанил игрока.','Успешно',`Вывод: **Вы были разбанены администратором ${message.author.tag}** 🔨\n> ${reason}`)
        };
    }

    if(comand(message).com == `refreshFA` && (haveRole(message.member, `833778527609552918`) || head || rpCreator) && !mb && !mg){
        setTimeout(() => message.delete(), timeOfDelete);
        let channel
        let specialChannel = [
            {id: guild.roles.everyone, deny: 'VIEW_CHANNEL'},
            {id: `833226140755689483`, allow: 'VIEW_CHANNEL'},
            {id: `833227050550296576`, allow: 'VIEW_CHANNEL'},
            {id: `830061387849662515`, allow: 'VIEW_CHANNEL'},
            {id: `856092976702816287`, allow: 'VIEW_CHANNEL'},
        ]
        try{
            for(let channelID of guild.channels.cache){
                channel = guild.channels.cache.get(channelID[0])
                if(channel != undefined){
                    if(channel.parentID == Config.channelsID.fast_access){channel.delete()}
                }
            }
            setTimeout(() =>{
                if(channel != undefined){
                    for(let obj of Config.objects){
                        if(obj.open){
                            guild.channels.create(`«${obj.name}»`, {type: 'text', topic: `${obj.id}-${Config.globalObjects.find(gobj => gobj.id == obj.id).name}`, parent: Config.channelsID.fast_access})
                        }else if(!obj.open){
                            guild.channels.create(`«${obj.name}»`, {type: 'text', topic: `${obj.id}-${Config.globalObjects.find(gobj => gobj.id == obj.id).name}`, parent: Config.channelsID.fast_access, permissionOverwrites: specialChannel})
                        }
                    } 
                }
            }, timeOfDelete*5)
        }catch(error){console.log(error)}
    }

    if(comand(message).com == `refreshIDobj` && (haveRole(message.member, `833778527609552918`) || head || rpCreator) && !mb && !mg){
        setTimeout(() => message.delete(), timeOfDelete);
        let channelsRefr = []
        for(let channel of guild.channels.cache) if(channel[1].parentID != undefined) channelsRefr.push(channel[1])
        try{
            for(let obj of Config.objects){
                for(let room of obj.rooms){
                    let channel = channelsRefr.find(channel => channel.name.toLowerCase() == room.toLowerCase() && channel.parent.id == obj.cId)
                    channel.setTopic(`${obj.id}-${Config.globalObjects.find(gobj => gobj.id == obj.id).name}`)
                }
            }
        }catch(error){console.log(error)}
    }

    if(comand(message).com == `commands` && head && !mb && !mg){
        setTimeout(() => message.delete(), timeOfDelete);
        client.interaction.getApplicationCommands(config.guild_id).then(console.log);
    }

    if(message.channel.id == Config.channelsID.bot && !mb && !mg){
        roflBot(message.content, message)
    }
});

const config = {
    token: Config.discordTocens.main,
    publicKey : "0e6a87c0f53052a2025917df52069144195fea4b82e32cb43619d65d1c278a97",
    applicationId: "822500483826450454",
    guild_id: "814795850885627964"
};

client.interaction = new DiscordInteractions({
    applicationId: config.applicationId,
    authToken: config.token,
    publicKey: config.publicKey,
});

client.on('ready', () => {
	checkIntegrations();
});

client.ws.on('INTERACTION_CREATE', async interaction => {

    /* 
    БЛОК ФУНКЦИЙ КОМАНД
    */

    console.log(interaction)
    
    let channel = guild.channels.cache.get(interaction.channel_id);
    let user
    try{
        user = await guild.members.fetch(interaction.member.user.id);
    }catch{
        user = await guild.members.fetch(interaction.user.id);
    }
    let head = (haveRole(user, '833226140755689483') || haveRole(user, '833227050550296576'));
    let rpCreator = haveRole(user, '856092976702816287')
    let rpchannel = rpChannels.find(channel => channel == interaction.channel_id) != null;
    let msgDate = {author: user.user, channel: channel, content: arg, member: user};

    function sendNullMessage(){
        client.api.interactions(interaction.id, interaction.token).callback.post({
            data: {
                type: 4,
                data: {
                    content: '⠀'
                }
            }
        })
    }

    function sendGlobalMessage(content){
        client.api.interactions(interaction.id, interaction.token).callback.post({
            data: {
                type: 4,
                data: {
                    content: content
                }
            }
        })
    }

    function sendLocalMessage(content){
        client.api.interactions(interaction.id, interaction.token).callback.post({
            data: {
                type: 4,
                data: {
                    content: content,
                    flags: 64
                }
            }
        })
    }

    async function sendEditMessage(text, color, dop, ping){
        client.api.interactions(interaction.id, interaction.token).callback.post({
            data: {
                type: 5,
            },
        })

        let webhooks = await channel.fetchWebhooks()
        let timer
        console.log(webhooks.find(hook => hook.name == user.nickname))
        if(webhooks.find(hook => hook.name == user.nickname) == undefined){
            channel.createWebhook(`${user.nickname}`, {avatar: user.user.displayAvatarURL()}).then(hook => {
                console.log(hook)

                if(dop != undefined){
                    hook.send(dop)
                }

                setTimeout(() => {hook.sendSlackMessage({
                    'username': user.nickname,
                    'attachments': [{
                        'pretext': text,
                        'color': color,
                    }]
                })}, 100)

                if(ping != undefined){
                    setTimeout(() => hook.send(`${ping}⤴️`), 150)
                }

                timer = setTimeout(() => {
                    hook.delete()
                }, 60000)
            })
        }else{
            let hook = webhooks.find(hook => hook.name == user.nickname)
            let hookId = hook.id
            console.log(hook)

            if(dop != undefined){
                hook.send(dop)
            }

            setTimeout(() => {hook.sendSlackMessage({
                'username': user.nickname,
                'attachments': [{
                    'pretext': text,
                    'color': color,
                }]
            })}, 100)

            if(ping != undefined){
                setTimeout(() => hook.send(`${ping}⤴️`), 150)
            }

            clearTimeout(timer); 
            timer = setTimeout(() => {
                channel.fetchWebhooks().then(hooks => hooks.get(hookId).delete())
            }, 60000);
        }
        
        client.api.webhooks(client.user.id, interaction.token).messages('@original').delete()
    };

    if(interaction.type == 3){
        if(Object.getOwnPropertyNames(Config.departments).find(obj => obj == interaction.data.custom_id) != undefined){
            if(channel.id == Config.departments[interaction.data.custom_id][0] && haveRole(msgDate.member, `854315001543786507`) && !haveRole(msgDate.member, Config.departments[interaction.data.custom_id][2])){
                let channel = guild.channels.cache.get(BDchnl);
                let oMsg = await channel.messages.fetch(Config.departments[interaction.data.custom_id][1])
                let nMsg = oMsg.content.split('\n');
                nMsg.splice(0,1);

                if(nMsg.find(member => member.split('-')[0] == msgDate.member.id) != null){
                    console.log(nMsg.find(member => member.split('-')[0] == msgDate.member.id))
                    giveRole(user, Config.departments[interaction.data.custom_id][2]);
                    removeRole(user, '854315001543786507');
                    sendLog(msgDate,'РП','Взял форму организации.','Успешно',`Роль: ${guild.roles.cache.get(Config.departments[interaction.data.custom_id][2]).name}`)
                    sendLocalMessage(`> **Вы взяли форму** 🗂️`);
                    return;
                }else{
                    sendLocalMessage(`> **Вы отсутствуете в базе данных организации** 🗂️ Обратитесь к управляющему.`);
                    sendLog(msgDate,'РП','Попытался взять форму.','Ошибка',`Вывод: > **Вы отсутствуете в базе данных организации** 🗂️ Обратитесь к управляющему.`)
                    return
                }
            }else if(channel.id == Config.departments[interaction.data.custom_id][0] && !haveRole(msgDate.member, `854315001543786507`)||
                channel.id != Config.departments[interaction.data.custom_id][0] && !haveRole(msgDate.member, `854315001543786507`)){
                sendLocalMessage(`> **Вы не можете взять несколько форм организаций** 🗂️`);
                sendLog(msgDate,'РП','Попытался взять несколько ролей организации.','Ошибка',`Вывод: > **Вы не можете взять несколько форм организаций** 🗂️`)
                return;
            }
        }

        if(interaction.data.custom_id == 'yesNSFW'){
            if(haveRole(user, `871027221521899621`)){
                client.api.interactions(interaction.id, interaction.token).callback.post({
                    data: {
                        type: 7,
                        data:{
                            content: 'Отлично! Вам был отключен доступ к NSFW каналам.',
                            components: [],
                            embeds: []
                        }
                    }
                })
                removeRole(user, '871027221521899621')
            }else if(!haveRole(user, `871027221521899621`)){
                client.api.interactions(interaction.id, interaction.token).callback.post({
                    data: {
                        type: 7,
                        data:{
                            content: 'Отлично! Вам был подключен доступ к NSFW каналам.',
                            components: [],
                            embeds: []
                        }
                    }
                })
                giveRole(user, '871027221521899621')
            }
        }
        if(interaction.data.custom_id == 'noNSFW'){
            client.api.interactions(interaction.id, interaction.token).callback.post({
                data: {
                    type: 7,
                    data:{
                        content: 'Хорошо. Спасибо за обращение!',
                        components: [],
                        embeds: []
                    }
                }
            })
        }
    }

    if (interaction.data.name == "осмотр") {
        var arg = "";
        let msgDate = {author: user.user, channel: channel, content: arg, member: user};
        if (interaction.data.options == undefined){
            
        } else {
            interaction.data.options.forEach((c) => {
                if (c.name == "осмотр") {
                    arg = c.value;
                }
            });
        }

        if(rpchannel){
            let homePos = Config.objects.find(st => `«${st.name.toLowerCase()}»` == channel.parent.name.toLowerCase().slice(3) && st.id == channel.topic.split('-')[0]);
            console.log(homePos.radius.length)

            let objects = [];
            for (let room of homePos.rooms) objects.push(room.slice(0,1).toUpperCase()+room.slice(1));

            if (homePos != null && objects.length != 0 && homePos.radius.length != 0){
                sendLocalMessage(`Соседние объекты с ${homePos.name}:\n> ${homePos.radius.join(';\n> ')}.\nБлижайшие комнаты:\n> ${objects.join(';\n> ')}.`)
                sendLog(msgDate,`РП`,`Осмотрелся на улице.`,`Успешно`,`Вывод: Соседние объекты с ${homePos.name}:\n> ${homePos.radius.join(';\n> ')}.\nБлижайшие комнаты:\n> ${objects.join(';\n> ')}.`);
            }else if(homePos != null && objects.length == 0 && homePos.radius.length != 0){
                sendLocalMessage(`Соседние объекты с ${homePos.name}:\n> ${homePos.radius.join(';\n> ')}.\nБлижайшие комнаты отсутствуют.`)
                sendLog(msgDate,`РП`,`Осмотрелся на улице.`,`Успешно`,`Вывод: Соседние объекты с ${homePos.name}:\n> ${homePos.radius.join(';\n> ')}.\nБлижайшие комнаты отсутствуют.`);
            }else if(homePos != null && objects.length != 0 && homePos.radius.length == 0){
                sendLocalMessage(`Соседние объекты с ${homePos.name}:\n> Ближайшие выходы отсутствуют.\nБлижайшие комнаты:\n> ${objects.join(';\n> ')}.`)
                sendLog(msgDate,`РП`,`Осмотрелся на улице.`,`Успешно`,`Вывод: Соседние объекты с ${homePos.name}:\n> Ближайшие выходы отсутствуют.\nБлижайшие комнаты:\n> ${objects.join(';\n> ')}.`);
            }else{
                sendLocalMessage(`Соседние объекты с ${homePos.name}:\n> Ближайшие выходы отсутствуют.\nБлижайшие комнаты отсутствуют.`)
                sendLog(msgDate,`РП`,`Осмотрелся на улице.`,`Успешно`,`Вывод: Соседние объекты с ${homePos.name}:\n> ${homePos.radius.join(';\n> ')}.\nБлижайшие комнаты отсутствуют.`);
            }
        }else{
            sendNullMessage()
        }
    }
    if (interaction.data.name == "идти") {
        var arg = "";
        let msgDate = {author: user.user, channel: channel, content: arg, member: user};
        if (interaction.data.options == undefined) {
        } else {
            arg = interaction.data.options[0].value.split(' ')[0]
        }
        

        if(rpchannel){
            let argsObj = guild.channels.cache.get(arg.slice(2).slice(0,-1))
            let channelFA = argsObj
            //принимаю аргументы
            let homePos = Config.objects.find(st => `«${st.name.toLowerCase()}»` == channel.parent.name.toLowerCase().slice(3) && st.id == channel.topic.split('-')[0]);
            console.log(homePos)
            //ищим среди улиц такую улицу, которая будет ровна категории нашего канал.
            if(argsObj != undefined) argsObj = argsObj.name.slice(1).slice(0,-1).toLowerCase().split('-').join(' ');
            if(argsObj == undefined){sendLog(msgDate,`РП`,`Попытался пойти.`,`Ошибка`,`Вывод: Используйте # для быстрого доступа из категории \`❌ Fast Access.\``); sendLocalMessage("Используйте # для быстрого доступа из категории \`❌ Fast Access.\`"); return};
            if(homePos.name == argsObj){sendLocalMessage(`Вы уже находитесь на этом объекте.`); return}
            //проверяю не канал ли аргумент, если нет, то просто беру написанное.
            let walkway = homePos.radius.find(obj => obj.toLowerCase() == argsObj.toLowerCase());
            //ищу среди радиуса домашнего объекта тот объект, который был указан в аргументе.

            if (walkway != null){
                let cats = guild.channels.cache.filter(cat => cat.type == 'category' && cat.name.toLowerCase().slice(3) == `«${walkway}»`.toLowerCase());
                //ищем каналы чье имя будет равно имени объекта пути
                
                if(cats.length != 0) for(let [id, cat] of cats){
                    let catId = Config.objects.find(obj => obj.cId == cat.id).id
                    if (catId == channelFA.topic.split('-')[0] && (Config.globalObjects.find(obj => obj.name.toLowerCase() == walkway.toLowerCase()) || Config.globalObjects.find(obj => obj.children.find(child => child.toLowerCase() == walkway.toLowerCase()) != undefined))){
                    //проверяем канал на тип категории
                        if (haveRole(user,'835630198199681026')){ sendLocalMessage(`> Вы находитесь в админ-моде.`); return};
                        sendNullMessage()
                        setTimeout(() => {cat.updateOverwrite(user, { 'VIEW_CHANNEL': true })}, timeOfDelete);
                        //даем право читать сообщения в категории.
                        setTimeout(() => channel.parent.permissionOverwrites.get(user.id).delete(), timeOfDelete*3);
                        //удаляем право читать сообщения в прошлой категории
                        sendLog(msgDate,`РП`,`Пошел.`,`Успешно`,`Перешел с ${homePos.name} на ${walkway}.`);
                    }else if (catId == channelFA.topic.split('-')[0] && catId == homePos.id){
                    //проверяем канал на тип категории
                        if (haveRole(user,'835630198199681026')){ sendLocalMessage(`> Вы находитесь в админ-моде.`); return};
                        sendNullMessage()
                        setTimeout(() => {cat.updateOverwrite(user, { 'VIEW_CHANNEL': true })}, timeOfDelete);
                        //даем право читать сообщения в категории.
                        setTimeout(() => channel.parent.permissionOverwrites.get(user.id).delete(), timeOfDelete*3);
                        //удаляем право читать сообщения в прошлой категории
                        sendLog(msgDate,`РП`,`Пошел.`,`Успешно`,`Перешел с ${homePos.name} на ${walkway}.`);
                    }else if (catId == channelFA.topic.split('-')[0]){
                        sendLocalMessage(`${argsObj} не является соседним объектом с ${homePos.name}.`)
                        sendLog(msgDate,`РП`,`Попытался пойти.`,`Ошибка`,`Вывод: ${argsObj} не является соседней улицей с ${homePos.name}.`);
                    }
                }else{sendNullMessage()}
            }else if (walkway == null && Config.objects.find(st => st.name.toLowerCase() == argsObj.toLowerCase()) != null){
                sendLocalMessage(`${argsObj} не является соседним объектом с ${homePos.name}.`)
                sendLog(msgDate,`РП`,`Попытался пойти.`,`Ошибка`,`Вывод: ${argsObj} не является соседней улицей с ${homePos.name}.`);
            }else{
                sendLocalMessage(`Вероятнее всего объекта ${arg} нет, либо вы ввели его неправильно.`)
                sendLog(msgDate,`РП`,`Попытался пойти.`,`Ошибка`,`Вывод: Вероятнее всего улицы ${arg} нет, либо вы ввели ее неправильно.`);
            };
        }else{
            sendNullMessage()
        }
    }
    if (interaction.data.name == "баланс") {
        var arg = "баланс";
        let msgDate = {author: user.user, channel: channel, content: arg, member: user};
        if (interaction.data.options == undefined) {
        }else{
            interaction.data.options.forEach((c) => {
                if (c.name == "осмотр") {
                    arg = c.value;
                }
            });
        }
    
        if(rpchannel){
            let moneyT = new Intl.NumberFormat("ru", {
                style: "currency",
                currency: "USD",
                minimumSignificantDigits: 1
            })
            GetStats().then(stats => {
                if (stats.length == 0){return};
                sendLocalMessage(`Текущий баланс: ${moneyT.format(parseInt(stats.find(stat => stat.user == `<@!${user.id}>`).money))} 💰`)
                sendLog(msgDate,'РП','Узнал свой баланс.','Успешно',`Вывод: Текущий баланс: ${moneyT.format(parseInt(stats.find(stat => stat.user == `<@!${user.id}>`).money))} 💰`);
            });
        }else{
            sendNullMessage()
        }
    }
    if (interaction.data.name == "заплатить") {
        var userDate = '';
        var money = '';
        let msgDate = {author: user.user, channel: channel, content: arg, member: user};
        if (interaction.data.options == undefined) {
        }else{
            interaction.data.options.forEach((c) => {
                if (c.name == "игрок") {
                    userDate = c.value;
                    console.log(userDate)
                }
                if (c.name == "сумма") {
                    money = c.value;
                }
            });
        }
    
        if(rpchannel){
            pay(msgDate, userDate, money, sendLocalMessage);
        }else{
            sendNullMessage()
        }
    }
    if (interaction.data.name == "реклама") {
        var arg = "";
        let msgDate = {author: user.user, channel: channel, content: arg, member: user};
        if (interaction.data.options == undefined) {
        }else{
            interaction.data.options.forEach((c) => {
                if (c.name == "текст") {
                    arg = c.value;
                }
            });
        }
    
        if(rpchannel){
            let moneyT = new Intl.NumberFormat("ru", {
                style: "currency",
                currency: "USD",
                minimumSignificantDigits: 1
            });
            
            minusMoney(msgDate.member, 100).then(succ =>{
                if(succ == true){
                    guild.channels.cache.get(Config.channelsID.adverts).send(`> Реклама от ${msgDate.member.nickname} 📢\n${arg}`)
                    sendLocalMessage(`> Вы приобрели рекламу за ${moneyT.format(100)} 📢`);
                    sendLog(msgDate,'РП','Приобрел рекламу.','Успешно',`Вывод: > Реклама от ${msgDate.member.nickname} 📢\n${arg}\n> Вы приобрели рекламу за ${moneyT.format(100)} 📢`)
                }else if(succ == false){
                    sendLocalMessage(`> Вам не хватило денег на рекламу 📢`);
                    sendLog(msgDate,'РП','Попытался приобрести рекламу.','Ошибка',`Вывод: > Вам не хватило денег на рекламу 📢`)
                }
            });
        }else{
            sendNullMessage()
        }
    }
    if (interaction.data.name == "оповещение") {
        var arg = "";
        let msgDate = {author: user.user, channel: channel, content: arg, member: user};
        if (interaction.data.options == undefined) {
        }else{
            interaction.data.options.forEach((c) => {
                if (c.name == "текст") {
                    arg = c.value;
                }
            });
        }
    
        if(rpchannel && haveRole(msgDate.member, `852668893821665320`)){
            sendLocalMessage(`> Вы оповестили от мэрии города 🎙️\n${arg}`)
            guild.channels.cache.get(Config.channelsID.adverts).send(`> Оповещение от мэрии города 🎙️\n${arg}`)
            sendLog(msgDate,'РП','Оповестил город.','Успешно',`Вывод: > Оповещение от мэрии города 🎙️\n${arg}`)
        }else{
            sendNullMessage()
        }
    }
    if (interaction.data.name == "форма") {
        var arg = "";
        let msgDate = {author: user.user, channel: channel, content: arg, member: user};
        if (interaction.data.options == undefined) {
        }else{
            interaction.data.options.forEach((c) => {
                if (c.name == "") {
                    arg = c.value;
                }
            });
        }
    
        if(rpchannel){
            let comps = []
            function giveForm(comps){
                if(comps.length == 0){
                    sendLocalMessage(`> **Вы отсутствуете в базе данных организации** 🗂️ Обратитесь к управляющему.`);
                    sendLog(msgDate,'РП','Попытался взять форму.','Ошибка',`Вывод: > **Вы отсутствуете в базе данных организации** 🗂️ Обратитесь к управляющему.`)
                    return
                }
                for(let dep in Config.departments){
                    if(channel.id == Config.departments[dep][0] && !haveRole(msgDate.member, `854315001543786507`) && haveRole(msgDate.member, Config.departments[dep][2])){
                        removeRole(msgDate.member, Config.departments[dep][2]);
                        giveRole(msgDate.member, '854315001543786507');
                        sendLocalMessage(`> **Форма снята** 🗂️`);
                        sendLog(msgDate,'РП','Снял форму.','Успешно',`Вывод: > **Форма снята** 🗂️`)
                        return;
                    }
                }
                
                client.api.interactions(interaction.id, interaction.token).callback.post({
                    data:{
                        type: 4,
                        data: {
                            embeds: [
                                {
                                    fields: [{
                                        name: `Взятие формы`,
                                        value: `Выберите желаемую профессию.`
                                    }],
                                }
                            ],
                            components: [
                                {
                                    type: 1,
                                    components: comps
                                }
                            ],
                            flags: 64
                        }
                    }
                })
            };

            async function forDep(){
                for(let dept in Config.departments){
                    if(channel.id == Config.departments[dept][0]){
                        let channel = guild.channels.cache.get(BDchnl);
                        let oMsg = await channel.messages.fetch(Config.departments[dept][1])
                        let nMsg = oMsg.content.split('\n');
                        nMsg.splice(0,1);
        
                        if(nMsg.find(member => member.split('-')[0] == msgDate.member.id) != null){
                            comps.push({
                                type: 2,
                                label: Config.departments[dept][3],
                                style: Config.departments[dept][4],
                                custom_id: dept
                            })
                        }
                    };
                }
            }
            forDep().then(() => {
                console.log(comps)
                giveForm(comps);
            })
            
        }else{
            sendNullMessage()
        }
    }
    if (interaction.data.name == "911") {
        var code = "";
        var text = "";
        let msgDate = {author: user.user, channel: channel, content: arg, member: user};
        if (interaction.data.options == undefined) {
        }else{
            console.log(interaction.data.options[1].value)
            code = interaction.data.options[0].value
            text = interaction.data.options[1].value
        }
    
        if(rpchannel){
            let object = channel.parent.name.slice(4).slice(0,-1);
            let room = channel.name;
            let adres = `${Config.globalObjects.find(obj => obj.id == channel.topic.split('-')[0]).name}, ${object.slice(0,1).toUpperCase()+object.slice(1)}, ${room.slice(0,1).toUpperCase()+room.slice(1)}`
            if(code == '1'){
                let staff = guild.members.cache.filter(member => haveRole(member, Config.departments.fire[2]));
                if(staff.size == 0){
                    sendLocalMessage(`**На данный момент пожарные на службе отсутствуют** 🔥`);
                    sendLog(msgDate,'РП','Попытался вызвать пожарную службу.','Ошибка',`Вывод: **На данный момент пожарные на службе отсутствуют** 🔥`)
                }else{
                    sendLocalMessage(`**Вы вызывали пожарную службу** 🔥\n> ${text}`);
                    sendLog(msgDate,'РП','Вызвал пожарную службу.','Успешно',`Вывод: **Вы вызывали пожарную службу** 🔥\n> ${text}`)
                    guild.channels.cache.get(`860559004278325268`).send(`<@&${Config.departments.fire[2]}>, ${msgDate.member.nickname} вызвал пожарную службу:`, {embed: {
                            thumbnail: {
                                url: `https://cdn.discordapp.com/emojis/822763827975815198.png?v=1`
                            },
                            fields: [{
                                name: `Текст вызова:`,
                                value: text
                            },
                            {
                                name: `Местоположение:`,
                                value: adres
                            }],
                        }
                    });
                }
            }else if(code == '2'){
                let staff = guild.members.cache.filter(member => haveRole(member, Config.departments.police[2]));
                if(staff.size == 0){
                    sendLocalMessage(`**На данный момент полицейские на службе отсутствуют** 🚔`);
                    sendLog(msgDate,'РП','Попытался вызвать полицию.','Ошибка',`Вывод: **На данный момент полицейские на службе отсутствуют** 🚔`)
                }else{
                    sendLocalMessage(`**Вы вызывали полицию** 🚔\n> ${text}`);
                    sendLog(msgDate,'РП','Вызвал полицию.','Успешно',`Вывод: **Вы вызывали полицию** 🚔\n> ${text}`)
                    guild.channels.cache.get(`860558870962110475`).send(`<@&${Config.departments.police[2]}>, ${msgDate.member.nickname} вызвал полицию:`, {embed: {
                            thumbnail: {
                                url: `https://cdn.discordapp.com/emojis/822763866584121344.png?v=1`
                            },
                            fields: [{
                                name: `Текст вызова:`,
                                value: text
                            },
                            {
                                name: `Местоположение:`,
                                value: adres
                            }],
                        }
                    });
                }
            }else if(code == '3'){
                let staff = guild.members.cache.filter(member => haveRole(member, Config.departments.med[2]));
                if(staff.size == 0){
                    sendLocalMessage(`**На данный момент медики на службе отсутствуют** ⚕️`);
                    sendLog(msgDate,'РП','Попытался вызвать медицинскую службу.','Ошибка',`Вывод: **На данный момент медики на службе отсутствуют** ⚕️`)
                }else{
                    sendLocalMessage(`**Вы вызывали медицинскую службу** ⚕️\n> ${text}`)
                    sendLog(msgDate,'РП','Вызвал медицинскую службу.','Успешно',`Вывод: **Вы вызывали медицинскую службу** ⚕️\n> ${text}`)
                    guild.channels.cache.get(`860558917762940997`).send(`<@&${Config.departments.med[2]}>, ${msgDate.member.nickname} вызвал медицинскую службу:`, {embed: {
                            thumbnail: {
                                url: `https://cdn.discordapp.com/emojis/822763786149691462.png?v=1`
                            },
                            fields: [{
                                name: `Текст вызова:`,
                                value: text
                            },
                            {
                                name: `Местоположение:`,
                                value: adres
                            }],
                        }
                    });
                }
            }else{
                sendLocalMessage(`**Для вызова служб по номеру 911 используйте дополнительный код службы** ☎️\n> 1 – пожарная служба.\n> 2 – полиция.\n> 3 – медицинская служба.`)
                sendLog(msgDate,'РП','Вызвал 911 без доп. кода.','Успешно',`Вывод: **Для вызова служб по номеру 911 используйте дополнительный код службы** ☎️`)
            };
        }else{
            sendNullMessage()
        }
    }
    if (interaction.data.name == "admincall") {
        var arg = "";
        let msgDate = {author: user.user, channel: channel, content: arg, member: user};
        if (interaction.data.options == undefined) {
        }else{
            arg = interaction.data.options[0].value
        }
    
        if(rpchannel){
            let staff = guild.members.cache.filter(member => (haveRole(member, '830061387849662515') || haveRole(member, '833226140755689483')) && member.presence.status != 'offline');
            if(staff.size == 0){
                sendLocalMessage(`**На данный момент администраторы в сети отсутствуют. Мы оповестили их о вашей жалобе** 👥`)
                sendLog(msgDate,'РП','Попытался вызвать администратора.','Ошибка',`Вывод: **На данный момент администраторы в сети отсутствуют. Мы оповестили их о вашей жалобе** 👥`)
                guild.channels.cache.get(Config.channelsID.admin_claim).send(`<@&830061387849662515>, **${msgDate.author.tag} написал жалобу, но администраторов нет в сети:**`, {embed: {
                        thumbnail: {
                            url: msgDate.author.displayAvatarURL()
                        },
                        fields: [{
                            name: `Текст жалобы:`,
                            value: `${arg}`
                        },
                        {
                            name: `Местоположение:`,
                            value: `${Config.globalObjects.find(obj => obj.id == channel.topic.split('-')[0]).name}, ${channel.parent.name} -> <#${channel.id}>`
                        }],
                    }
                });
            }else{
                sendLocalMessage(`**Вы вызывали администратора** 👥\n> ${arg}`)
                sendLog(msgDate,'РП','Вызвал администратора.','Успешно',`Вывод: **Вы вызывали администратора** 👥\n> ${arg}`)

                for(let worker of staff){
                    worker[1].send(`**${msgDate.author.tag} написал жалобу:**`, {embed: {
                            thumbnail: {
                                url: msgDate.author.displayAvatarURL()
                            },
                            fields: [{
                                name: `Текст жалобы:`,
                                value: `${arg}`
                            },
                            {
                                name: `Местоположение:`,
                                value: `${Config.globalObjects.find(obj => obj.id == channel.topic.split('-')[0]).name}, ${channel.parent.name} -> <#${channel.id}>`
                            }],
                        }
                    });
                }
            }
        }else{
            sendNullMessage()
        }
    }
    if (interaction.data.name == "admin") {
        var arg = "";
        let msgDate = {author: user.user, channel: channel, content: arg, member: user};
        if (interaction.data.options == undefined) {
        }else{
            interaction.data.options.forEach((c) => {
                if (c.name == "") {
                    arg = c.value;
                }
            });
        }
    
        if(rpchannel && (haveRole(msgDate.member, '830061387849662515') || head || rpCreator)){
            if(haveRole(msgDate.member, '835630198199681026')){
                sendNullMessage()
                setTimeout(() => {removeRole(msgDate.member, '835630198199681026'); channel.parent.updateOverwrite(msgDate.member, {'VIEW_CHANNEL': true})}, timeOfDelete*2);
                sendLog(msgDate,'РП','Вышел из админ-мода.','Успешно',` `)
            }
            if(!haveRole(msgDate.member, '835630198199681026')){
                sendNullMessage()
                setTimeout(() => {giveRole(msgDate.member, '835630198199681026'); channel.parent.permissionOverwrites.get(msgDate.author.id).delete()}, timeOfDelete*2);
                sendLog(msgDate,'РП','Вошел в админ-мод.','Успешно',` `)
            }
        }else{
           sendNullMessage()
        }
    }
    if (interaction.data.name == "шанс") {
        var arg = "";
        let msgDate = {author: user.user, channel: channel, content: arg, member: user};
        if (interaction.data.options == undefined) {
        }else{
            interaction.data.options.forEach((c) => {
                if (c.name == "") {
                    arg = c.value;
                }
            });
        }
    
        if(rpchannel){
            let output = roll()
            sendLog(msgDate,'РП','Использовал шанс.','Успешно',`Вывод: Шанс: ${output} из 100`)
            sendGlobalMessage(`Шанс: ${output} из 100`)
        }else{
            sendNullMessage()
        }
    }
    if (interaction.data.name == "время") {
        let msgDate = {author: user.user, channel: channel, content: arg, member: user};
        if(rpchannel){
            var today = new Date();
            sendLocalMessage(`Текущее время 🕐\n> ${today.getUTCHours() + 3}:${today.getUTCMinutes()}:${today.getUTCSeconds()}`)
            sendLog(msgDate, 'РП', 'Узнал время.', 'Успешно', `Вывод: Текущее время 🕐\n> ${today.getUTCHours() + 3}:${today.getUTCMinutes()}:${today.getUTCSeconds()}`)
        }else{
            sendNullMessage()
        }
    }

    if (interaction.data.name == "tp") {
        let msgDate = {author: user.user, channel: channel, content: arg, member: user};
        let locate = interaction.data.options[0].value
        let userTp
        if(interaction.data.options[1] != undefined){
            userTp = interaction.data.options[1].value
            console.log(userTp)
        }else{
            userTp = user.id
        }

        if(rpchannel && (haveRole(msgDate.member, '830061387849662515') || head || rpCreator)){
            if(guild.channels.cache.get(locate.slice(2,-1)) != undefined){
                let channelFA = guild.channels.cache.get(locate.slice(2,-1))
                let position = channelFA.name.slice(1, -1).toLowerCase().split('-').join(' ');

                console.log(position)
                let cats = guild.channels.cache.filter(cat => cat.type == 'category' && cat.name.toLowerCase().slice(3) == `«${position}»`.toLowerCase());
                console.log(cats)
                //ищем каналы чье имя будет равно имени объекта пути
                
                if(cats.length != 0){ for(let [id, cat] of cats){
                    let catId = Config.objects.find(obj => obj.cId == cat.id).id
                    console.log(catId)
                    if (catId == channelFA.topic.split('-')[0]){
                        for (let [id, channel] of guild.channels.cache){
                            if(channel.permissionOverwrites.get(userTp) != undefined && Config.objects.find(obj => obj.cId == id) != undefined) channel.permissionOverwrites.get(userTp).delete();
                        }
                        guild.channels.cache.get(cat.id).updateOverwrite(userTp ,{'VIEW_CHANNEL': true})

                        sendLocalMessage(`Игрок успешно телепортирован.`)
                    }else if (catId == channelFA.topic.split('-')[0]){
                        sendLocalMessage(`Объект ${argsObj} отсутствует.`)
                    }
                }}else{sendNullMessage()}
            }else{sendNullMessage()}
        }else{
            sendNullMessage()
        }
    }
    /* if (interaction.data.name == "me") {
        let msgDate = {author: user.user, channel: channel, content: arg, member: user};
        if (interaction.data.options == undefined) {
        }else{
            var arg = interaction.data.options[0].value
            arg = `${arg.slice(0,1).toUpperCase()}${arg.slice(1)}`
            var ping
            var text = `*${arg}*`
            if (interaction.data.options[1] != undefined){
                var userG = interaction.data.options[1].value
                ping = `<@!${userG}>`
            }
            let color = `#ECCB12`

            if(rpchannel){
                sendEditMessage(text, color, undefined, ping)
            }else{
                sendNullMessage()
            }
        }
    }
    if (interaction.data.name == "do") {
        let msgDate = {author: user.user, channel: channel, content: arg, member: user};
        if (interaction.data.options == undefined) {
        }else{
            var arg = interaction.data.options[0].value
            arg = `${arg.slice(0,1).toUpperCase()}${arg.slice(1)}`
            var ping
            var text = `> ${arg}`
            var color = `#5865F2`
            if (interaction.data.options[1] != undefined){
                var userG = interaction.data.options[1].value
                ping = `<@!${userG}>`
            }

            if(rpchannel){
                sendEditMessage(text, color, undefined, ping)
            }else{
                sendNullMessage()
            }
        }
    }
    if (interaction.data.name == "todo") {
        let msgDate = {author: user.user, channel: channel, content: arg, member: user};
        if (interaction.data.options == undefined) {
        }else{
            var talk = interaction.data.options[0].value
            var arg = interaction.data.options[1].value
            var ping
            arg = `${arg.slice(0,1).toLowerCase()}${arg.slice(1)}`
            var text = ` - *Сказав, <@!${msgDate.member.id}> ${arg}*`
            var color = `#57D9BF`
            if(talk.slice(-1) == '!'){ text = ` - *Крикнув, ${msgDate.member.nickname.split(' ')[0]} ${arg}*`; color = `#C9243F`}
            if(talk.slice(-1) == '?'){ text = ` - *Спросив, ${msgDate.member.nickname.split(' ')[0]} ${arg}*`; color = `#24C937`}

            if (interaction.data.options[2] != undefined){
                var userG = interaction.data.options[2].value
                ping = `<@!${userG}>`
            }

            if(rpchannel){
                sendEditMessage(text, color, talk, ping)
            }else{
                sendNullMessage()
            }
        }
    }
    if (interaction.data.name == "gdo") {
        let msgDate = {author: user.user, channel: channel, content: arg, member: user};
        if (interaction.data.options == undefined) {
        }else{
            var arg = interaction.data.options[0].value
            arg = `${arg.slice(0,1).toUpperCase()}${arg.slice(1)}`
            var text = `> **${arg}**`
            let color = `#3E49C0`

            if(rpchannel){
                sendEditMessage(text, color)
            }else{
                sendNullMessage()
            }
        }
    }
    if (interaction.data.name == "local") {
        let msgDate = {author: user.user, channel: channel, content: arg, member: user};
        if (interaction.data.options == undefined) {
        }else{
            var arg = interaction.data.options[0].value
            var text = `(( ${arg} ))`
            let color = `#818181`

            if(rpchannel){
                sendEditMessage(text, color)
            }else{
                sendNullMessage()
            }
        }
    } */
    if (interaction.data.name == "монета") {
        let msgDate = {author: user.user, channel: channel, content: arg, member: user};
        if(rpchannel){
            let output = coinFlip()
            if(interaction.data.options == undefined){
                sendLog(msgDate,'РП','Использовал монетку.','Успешно',`Вывод: Выпал(-а): ${output}`)
                sendLocalMessage(`Выпал(-а): ${output}`)
            }else if(interaction.data.options[0].value == 'true'){
                sendLog(msgDate,'РП','Использовал монетку.','Успешно',`Вывод: Выпал(-а): ${output}`)
                sendGlobalMessage(`Выпал(-а): ${output}`)
            }
        }else{
            sendNullMessage()
        }
    }

    if (interaction.data.name == "карты") {
        let msgDate = {author: user.user, channel: channel, content: arg, member: user};
        if(rpchannel){
            console.log(interaction.data.options)
            let output = card()
            if(interaction.data.options == undefined){
                sendLog(msgDate,'РП','Вытянул карту.','Успешно',`Вывод: Достал карту: ${output}`)
                sendLocalMessage(`Достал: ${output}`)
            }else if(interaction.data.options[0].value == 'true'){
                sendLog(msgDate,'РП','Вытянул карту.','Успешно',`Вывод: Достал карту: ${output}`)
                sendGlobalMessage(`Достал: ${output}`)
            }
        }else{
            sendNullMessage()
        }
    }

    if (interaction.data.name == "кубик") {
        let msgDate = {author: user.user, channel: channel, content: arg, member: user};
        if(rpchannel){
            let output = cube()
            if(interaction.data.options == undefined){
                sendLog(msgDate,'РП','Бросил кубик.','Успешно',`Вывод: Выбрасил число: ${output}`)
                sendLocalMessage(`Выбросил: ${output}`)
            }else if(interaction.data.options[0].value == 'true'){
                sendLog(msgDate,'РП','Бросил кубик.','Успешно',`Вывод: Выбрасил число: ${output}`)
                sendGlobalMessage(`Выбросил: ${output}`)
            }
        }else{
            sendNullMessage()
        }
    }

    if (interaction.data.name == "nsfw") {
        let msgDate = {author: user.user, channel: channel, content: arg, member: user};
        if(haveRole(user, `871027221521899621`) && interaction['guild_id'] == undefined){
            client.api.interactions(interaction.id, interaction.token).callback.post({
                data: {
                    type: 4,
                    data:{
                        embeds: [{
                            fields: [{
                                name: `Вы действительно желаете отказаться от доступа к NSFW каналам?`,
                                value: 'Выберите ответ ниже, нажав на одну из кнопок.'
                            }],
                            thumbnail: {
                                url: 'https://i.imgur.com/utuBexR.png'
                            },
                        }],
                        components: [
                            {
                                type: 1,
                                components: [
                                    {
                                        type: 2,
                                        label: "✅ Да",
                                        style: 3,
                                        custom_id: "yesNSFW"
                                    },
                                    {
                                        type: 2,
                                        label: "❌ Нет",
                                        style: 4,
                                        custom_id: "noNSFW"
                                    },
                                ]
                            }
                        ],
                        //flags: 64
                    }
                }
            })
        }else if(!haveRole(user, `871027221521899621`) && interaction['guild_id'] == undefined){
            client.api.interactions(interaction.id, interaction.token).callback.post({
                data: {
                    type: 4,
                    data:{
                        embeds: [{
                            fields: [{
                                name: `Вы действительно желаете получить доступ к NSFW каналам?`,
                                value: 'Выберите ответ ниже, нажав на одну из кнопок.'
                            }],
                            thumbnail: {
                                url: 'https://i.imgur.com/cjSSwtu.png'
                            },
                        }],
                        components: [
                            {
                                type: 1,
                                components: [
                                    {
                                        type: 2,
                                        label: "✅ Да",
                                        style: 3,
                                        custom_id: "yesNSFW"
                                    },
                                    {
                                        type: 2,
                                        label: "❌ Нет",
                                        style: 4,
                                        custom_id: "noNSFW"
                                    },
                                ]
                            }
                        ],
                        //flags: 64
                    }
                }
            })
        }else{
            sendLocalMessage('Использование данной команды доступно лишь в личных сообщениях с <@!822500483826450454>')
        }
    }

    if(interaction.data.name == 'регистрация'){
        if(interaction['guild_id'] == undefined){
            Stats(msgDate);
        }
    }
});
    


function checkIntegrations() {

    /* 
    БЛОК СПИСКА КОМАНД
    */

    /* let command = {
        name: "карты", 
        description: "Вытащить карту из колоды",
        options: [
            {
                name: "открытость",
                description: "Достать ли карту в открытую?",
                type: "3",
                choices: [
                    {
                        name: "Да",
                        value: "true"
                    }
                ]
            }
        ]
    }
    let command2 = {
        name: "монета", 
        description: "Подбросить монету",
        options: [
            {
                name: "открытость",
                description: "Бросить ли монету в открытую?",
                type: "3",
                choices: [
                    {
                        name: "Да",
                        value: "true"
                    }
                ]
            }
        ]
    }
    let command3 = {
        name: "кубик", 
        description: "Бросить игральный кубик",
        options: [
            {
                name: "открытость",
                description: "Бросить ли кубик в открытую?",
                type: "3",
                choices: [
                    {
                        name: "Да",
                        value: "true"
                    }
                ]
            }
        ]
    }

    client.interaction.createApplicationCommand(command, config.guild_id, "859131311692316682").then(console.log)
    client.interaction.createApplicationCommand(command2, config.guild_id, "864551702278570014").then(console.log)
    client.interaction.createApplicationCommand(command3, config.guild_id, "864610902053355529").then(console.log) */

    // удаление старых команд
    /* client.interaction
        .getApplicationCommands(config.guild_id)
        .then(d => {
            d.forEach((r) => {
                client.interaction
                    .deleteApplicationCommand(r.id, config.guild_id)
                    .then()
                    .catch(console.log);
            })
        })
        .catch(console.log); */

    // регистрация новых
    /* setTimeout(() =>{client.interaction.createApplicationCommand({
            name: "осмотр", 
            description: "Осмотреться внутри объекта",
            options: []
        }, config.guild_id)
        .then()
        .catch(console.error);
    }, 200);
    setTimeout(() =>{client.interaction.createApplicationCommand({
            name: "идти", 
            description: "Идти с одного объекта в другой",
            options: [
                {
                    name: "путь",
                    description: "Путь, куда вы хотите пойти. Можно использовать упоминание канала.",
                    type: "3",
                    required: true
                }
            ]
        }, config.guild_id)
        .then(console.log)
        .catch(console.error);
    }, 200);
    setTimeout(() =>{client.interaction.createApplicationCommand({
            name: "баланс", 
            description: "Проверить свой баланс",
            options: []
        }, config.guild_id)
        .then()
        .catch(console.error);
    }, 200);
    setTimeout(() =>{client.interaction.createApplicationCommand({
            name: "заплатить", 
            description: "Дать кому-то деньги",
            options: [
                {
                    name: "игрок",
                    description: "Игрок, которому вы собираетесь передать деньги",
                    type: "6",
                    required: true
                },
                {
                    name: "сумма",
                    description: "Сумма денег",
                    type: "4",
                    required: true
                },
            ]
        }, config.guild_id)
        .then(console.log)
        .catch(console.error);
    }, 200);
    setTimeout(() =>{client.interaction.createApplicationCommand({
            name: "реклама", 
            description: "Опубликовать рекламу за 100$",
            options: [
                {
                    name: "текст",
                    description: "Текст рекламы",
                    type: "3",
                    required: true
                },
            ]
        }, config.guild_id)
        .then(console.log)
        .catch(console.error);
    }, 120000);
    setTimeout(() =>{client.interaction.createApplicationCommand({
            name: "оповещение", 
            description: "Оповестить город",
            options: [
                {
                    name: "текст",
                    description: "Текст оповещения",
                    type: "3",
                    required: true
                },
            ]
        }, config.guild_id)
        .then(console.log)
        .catch(console.error);
    }, 10000);
    setTimeout(() =>{client.interaction.createApplicationCommand({
            name: "форма", 
            description: "Взять форму",
            options: []
        }, config.guild_id)
        .then(console.log)
        .catch(console.error);
    }, 80000);
    setTimeout(() =>{client.interaction.createApplicationCommand({
            name: "911", 
            description: "Вызвать экстренные службы",
            options: [
                {
                    name: "код",
                    description: "Код службы",
                    type: "3"
                },
                {
                    name: "текст",
                    description: "Текст сообщения для экстренных служб",
                    type: "3"
                },
            ]
        }, config.guild_id)
        .then(console.log)
        .catch(console.error);
    }, 60000);
    setTimeout(() =>{client.interaction.createApplicationCommand({
            name: "admincall", 
            description: "Вызвать администратора",
            options: [
                {
                    name: "текст",
                    description: "Текст жалобы",
                    type: "3",
                    required: true
                },
            ]
        }, config.guild_id)
        .then(console.log)
        .catch(console.error);
    }, 40000);
    setTimeout(() =>{client.interaction.createApplicationCommand({
            name: "admin", 
            description: "Заступить на пост администратора",
            options: []
        }, config.guild_id)
        .then(console.log)
        .catch(console.error);
    }, 22000); 
    setTimeout(() =>{client.interaction.createApplicationCommand({
            name: "шанс", 
            description: "Шанс (случайное число от 0 до 100)",
            options: []
        }, config.guild_id)
        .then()
        .catch(console.error);
    }, 200);*/
    /* setTimeout(() =>{client.interaction.createApplicationCommand({
            name: "карты", 
            description: "Вытащить карту из колоды",
            options: []
        }, config.guild_id)
        .then()
        .catch(console.error);
    }, 200);
    setTimeout(() =>{client.interaction.createApplicationCommand({
            name: "время", 
            description: "Узнать текущее время",
            options: []
        }, config.guild_id)
        .then()
        .catch(console.error);
    }, 200);
    client.interaction.createApplicationCommand({
        name: "tp", 
        description: "Телепортировать игрока в локацию",
        options: [
            {
                name: "локация",
                description: "Локация, куда нужно телепортироваться",
                type: "3",
                required: true
            },
            {
                name: "человек",
                description: "Человек, которому это направлено. По стандарту это вы",
                type: "6",
            },
        ]
    }, config.guild_id)
    client.interaction.createApplicationCommand({
        name: "me", 
        description: "Действие от первого лица.",
        options: [
            {
                name: "действие",
                description: "Действие",
                type: "3",
                required: true
            },
            {
                name: "человек",
                description: "Человек, которому это направлено",
                type: "6"
            },
        ]
    }, config.guild_id)
    .then()
    .catch(console.error);
    setTimeout(() =>{client.interaction.createApplicationCommand({
            name: "do", 
            description: "Действие от третьего лица, описание ситуации вокруг.",
            options: [
                {
                    name: "действие",
                    description: "Действие",
                    type: "3",
                    required: true
                },
                {
                    name: "человек",
                    description: "Человек, которому это направлено",
                    type: "6"
                },
            ]
        }, config.guild_id)
        .then()
        .catch(console.error);
    }, 200);
    setTimeout(() =>{client.interaction.createApplicationCommand({
            name: "todo", 
            description: "Действие от третьего лица, описание ситуации вокруг, сопровождающиеся фразой.",
            options: [
                {
                    name: "фраза",
                    description: "Фраза",
                    type: "3",
                    required: true
                },
                {
                    name: "действие",
                    description: "Действие",
                    type: "3",
                    required: true
                },
                {
                    name: "человек",
                    description: "Человек, которому это направлено",
                    type: "6"
                },
            ]
        }, config.guild_id)
        .then()
        .catch(console.error);
    }, 200);
    setTimeout(() =>{client.interaction.createApplicationCommand({
            name: "gdo", 
            description: "Глобальное действие от третьего лица, описание ситуации по всему объекту.",
            options: [
                {
                    name: "действие",
                    description: "Действие",
                    type: "3",
                    required: true
                },
            ]
        }, config.guild_id)
        .then()
        .catch(console.error);
    }, 200);
    setTimeout(() =>{client.interaction.createApplicationCommand({
            name: "local", 
            description: "Неролевое сообщение",
            options: [
                {
                    name: "текст",
                    description: "Текст сообщения",
                    type: "3",
                    required: true
                },
            ]
        }, config.guild_id)
        .then()
        .catch(console.error);
    }, 200);
    setTimeout(() =>{client.interaction.createApplicationCommand({
            name: "монета", 
            description: "Подбросить монету",
            options: []
        }, config.guild_id)
            .then()
            .catch(console.error);
    }, 200);
    setTimeout(() =>{client.interaction.createApplicationCommand({
            name: "кубик", 
            description: "Бросить игральный кубик",
            options: []
        }, config.guild_id)
            .then()
            .catch(console.error);
    }, 200);*/
    /* setTimeout(() =>{client.interaction.createApplicationCommand({
        name: "nsfw", 
        description: "Запросить доступ к NSFW контенту внутри сервера",
        options: []
    }, null)
        .then(console.log)
        .catch(console.log);
    }, 200); */

    setTimeout(() =>{client.interaction.createApplicationCommand({
        name: "регистрация", 
        description: "Зарегистрировать своего персонажа",
        options: []
    }, null)
        .then(console.log)
        .catch(console.log);
    }, 200);
}

client.login(Config.discordTocens.main);

/* client.on('error', err => {
    console.log('Ошибка!')
    guild.channels.cache.get(Config.channelsID.serverMsg).send('> Бот обнаружил ошибку!', {embed: {
                color: 16325403,
                fields: [{
                    name: `[${err.name}]:`,
                    value: err.message
                }],
                
                timestamp: new Date()
            }
        }
    )
}); */

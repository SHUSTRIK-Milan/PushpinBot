const Discord = require('discord.js');
const client = new Discord.Client();

const Config = require('./config');
const prefix = '!';
const BDpref = '^';
var BDchnl = `833225101218152459`;
var dopBDmsg = `833260237481705502`;

function member(nick, name, money, status, car, user, steamID) {
    this.nick = nick;
    this.name = name;
    this.money = money;
    this.status = status;
    this.car = car;
    this.user = user;
    this.steamID = steamID;
};

module.exports.GetStats = async function () {
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

module.exports.SetStats = async function (nick, money, status, car, user, steamID) {
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
            nnMsg.push(`${BDpref}${nick}${BDpref}${money}${BDpref}${status}${BDpref}${car}${BDpref}${user}${BDpref}${steamID}`);
            console.log(nnMsg.join('\n'));
            msg.edit(`> **БАЗА ДАННЫХ ПОЛЬЗОВАТЕЛЕЙ ${fMsg[1]}**\n`+nnMsg.join('\n'));
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

module.exports.sendLog = function (message,cat,act,status,add){
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

module.exports.comand = function (message,countS){

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
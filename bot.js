//
// ПЕРЕМЕННЫЕ
//


// Интеграции
const { Client, Intents } = require('discord.js');
const client = new Client({ intents: [
"GUILDS",
"GUILD_MEMBERS",
"GUILD_BANS",
"GUILD_EMOJIS_AND_STICKERS",
"GUILD_INTEGRATIONS",
"GUILD_WEBHOOKS",
"GUILD_INVITES",
"GUILD_VOICE_STATES",
"GUILD_PRESENCES",
"GUILD_MESSAGES",
"GUILD_MESSAGE_REACTIONS",
"GUILD_MESSAGE_TYPING",
"DIRECT_MESSAGES",
"DIRECT_MESSAGE_REACTIONS",
"DIRECT_MESSAGE_TYPING"
]});

const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');

const Config = require('./config')

// Системные переменные
const prefix = '!'
const BDpref = '^'
var waitingOutputRoflBot = false
const timeOfDelete = 350

// Глобальные переменные
var guild
var guildAges
var guildBD
var rpGuilds = [Config.guilds.ages]

// Гитхаб
var GitHub = require('github-api')
var gitA = new GitHub({
    token: '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'
});
var fork = gitA.getRepo('SHUSTRIK-Milan','PushpinBot')

//
// ГЛАВНЫЕ ФУНКЦИИ
//

function cmdParametrs(content,countS){
    var comand = {
        com: '0', arg: '0', sarg: '0', carg: '0', oarg: '0', barg: '0'
    }

    if(countS == undefined) countS = 0
    if(content.slice(0,1) != prefix) return comand

    let regexp = /"(\\.|[^"\\])*"/g;
    
    let com = content.split(" ")[0].slice(prefix.length)
    let arg = content.slice(com.length+prefix.length+1)
    let sarg = arg.split(" ")
    let carg = sarg.slice(countS).join(' ')
    let oarg = arg.match(/"(\\.|[^"\\])*"/g)
    let barg = arg.match(/{"}(\\.|[^{}\\])*{"}/g)
    if(oarg != undefined){for(let i = 0; i < oarg.length; i++){
        oarg[i] = oarg[i].replace(/"/g, "")
    }}else{oarg='null'}
    if(barg != undefined){for(let i = 0; i < barg.length; i++){
        barg[i] = barg[i].replace(/{"}/g, "")
    }}else{barg='null'}
    comand = {
        com: com, // команда, первый слитнонаписанный текст
        arg: arg, // все, что идет после команды
        sarg: sarg, // разбитый аргумент на пробелы
        carg: carg, // отрезанние от разбитого аргумента первых аргументов
        oarg: oarg, // аргументы в кавычках
        barg: barg, // аргументы в кавычках
    };

    return comand
};

function random(min, max) {
    let rand = min + Math.random() * (max + 1 - min);
    return Math.floor(rand);
}

function haveRole(member, role){
    if(member == undefined){return false}
    if(member.roles.cache.get(role) != null){
        return true
    }else if(member.roles.cache.find(roleF => roleF.name.toLowerCase() == role.toLowerCase()) != null){
        return true
    }
    return false
};

function giveRole(member, roleId){
    member.roles.add(roleId, `Добавил роль под ID: ${roleId}.`).catch(console.error);
};

function removeRole(member, roleId){
    member.roles.remove(roleId, `Удалил роль под ID: ${roleId}.`).catch(console.error);
};

//
// CREATE ФУНКЦИИ
//

async function sendLog(member,channel,cat,act,status,add){
    if (cat == 'admin'){var color = 4105807; var path = Config.channelsID.admin}
    if (cat == 'other'){var color = 11645371; var path = Config.channelsID.other}
    if (cat == 'rp'){var color = 11382073; var path = Config.channelsID.rp}
    let nick = member.nickname
    if(nick == null) nick = '<Без имени>'
    let chnlLink = ''
    if(channel != undefined) chnlLink = `\n[<#${channel.id}>]`

    path = guild.channels.cache.get(path)
    let webhook = await path.fetchWebhooks()
    webhook = webhook.first()

    if (status == 0) status = '🟩'
    if (status == 1) status = '🟥'
    
    webhook.send({
        embeds: [{
            color: color,
            author: {
                name: `${member.user.username} – ${nick}`,
                icon_url: member.user.avatarURL()
            },
            description: `${status} **|** **${act}:**\n${add}${chnlLink}`
        }],
    });
};

async function createLore(title,img,desc,message){
    message.channel.send({embeds: [{
            color: 15521158,
            fields: [{
                name: `${title}`,
                value: `${desc}`
            }],
            image:{url:img}
        }]
    });
    return;
};

async function createEx(rule,num,status,add,message){
    if (status == 0){status = '🟩'; var color = 9819812}
    if (status == 1){status = '🟥'; var color = 14508910}

    message.channel.send({embeds: [{
            color: color,
            fields: [{
                name: `\\${status} ${rule} [Пример #${num}]`,
                value: `${add}`
            }]
        }]
    });
    return;
};

async function createCom(embd, message){
    let CChannel = guild.channels.cache.get(Config.channelsID.dev_process)
    let webhook = await CChannel.fetchWebhooks()
    webhook = webhook.find(web => web.id == '906144022588956692')

    for(let a of embd.title.split(':')){
        if(a.slice(-6) == 'closed') var act = 'merge';
        if(a.slice(-7) == 'commits' || a.slice(-6) == 'commit') var act = 'commit';
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
            lastcom = await commits.data[i]
            nCommits.push(`[\`${lastcom.html_url.slice(52).slice(0,7)}\`](${lastcom.html_url}) — ${lastcom.commit.message}`);
        }

        let color = 11645371
        if(countC>0) color = 8506509
        
        webhook.send({
            embeds: [{
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
            }]
        })
    }else if(act == 'merge'){
        let req = await fork.listPullRequests({state:'close'})
        let lastReq = await req.data[0];
        message.delete();
        webhook.send({
            embeds: [{
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
            }]
        })
    }
    return
}

//
// БАЗА ДАННЫХ
//

function memberBD(id, user, data) {
    this.id = id
    this.user = user
    this.data = data
}

async function GStats(allpath){
    try{
    var project = allpath.split('/')[0]
    var path = allpath.split('/')[1]

    var cat = guildBD.channels.cache.find(chl => chl.name.toLowerCase() == project.toLowerCase() && chl.type == "GUILD_CATEGORY")
    var chl = cat.children.find(chl => chl.name.toLowerCase() == path.toLowerCase())
    var msgs = await chl.messages.fetch()
    var users = []

    for (let [id, msg] of msgs){
        let cMsg = eval(msg.content)
        cMsg[0].mid = msg.id
        users = users.concat(cMsg)
    }
    return users.reverse()
    }catch{
        guildBD.channels.cache.get('920291811614916609').send(`Ошибка.\n> Убедитесь, что вы правильно указали **[путь]**`).then(msg => {
            setTimeout(() => {msg.delete()}, 10000)
        })
    }
}

async function AStats(allpath, user, data){
    try{
    var project = allpath.split('/')[0]
    var path = allpath.split('/')[1]
    var structure = Config.BDs[`${project}_${path}`]

    var cat = guildBD.channels.cache.find(chl => chl.name.toLowerCase() == project.toLowerCase() && chl.type == "GUILD_CATEGORY")
    var chl = cat.children.find(chl => chl.name.toLowerCase() == path.toLowerCase())
    var msgs = await chl.messages.fetch()

    var users = await GStats(allpath, path)
    var id
    if (users.length == 0){id = msgs.size}else{
        id = users[users.length-1].id
    }
    
    var returnData = {}
    for (let i = 0; i < structure.length; i++){
        returnData[structure[i]] = data[i]
    }
    var member = new memberBD(`${parseInt(id)+1}`, `<@!${user}>`, returnData)
    member = [member]
    chl.send(JSON.stringify(member, null, 4))
    }catch{
        guildBD.channels.cache.get('920291811614916609').send(`Ошибка.\n> Убедитесь, что вы правильно указали **[путь, пользователя (id), значения]**`).then(msg => {
            setTimeout(() => {msg.delete()}, 10000)
        })
    }
}

async function EStats(allpath, id, par, data){
    try{
    var project = allpath.split('/')[0]
    var path = allpath.split('/')[1]

    var cat = guildBD.channels.cache.find(chl => chl.name.toLowerCase() == project.toLowerCase() && chl.type == "GUILD_CATEGORY")
    var chl = cat.children.find(chl => chl.name.toLowerCase() == path.toLowerCase())
    var BD = await GStats(allpath, path)
    var user = BD.find(user => user.id == id)
    var msg = await chl.messages.fetch(user.mid)

    var dat = eval(`${msg.content}`)
    dat[0].data[par] = data
    
    msg.edit(JSON.stringify(dat, null, 4))
    }catch{
        guildBD.channels.cache.get('920291811614916609').send(`Ошибка.\n> Убедитесь, что вы правильно указали **[путь, id-ячейки, параметр, замену]**`).then(msg => {
            setTimeout(() => {msg.delete()}, 10000)
        })
    }
}

async function DStats(allpath, id){
    try{
    var project = allpath.split('/')[0]
    var path = allpath.split('/')[1]
    
    var cat = guildBD.channels.cache.find(chl => chl.name.toLowerCase() == project.toLowerCase() && chl.type == "GUILD_CATEGORY")
    var chl = cat.children.find(chl => chl.name.toLowerCase() == path.toLowerCase())
    var BD = await GStats(allpath, path)
    var user = BD.find(user => user.id == id)
    var msg = await chl.messages.fetch(user.mid)
    setTimeout(() => msg.delete(), timeOfDelete)
    }catch{
        guildBD.channels.cache.get('920291811614916609').send(`Ошибка.\n> Убедитесь, что вы правильно указали **[путь, id-ячейки]**`).then(msg => {
            setTimeout(() => {msg.delete()}, 10000)
        })
    }
}

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

    let moneyT = new Intl.NumberFormat("ru")

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

//
// ОТВЕТЛЕНИЯ
//

async function roflBot(text, messageG){
    var users = await GStats("pushpin/rofl")
    var dbMsg = users.find(db => db.data.quest.toLowerCase() == text.toLowerCase())
    console.log(dbMsg)

    if(dbMsg != undefined && !waitingOutputRoflBot){
        if(dbMsg.data.imgs == '') messageG.channel.send({content: `${dbMsg.data.reply} (от ${dbMsg.user})`, reply: {messageReference: messageG}})
        if(dbMsg.data.imgs != ''){
            let imgs = []
            for (url of dbMsg.data.imgs.split(';;')){
                imgs.push({attachment: url})
            }
            messageG.channel.send({
                content: `${dbMsg.data.reply} (от <@!${dbMsg.user}>)`, 
                files: imgs,
                reply: {messageReference: messageG}
            })
        }
    }
    if(dbMsg == undefined && !waitingOutputRoflBot){
        let filter = m => m.author.id == messageG.author.id
        waitingOutputRoflBot = true

        messageG.channel.send({content: `Я не знаю что мне сказать на это. \n> Напиши, как мне на это отвечать`, reply: {messageReference: messageG}})
        .then(() => {
            messageG.channel.awaitMessages({filter,
                max: 1,
                time: 10000,
                errors: ['time'],
            })
            .then(message => {
                message = message.map(message => message)[0]
                let imgs = []
                for ([id, img] of message.attachments){
                    imgs.push(img.url)
                }
                if(imgs.length == 0)
                AStats("pushpin/rofl", message.author.id, [messageG.content, message.content, imgs.join(';;')])
                messageG.channel.send({content: `Спасибо, буду знать!`, reply: {messageReference: message}}).then(() => waitingOutputRoflBot = false)
            })
            .catch(() => {
                messageG.channel.send({content: `Я так и не понял как мне на это отвечать 🤔`, reply: {messageReference: messageG}}).then(() => waitingOutputRoflBot = false)
            });
        });
    }
}

//
// ХУКИ
//

client.on('ready', () => {
    console.log(`${client.user.tag} ready!`)

    guild = client.guilds.cache.get(Config.guilds.main)
    guildAges = client.guilds.cache.get(Config.guilds.ages)
    guildBD = client.guilds.cache.get(Config.guilds.BD)

    function checkOnlineUsers(){
        members = guild.members.cache
        for (let [id, guild] of client.guilds.cache){
            members = guild.members.cache.concat(members)
        }

        let offlinemember = members.filter(m => m.presence === null && !m.user.bot).size
        let member = members.filter(m => !m.user.bot).size
        let onlinemember = member - offlinemember

        let endword
        if(onlinemember.toString().slice(-1) == '1'){endword = 'а'}else{endword = 'ов'}

        if (onlinemember > 0){
            client.user.setPresence({
              status: "online",
              activities: [{
                  name: `на ${onlinemember} участник${endword} 👥`,
                  type: "WATCHING",
              }]
            })
        }else if (onlinemember == 0){
            client.user.setPresence({
                status: "idle",
                activities: [{
                    name: `в пустоту... 🌙`,
                    type: "WATCHING",
                }]
            })
        }
    }

    checkOnlineUsers()
    client.on('presenceUpdate', () => {
        checkOnlineUsers()
    });

    // ОПОВЕЩЕНИЕ О СБОРАХ
    /* setInterval(async () => {
        var date = new Date()
        if(date.getUTCDay() == 5 ||
        date.getUTCDay() == 6 ||
        date.getUTCDay() == 0){
            let channel = guild.channels.cache.get(Config.channelsID.announcements)
            let lastMessage = await channel.messages.fetch()

            lastMessageBot = lastMessage.filter(msg => msg.author.bot)
            if(lastMessageBot.size == 0){
                lastMessage = lastMessage.first()
            }else{
                lastMessage = lastMessageBot.first()
            }

            let dateOfMessage = new Date(lastMessage.createdTimestamp)

            if(date.getUTCHours()+3 == 17 && (dateOfMessage.getUTCFullYear() != date.getUTCFullYear() || dateOfMessage.getUTCMonth() != date.getUTCMonth() || dateOfMessage.getUTCDate() != date.getUTCDate())){
                channel.send(`> <@&836269090996879387>, сбор, дамы и господа!\nВсем приятной и интересной игры! 📌`)
            }
        }
    }, 60000) */
});

client.on('guildMemberAdd', (member) => {
    if(member.guild.id == Config.guilds.main){
        giveRole(member, '829423238169755658')
    }
    sendLog(member, undefined, 'other', 'Новый пользователь', 0, `${member.user.tag} присоеденился к сообществу!`)
});

client.on('messageDelete', (message) => {
    if(!messageNew.author.bot){if(rpGuilds.find(guild => guild == message.guild.id) != null){
        sendLog(message.member,message.channel,'rp','Сообщение удалено',0,`Содержимое сообщения: ${message.content}`)
    }else{sendLog(message.member,message.channel,'other','Сообщение удалено',0,`Содержимое сообщения: ${message.content}`)}}
});

client.on('messageUpdate', (messageOld, messageNew) =>{
    if(!messageNew.author.bot){if(rpGuilds.find(guild => guild == messageNew.guild.id) != null){
        sendLog(messageNew.member,messageNew.channel,'rp','Сообщение отредактировано',0,`Старое соообщение:\n> ${messageOld.content}\nНовое сообщение:\n> ${messageNew.content}`)
    }else{sendLog(messageNew.member,messageNew.channel,'other','Сообщение отредактировано',0,`Старое соообщение:\n> ${messageOld.content}\nНовое сообщение:\n> ${messageNew.content}`)}}
})

client.on('messageCreate', message => {
    // ПЕРЕМЕННЫЕ

    var cA = haveRole(message.member, "[A]"),
        cB = haveRole(message.member, "[B]"),
        cC = haveRole(message.member, "[C]")
    let mb = message.author.bot;
    let mg = message.channel.type == "DM";
    let comand = cmdParametrs(message.content)

    // ГЛОБАЛЬНЫЕ КОМАНДЫ

    if(message.content == '⠀' && message.author.bot){
        setTimeout(() => message.delete(), timeOfDelete)
    }
    if(comand.com == `send` && !mb && !mg && cA){		
        message.channel.send(`${comand.arg}`)
        setTimeout(() => message.delete(), timeOfDelete)
    }
    if(comand.com == `clear` && !mb && !mg && (cA || cB)){
        let arg = parseInt(comand.sarg[0])
        
        if (arg > 0 && arg < 100){
            message.channel.bulkDelete(arg, true)
            //sendLog(message,`Админ`,`Удалил сообщения.`,`Успешно`,`Удалено ${arg} сообщений.`)
        }else if (arg >= 100){
            //sendLog(message,`Админ`,`Попытался удалить сообщения.`,`Ошибка`,`Попытка удалить более 100 сообщений.`)
        }else{
            //sendLog(message,`Админ`,`Попытался удалить сообщения.`,`Ошибка`,`Неверный аргумент.`)
        }
    }
    if(comand.com == `edit` && !mg && cA){
        message.channel.guild.channels.cache.find(id => id == `${comand.sarg[0]}`).messages.fetch(`${comand.sarg[1]}`)
        .then(msg =>{
            if(!msg.author.bot) return
            msg.edit(cmdParametrs(message,2).carg)
        })
        setTimeout(() => message.delete(), timeOfDelete)
    }
    if(comand.com == `checkm` && !mb && !mg && cA){
        console.log(comand)
        console.log(message)
        setTimeout(() => message.delete(), timeOfDelete)
    }
    if(comand.com == `cex` && !mb && !mg && cA){
        createEx(comand.oarg[0],comand.oarg[1],comand.oarg[2],comand.oarg[3],message)
        setTimeout(() => message.delete(), timeOfDelete)
    }
    if(comand.com == `clore` && !mb && !mg && cA){
        createLore(comand.oarg[0],comand.oarg[1],comand.oarg[2],message)
        setTimeout(() => message.delete(), timeOfDelete)
    }

    // ГЛАВНЫЙ СЕРВЕР

    if (message.guild.id == Config.guilds.main){
        if(!mb && !mg) sendLog(message.member, message.channel, 'other', 'Отправил сообщение', '0', message.content)

        if(message.channel.id == Config.channelsID.dev_process && message.author.id != '822500483826450454' && !mg && mb){
            createCom(message.embeds[0],message)
        }
        if(message.channel.id == Config.channelsID.bot && !mb && !mg){
            roflBot(message.content, message)
        }

        if(comand.com == `refreshFA` && (haveRole(message.member, `833778527609552918`) || head || rpCreator) && !mb && !mg){
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

        if(comand.com == `refreshIDobj` && (haveRole(message.member, `833778527609552918`) || head || rpCreator) && !mb && !mg){
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

        if(comand.com == `commands` && head && !mb && !mg){
            setTimeout(() => message.delete(), timeOfDelete);
            client.interaction.getApplicationCommands(config.guild_id).then(console.log);
        }
    }else if(message.guild.id == Config.guilds.ages){
        if(!mb && !mg) sendLog(message.member, message.channel, 'rp', 'Отправил сообщение', '0', message.content)
    }else if(message.guild.id == Config.guilds.BD){
        if(!mb && !mg && comand.com == "Add" && cA){
            AStats(comand.oarg[0], comand.oarg[1], comand.barg)
            setTimeout(() => {message.delete()}, 15000)
        }
        if(!mb && !mg && comand.com == "Get" && cA){
            GStats(comand.oarg[0]).then(console.log)
            setTimeout(() => {message.delete()}, 15000)
        }
        if(!mb && !mg && comand.com == "Edit" && cA){
            EStats(comand.oarg[0], comand.oarg[1], comand.oarg[2], comand.barg)
            setTimeout(() => {message.delete()}, 15000)
        }
        if(!mb && !mg && comand.com == "Del" && cA){
            DStats(comand.oarg[0], comand.oarg[1])
            setTimeout(() => {message.delete()}, 15000)
        }
    }else{

    }
});

const config = {
    token: Config.discordTocens.main,
    publicKey : "0e6a87c0f53052a2025917df52069144195fea4b82e32cb43619d65d1c278a97",
    applicationId: "822500483826450454",
    guild_id: "814795850885627964"
};

/* client.interaction = new DiscordInteractions({
    applicationId: config.applicationId,
    authToken: config.token,
    publicKey: config.publicKey,
});

client.on('ready', () => {
	checkIntegrations();
}); */

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
    let msgDate = {author: user.user, channel: channel, content: arg, member: user, channel_id: interaction.channel_id};

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
                    if (catId == channelFA.topic.split('-')[0] && (Config.globalObjects.find(obj => obj.name.toLowerCase() == walkway.toLowerCase() && obj.id == catId) || Config.globalObjects.find(obj => obj.children.find(child => child.toLowerCase() == walkway.toLowerCase() && obj.id == catId) != undefined))){
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
        }else{
            sendLocalMessage('Использование данной команды доступно лишь в личных сообщениях с <@!822500483826450454>')
        }
        sendGlobalMessage('⠀')
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
    }, 200); 
    setTimeout(() =>{client.interaction.createApplicationCommand({
        name: "регистрация", 
        description: "Зарегистрировать своего персонажа",
        options: []
    }, null)
        .then(console.log)
        .catch(console.log);
    }, 200);*/
}

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

client.login(Config.discordTocens.main)
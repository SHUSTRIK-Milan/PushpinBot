//
// ПЕРЕМЕННЫЕ
//


// Интеграции
const Discord = require('discord.js')
const Intents = new Discord.Intents()

const client = new Discord.Client({ intents: [
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
"DIRECT_MESSAGE_TYPING",
]});

const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');

const Config = require('./config')

// Системные переменные
const prefix = '!'
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
}

function toChannelName(text){
    return text.toLowerCase().split(' ').join('-')
}

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
}

function giveRole(member, roleId){
    member.roles.add(roleId, `Добавил роль под ID: ${roleId}.`).catch(console.error);
}

function removeRole(member, roleId){
    member.roles.remove(roleId, `Удалил роль под ID: ${roleId}.`).catch(console.error);
}

//
// CREATE ФУНКЦИИ
//

async function sendLog(member,channel,cat,act,status,add){
    if (cat == 'admin'){
        var color = '#3EA64F'
        var path = Config.channelsID.admin
        var webhook = Config.webhooks.adminLog
    }
    if (cat == 'other'){
        var color = '#B1B1BB'
        var path = Config.channelsID.other
        var webhook = Config.webhooks.otherLog
    }
    if (cat == 'rp'){
        var color = '#ADAD39'
        var path = Config.channelsID.rp
        var webhook = Config.webhooks.rpLog
    }
    var nick = member.nickname
    if(nick == null) nick = '<Без имени>'

    var chnlLink = ''
    if(channel != undefined) chnlLink = `\n[<#${channel.id}>]`

    path = guild.channels.cache.get(path)
    var webhooks = await path.fetchWebhooks()
    webhook = webhooks.get(webhook)

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
    })
}

async function createLore(title,img,desc,message){
    message.channel.send({embeds: [{
            color: '#ECD586',
            fields: [{
                name: `${title}`,
                value: `${desc}`
            }],
            image:{url:img}
        }]
    })
    return
}

async function createEx(rule,num,status,add,message){
    if (status == 0){
        status = '🟩'
        var color = '#95D6A4'
    }
    if (status == 1){
        status = '🟥'
        var color = '#DD636E'
    }

    message.channel.send({embeds: [{
            color: color,
            fields: [{
                name: `\\${status} ${rule} [Пример #${num}]`,
                value: `${add}`
            }]
        }]
    })
    return
}

async function createCom(embd, message){
    var CChannel = guild.channels.cache.get(Config.channelsID.dev_process)
    var webhooks = await CChannel.fetchWebhooks()
    var webhook = webhooks.get(Config.webhooks.commits)

    for(let a of embd.title.split(':')){
        if(a.slice(-6) == 'closed') var act = 'merge';
        if(a.slice(-7) == 'commits' || a.slice(-6) == 'commit') var act = 'commit';
    };

    if(act == 'commit'){
        let nTitle = embd.title.split(' ')[0].split(':')[1].slice()
        let branch = nTitle.slice(0,nTitle.length-1)
        let commits = await fork.listCommits({sha:branch})
        let countC = parseInt(embd.title.split(' ')[1])
        let lastcom = await commits.data[countC-1]

        let nCommits = [];
        for (let i = countC-1; i > -1; i--) {
            lastcom = await commits.data[i]
            nCommits.push(`[\`${lastcom.html_url.slice(52).slice(0,7)}\`](${lastcom.html_url}) <t:${Math.floor(new Date(lastcom.commit.author.date).getTime() / 1000)}>\n${lastcom.commit.message}\n`)
        }

        let color = '#B1B1BB'
        if(countC>0) color = '#81CC8D'
        
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
            }]
        })
    }else if(act == 'merge'){
        let req = await fork.listPullRequests({state:'close'})
        let lastReq = await req.data[0];
        webhook.send({
            embeds: [{
                title: `[PushpinBot:${lastReq.head.ref}] Новое слияние веток.`,
                description: `\`(${lastReq.head.ref} → ${lastReq.base.ref})\` ${lastReq.title}`,
                url: lastReq.url,
                color: '#C8C847',
                author: {
                    name: lastReq.user.login,
                    icon_url: lastReq.user.avatar_url
                },
                fields: [],
            }]
        })
    }
    return
}

//
// СЛЭШ-КОМАНДЫ
//

async function SlashCom(type, name, data, cguildId, permissions){
    if(type == 'wait'){return}

    var commands
    if(cguildId != undefined){
        commands = await client.application.commands.fetch({guildId: cguildId})
    }else{commands = await client.application.commands.fetch()}
    
    var command = commands.find(command => command.name == name)
    if(type == 'get'){
        return commands
    }else if(type == 'create' && command == undefined){
        if(permissions != undefined){
            client.application.commands.create(data, cguildId).then((cmd) => {
                client.application.commands.permissions.add({ guild: cguildId, command: cmd.id, permissions: permissions})
            })
        }else{
            client.application.commands.create(data, cguildId)
        }
    }else if(type == 'del' && command != undefined){
        command.delete()
    }else if(type == 'edit' && command != undefined){
        if(permissions != undefined){
            client.application.commands.edit(command.id, data, cguildId).then((cmd) => {
                client.application.commands.permissions.add({ guild: cguildId, command: cmd.id, permissions: permissions})
            })
        }else{
            client.application.commands.edit(command.id, data, cguildId)
        }
    }else if(type == 'perm' && command != undefined){
        client.application.commands.permissions.add({ guild: cguildId, command: command.id, permissions: permissions})
    }else{return}
} 

//
// БАЗА ДАННЫХ
//

function BDentity(id, data) {
    this.id = id
    this.data = data
}

async function GStats(chl, id){
    try{
        if(chl.id == undefined){
            let path = chl.split('/')
            let cat = guildBD.channels.cache.find(cat => cat.name.toLowerCase() == path[0].toLowerCase() && cat.type == "GUILD_CATEGORY")
            chl = cat.children.find(channel => channel.name.toLowerCase() == path[1].toLowerCase())
        }
        var msgs = await chl.messages.fetch()
        var ents = []

        for (let [id, msg] of msgs){
            let ent = eval(`[${msg.content}]`)[0]
            for (let dat in ent.data){
                try{
                    try{
                        ent.data[dat] = eval(ent.data[dat]) 
                    }catch{
                        ent.data[dat] = JSON.parse(ent.data[dat])
                    }
                }catch{}
            }
            ent.mid = `${msg.id}`
            ents = ents.concat([ent])
        }
        if(id != undefined){
            return ents.reverse().find(ent => ent.id == id)
        }else{
            return ents.reverse()
        }
    }catch{
        guildBD.channels.cache.get('920291811614916609').send(`Ошибка.\n> Убедитесь, что вы правильно указали **[путь]**`).then(msg => {
            setTimeout(() => {msg.delete()}, 10000)
        })
    }
}

async function AStats(chl, structure, data){
    try{
        if(chl.id == undefined){
            let path = chl.split('/')
            let cat = guildBD.channels.cache.find(cat => cat.name.toLowerCase() == path[0].toLowerCase() && cat.type == "GUILD_CATEGORY")
            chl = cat.children.find(channel => channel.name.toLowerCase() == path[1].toLowerCase())
            structure = Config.BDs[`${cat.name}_${chl.name}`]
        }
        var msgs = await chl.messages.fetch()
        var ents = await GStats(chl)
        var id
        if (ents.length == 0){
            id = msgs.size
        }else{
            id = ents[ents.length-1].id
        }
        
        var returnData = {}
        for (let i = 0; i < structure.length; i++){
            try{
                if(typeof(data[i]) != 'string'){
                    returnData[structure[i]] = eval(data[i])
                }else{
                    returnData[structure[i]] = eval(`[${data[i]}]`)[0]
                }
                if(typeof(returnData[structure[i]]) == 'object'){
                    returnData[structure[i]] = JSON.stringify(returnData[structure[i]])
                }
            }catch{
                returnData[structure[i]] = data[i]
            }
        }
        var ent = new BDentity(id+1, returnData)

        chl.send(JSON.stringify(ent, null, 2))
    }catch(err){
        console.log(err)
        guildBD.channels.cache.get('920291811614916609').send(`Ошибка.\n> Убедитесь, что вы правильно указали **[путь, значения]**`).then(msg => {
            setTimeout(() => {msg.delete()}, 10000)
        })
    }
}

async function EStats(chl, id, par, data){
    try{
        if(chl.id == undefined){
            let path = chl.split('/')
            let cat = guildBD.channels.cache.find(cat => cat.name.toLowerCase() == path[0].toLowerCase() && cat.type == "GUILD_CATEGORY")
            chl = cat.children.find(channel => channel.name.toLowerCase() == path[1].toLowerCase())
        }
        var ents = await GStats(chl)
        var entity = ents.find(entity => entity.id == id)
        var msg = await chl.messages.fetch(entity.mid)

        var ent = eval(`[${msg.content}]`)
        try{
            if(typeof(data[0]) != 'string'){
                ent[0].data[par] = eval(data[0])
            }else{
                ent[0].data[par] = eval(`[${data[0]}]`)[0]
            }
            if(typeof(ent[0].data[par]) == 'object'){
                ent[0].data[par] = JSON.stringify(ent[0].data[par])
            }
        }catch{
            ent[0].data[par] = data[0]
        }
        
        msg.edit(JSON.stringify(ent[0], null, 4))
    }catch{
        guildBD.channels.cache.get('920291811614916609').send(`Ошибка.\n> Убедитесь, что вы правильно указали **[путь, id-ячейки, параметр, замену]**`).then(msg => {
            setTimeout(() => {msg.delete()}, 10000)
        })
    }
}

async function DStats(chl, id){
    try{
        if(chl.id == undefined){
            let path = chl.split('/')
            let cat = guildBD.channels.cache.find(cat => cat.name.toLowerCase() == path[0].toLowerCase() && cat.type == "GUILD_CATEGORY")
            chl = cat.children.find(channel => channel.name.toLowerCase() == path[1].toLowerCase())
        }
        var ents = await GStats(chl)
        var entity = ents.find(entity => entity.id == id)
        var msg = await chl.messages.fetch(entity.mid)
        setTimeout(() => msg.delete(), timeOfDelete)
    }catch{
        guildBD.channels.cache.get('920291811614916609').send(`Ошибка.\n> Убедитесь, что вы правильно указали **[путь, id-ячейки]**`).then(msg => {
            setTimeout(() => {msg.delete()}, 10000)
        })
    }
}

//
// РП-ФУНКЦИИ
//

const RPF = {
    createObjects: async function(path, guild){
        let objects = await GStats(path)
        for (let object of objects){
            let cat = guild.channels.cache.find(cat => cat.type == 'GUILD_CATEGORY' && cat.name == object.data.name && object.data.cid == cat.id)
            if(cat == undefined){
                cat = await guild.channels.create(object.data.name, {
                    type: 'GUILD_CATEGORY'
                })
                EStats(path, object.id, "cid", false, [`${cat.id}`])
            }
            cat.setPosition(cat.position+1)
            
            for(let room of object.data.rooms){
                let chnl = cat.children.toJSON().find(chnl => chnl.name == toChannelName(room.name))
                if(chnl == undefined){
                    let chnl = await guild.channels.create(room.name, {
                        type: 'GUILD_TEXT',
                        parent: cat,
                        topic: `${object.data.rooms.indexOf(room)}`
                    })
                    chnl.setPosition(object.data.rooms.indexOf(room))
                }
            }
        }
    },
    radiusSelectMenu: function(objectId, objects){
        let returnObjects = []
        for(let object of objects){
            if(object.data.radius.find(object => object.id == objectId) != undefined || objectId == object.id){
                returnObjects.push({
                    label: `${object.data.name}`,
                    value: `${object.data.cid}`,
                    emoji: {
                        id: null,
                        name: `${['🏠','🏢','🏛','🏡','🏭'][random(0,4)]}`
                    }
                })
            }
        }
        return returnObjects
    }
}

//
// ХУКИ
//

client.on('ready', () => {
    console.log(`[bot-base ready]`)

    guild = client.guilds.cache.get(Config.guilds.main)
    guildAges = client.guilds.cache.get(Config.guilds.ages)
    guildBD = client.guilds.cache.get(Config.guilds.BD)

    module.exports = {
        client, REST, Routes,
        Config, prefix, timeOfDelete,
        guildBase:guild, guildAges, guildBD, 
        rpGuilds, cmdParametrs, toChannelName, random,
        haveRole, giveRole, removeRole,
        sendLog, createLore, createEx,
        createCom, SlashCom, BDentity,
        GStats, AStats, EStats,
        DStats, RPF}
    require('./projects/pushpin.js')
    require('./projects/ages.js')
    require('./projects/bd.js')

    function checkOnlineUsers(){
        let members = guild.members.cache
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
});

client.on('guildMemberAdd', (member) => {
    if(member.guild.id == Config.guilds.main){
        giveRole(member, '829423238169755658')
    }
    sendLog(member, undefined, 'other', 'Новый пользователь', 0, `${member.user.tag} присоеденился к сообществу!`)
});

client.on('messageDelete', (message) => {
    if(!message.author.bot){if(rpGuilds.find(guild => guild == message.guild.id) != null){
        sendLog(message.member,message.channel,'rp','Сообщение удалено',0,`Содержимое сообщения: ${message.content}`)
    }else{sendLog(message.member,message.channel,'other','Сообщение удалено',0,`Содержимое сообщения: ${message.content}`)}}
});

client.on('messageUpdate', (messageOld, messageNew) =>{
    if(!messageNew.author.bot){if(rpGuilds.find(guild => guild == messageNew.guild.id) != null){
        sendLog(messageNew.member,messageNew.channel,'rp','Сообщение отредактировано',0,`Старое соообщение:\n> ${messageOld.content}\nНовое сообщение:\n> ${messageNew.content}`)
    }else{sendLog(messageNew.member,messageNew.channel,'other','Сообщение отредактировано',0,`Старое соообщение:\n> ${messageOld.content}\nНовое сообщение:\n> ${messageNew.content}`)}}
})

client.on('messageCreate', message => {
    var cA = haveRole(message.member, "[A]"),
        cB = haveRole(message.member, "[B]"),
        cC = haveRole(message.member, "[C]")
    let mb = message.author.bot;
    let dm = message.channel.type == "DM";
    let command = cmdParametrs(message.content)

    if(message.content == '⠀' && message.author.bot){
        setTimeout(() => message.delete(), timeOfDelete)
    }
    if(command.com == `send` && !mb && !dm && cA){		
        message.channel.send(`${command.arg}`)
        setTimeout(() => message.delete(), timeOfDelete)
    }
    if(command.com == `clear` && !mb && !dm && (cA || cB)){
        let arg = parseInt(command.sarg[0])
        if (arg > 0 && arg < 100){
            message.channel.bulkDelete(arg, true)
        }
    }
    if(command.com == `edit` && !dm && cA){
        message.channel.guild.channels.cache.find(id => id == `${command.sarg[0]}`).messages.fetch(`${command.sarg[1]}`)
        .then(msg =>{
            if(!msg.author.bot) return
            msg.edit(cmdParametrs(message.content,2).carg)
        })
        setTimeout(() => message.delete(), timeOfDelete)
    }
    if(command.com == `checkm` && !mb && !dm && cA){
        console.log(command)
        setTimeout(() => message.delete(), timeOfDelete)
    }
    if(command.com == `cex` && !mb && !dm && cA){
        createEx(command.oarg[0],command.oarg[1],command.oarg[2],command.oarg[3],message)
        setTimeout(() => message.delete(), timeOfDelete)
    }
    if(command.com == `clore` && !mb && !dm && cA){
        createLore(command.oarg[0],command.oarg[1],command.oarg[2],message)
        setTimeout(() => message.delete(), timeOfDelete)
    }
})

client.login(Config.discordTocens.main)
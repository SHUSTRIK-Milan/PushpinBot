//
// ПЕРЕМЕННЫЕ
//


// Интеграции
const Discord = require('discord.js')

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
]})

const { REST } = require('@discordjs/rest')
const { Routes } = require('discord-api-types/v9')
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
})
var fork = gitA.getRepo('SHUSTRIK-Milan','PushpinBot')

//
// ГЛАВНЫЕ ФУНКЦИИ
//

function cmdParametrs(content,countS){
    if(countS == undefined) countS = 0
    
    if(content.slice(0,1) == prefix){
        var com = content.split(" ")[0].slice(prefix.length) 
        var arg = content.slice(com.length+prefix.length+1)
        var splitArg = arg.split(" ")
        var sliceArg = splitArg.slice(countS).join(' ')
        var boundArg = arg.match(/"(\\.|[^"\\])*"/g)
    }else{
        var boundArg = content.match(/"(\\.|[^"\\])*"/g)
    }

    if(boundArg != undefined){for(let i = 0; i < boundArg.length; i++){
        boundArg[i] = boundArg[i].replaceAll(/"/g, "")
    }}else{boundArg='null'}

    var comand = {
        com: com,
        arg: arg,
        splitArg: splitArg,
        sliceArg: sliceArg,
        boundArg: boundArg,
    }

    return comand
}

function toChannelName(text){
    return text.toLowerCase().split(' ').join('-')
}

function random(min, max) {
    let rand = min + Math.random() * (max + 1 - min)
    return Math.floor(rand)
}

function getRoleId(guild, roleName){
    var role = guild.roles.cache.find(role => role.name == roleName)
    if(role != undefined){
        return role.id
    }
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
    member.roles.add(roleId, `Добавил роль под ID: ${roleId}.`).catch(console.error)
}

function removeRole(member, roleId){
    member.roles.remove(roleId, `Удалил роль под ID: ${roleId}.`).catch(console.error)
}

//
// CREATE ФУНКЦИИ
//

async function sendLog(member,channel,cat,act,pat,add){
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

    if (pat) pat = '🟩'
    if (!pat) pat = '🟥'
    
    webhook.send({
        embeds: [{
            color: color,
            author: {
                name: `${pat} ${member.user.username} – ${nick}`,
                icon_url: member.user.avatarURL()
            },
            description: `**${act}:**\n${add}${chnlLink}`
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

async function createEx(rule,num,pat,add,message){
    if (pat == "true"){
        pat = 'https://i.imgur.com/cjSSwtu.png'
        var color = '#95D6A4'
    }
    if (pat == "false"){
        pat = 'https://i.imgur.com/utuBexR.png'
        var color = '#DD636E'
    }

    message.channel.send({embeds: [{
            color: color,
            fields: [{
                name: `${rule} [Пример #${num}]`,
                value: `${add}`
            }],
            thumbnail: {url: pat}
        }]
    })
    return
}

async function createCom(embd, message){
    var CChannel = guild.channels.cache.get(Config.channelsID.dev_process)
    var webhooks = await CChannel.fetchWebhooks()
    var webhook = webhooks.get(Config.webhooks.commits)

    for(let a of embd.title.split(':')){
        if(a.slice(-6) == 'closed'){
            var act = 'merge'
        }else if (a.slice(-7) == 'commits' || a.slice(-6) == 'commit'){
            var act = 'commit'
        }
    }

    if(act == 'commit'){
        let nTitle = embd.title.split(' ')[0].split(':')[1].slice()
        let branch = nTitle.slice(0,nTitle.length-1)
        let commits = await fork.listCommits({sha:branch})
        let countC = parseInt(embd.title.split(' ')[1])
        let lastcom = await commits.data[countC-1]

        let nCommits = []
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
        let lastReq = await req.data[0]
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

async function ReplyInteraction(interaction, parametrs){
    try{
        await interaction.update(parametrs)
    }catch(error){
        if(interaction.replied){
            interaction.editReply(parametrs)
        }else{
            interaction.reply(parametrs)
        }
    }
}

function ErrorInteraction(interaction, error, ephemeral){
    console.log(error)
    if(error.message == undefined) error.message = ''
    ReplyInteraction(interaction, {content: `> Ошибка. ${error.message} ⛔`, embeds: [], components: [], ephemeral: ephemeral})
    guild.channels.cache.get(Config.channelsID.errors).send({
        embeds: [
            {
                title: `Ошибка "${error.message}"`,
                description: `${error.stack}`,
                timestamp: new Date(),
                color: "#DD2C2C",
                thumbnail: {url: 'https://i.imgur.com/YTXH8fJ.png'}
            }
        ],
        components: [
            {
                type: 'ACTION_ROW',
                components: [
                    {
                        type: 'BUTTON',
                        label: 'Канал',
                        style: 'LINK',
                        url: `discord:///channels/${interaction.guildId}/${interaction.channelId}`
                    }
                ]
            }
        ]
    })
}

//
// БАЗА ДАННЫХ
//

function BDunit(id, data) {
    this.id = id
    this.data = data
}

async function GStats(chl, id, par){
    try{
        if(chl.id == undefined){
            let path = chl.split('/')
            let cat = guildBD.channels.cache.find(cat => cat.name.toLowerCase() == path[0].toLowerCase() && cat.type == "GUILD_CATEGORY")
            chl = cat.children.find(channel => channel.name.toLowerCase() == path[1].toLowerCase())
        }
        var msgs = await chl.messages.fetch()
        var units = []

        for (let [id,msg] of msgs){
            let unit = eval(`[${msg.content}]`)[0]
            for (let dat in unit.data){
                try{
                    if(Number.isInteger(parseInt(unit.data[dat])) && parseInt(unit.data[dat]) > 16){
                        throw new Error
                    }
                    try{
                        unit.data[dat] = eval(unit.data[dat]) 
                    }catch{
                        unit.data[dat] = JSON.parse(unit.data[dat])
                    }
                }catch{}
            }
            unit.mid = `${id}`
            units.push(unit)
        }

        if(id != undefined){
            let idEnt = units.reverse().find(unit => unit.id == id)
            if(par != undefined){
                par = par.split('.')
                if(par[0] != 'data'){
                    return idEnt[par[0]]
                }else{
                    return idEnt.data[par[1]]
                }
            }else{
                return idEnt
            }
        }else{
            return units.reverse()
        }
    }catch(error){
        console.log(error)
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
        var messages = await chl.messages.fetch()
        var units = await GStats(chl)
        var id
        if (units.length == 0){
            id = messages.size
        }else{
            id = units[units.length-1].id
        }
        
        var returnData = {}
        for (let i = 0; i < structure.length; i++){
            try{
                if(typeof(data[i]) != 'string'){
                    returnData[structure[i]] = data[i]
                }else if(Number.isInteger(parseInt(data[i])) && data[i].length > 16){
                    returnData[structure[i]] = data[i]
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
        var unit = new BDunit(id+1, returnData)
        var message = JSON.stringify(unit, null, 2)
        if(message.length <= 2000){
            chl.send(message)
        }else{
            console.log('> Ошибка при создании ячейки')
        }
    }catch(error){
        console.log(error)
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
        var units = await GStats(chl)
        var unit = units.find(unit => unit.id == id)
        var msg = await chl.messages.fetch(unit.mid)
        unit = eval(`[${msg.content}]`)[0]

        try{
            if(typeof(data[0]) != 'string'){
                unit.data[par] = data[0]
            }else if(Number.isInteger(parseInt(data[0])) && data[0].length > 16){
                unit.data[par] = data[0]
            }else{
                unit.data[par] = eval(`[${data[0]}]`)[0]
            }
            if(typeof(unit.data[par]) == 'object'){
                unit.data[par] = JSON.stringify(unit.data[par])
            }
        }catch{
            unit.data[par] = data[0]
        }

        var message = JSON.stringify(unit, null, 2)
        if(message.length <= 2000){
            msg.edit(message)
        }else{
            console.log('> Ошибка при редактировании ячейки')
        }
    }catch(error){
        console.log(error)
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
        var units = await GStats(chl)
        var unit = units.find(unit => unit.id == id)
        var msg = await chl.messages.fetch(unit.mid)
        setTimeout(() => msg.delete(), timeOfDelete)
    }catch(error){
        console.log(error)
        guildBD.channels.cache.get('920291811614916609').send(`Ошибка.\n> Убедитесь, что вы правильно указали **[путь, id-ячейки]**`).then(msg => {
            setTimeout(() => {msg.delete()}, 10000)
        })
    }
}

//
// РП-ФУНКЦИИ
//

const RPF = {
    randomHomeEmoji: () => {
        return ['🏠','🏢','🏛','🏡','🏭','🏘'][random(0,5)]
    },
    createObjects: async (path, guild) => {
        let objects = await GStats(path)
        for (let object of objects){
            let cat = guild.channels.cache.find(cat => cat.type == 'GUILD_CATEGORY' && cat.name == object.data.name && object.data.cid == cat.id)
            if(cat == undefined){
                cat = await guild.channels.create(object.data.name, {
                    type: 'GUILD_CATEGORY',
                    permissionOverwrites: [{
                        id: guild.roles.everyone,
                        deny: ['VIEW_CHANNEL','READ_MESSAGE_HISTORY', 'SEND_MESSAGES']
                    }]
                })
                EStats(path, object.id, "cid", [cat.id])
            }
            cat.setPosition(cat.position+1)
            
            for(let room of object.data.rooms){
                let chnl = cat.children.toJSON().find(chnl => chnl.name == toChannelName(room.name))
                if(chnl == undefined){
                    let chnl = await guild.channels.create(room.name, {
                        type: 'GUILD_TEXT',
                        parent: cat,
                        topic: `${object.data.rooms.indexOf(room)}`,
                    })
                    chnl.setPosition(object.data.rooms.indexOf(room))
                }
            }
        }
    },
    radiusSelectMenu: (objectId, objects, inside, page, id, options, add) => {
        let returnComponents = [
            {
                type: 'ACTION_ROW', 
                components: [
                    {
                        type: 'SELECT_MENU',
                        customId: options.customId,
                        placeholder: options.placeholder,
                        options: []
                    }
                ]
            },
            {
                type: 'ACTION_ROW',
                components: []
            }
        ]
        let selectMenu = returnComponents[0].components[0]
        let buttons = returnComponents[1].components

        for(let object of objects){
            if(object.data.radius.find(object => object.id == objectId) != undefined || (objectId == object.id) == inside){
                if(object.data.cid == undefined || selectMenu.options.find(returnObject => returnObject.value == object.data.cid)){
                    object.data.cid = `${object.id}_undefined`
                }

                let emoji = RPF.randomHomeEmoji()
                if(object.data.status != undefined){
                    if(!object.data.status.open){
                        emoji = '🔒'
                    }
                }

                selectMenu.options.push({
                    label: `${object.data.name}`,
                    value: `${object.data.cid}`,
                    emoji: {
                        id: null,
                        name: emoji
                    }
                })
            }
        }

        if(selectMenu.options.length > 25){
            let stage = 1
            if(selectMenu.options.length % 25 == 0){
                stage = selectMenu.options.length/25
            }
            for(let i = 0; i <= stage; i++){
                if(i != page){
                    buttons.push({
                        type: 'BUTTON',
                        label: `${i+1}`,
                        customId: `switchPage_${id}_${i}_${add}`,
                        style: ['SUCCESS', 'PRIMARY', 'DANGER'][random(0,3)]
                    })
                }
            }
        }else{
            returnComponents.splice(1,1)
        }

        selectMenu.options = selectMenu.options.slice(0+(page*25), 25*(page+1))
        return returnComponents
    },
    roomItemManager: (get, project, object, room, gItem, count) => {
        try{
            var roomId = object.data.rooms.indexOf(room)
            try{
                var roomItem = room.items.find(item => item.codename == gItem.data.codename)
                var rItemId = room.items.indexOf(roomItem)
            }catch{}

            if(!get){
                if(room.items == undefined){
                    throw new Error(`Комната пуста`)
                }else if(roomItem != undefined){
                    if(roomItem.count <= count){
                        room.items.splice(roomItem, 1)
                    }else{
                        room.items[rItemId].count -= count
                    }
                }else{
                    throw new Error(`Предмет не удалось найти`)
                }

                object.data.rooms[roomId] = room
                if(room.items.length == 0) room.items = undefined
                EStats(`${project}/objects`, object.id, 'rooms', [object.data.rooms])
                return true
            }else if(get){
                if(room.items == undefined){
                    room.items = [{codename: gItem.data.codename, count: count}]
                }else if(roomItem == undefined){
                    room.items.push({codename: gItem.data.codename, count: count})
                }else{
                    room.items[rItemId].count += count
                }

                if(room.items.length <= 25){
                    try{
                        object.data.rooms[roomId] = room
                        EStats(`${project}/objects`, object.id, 'rooms', [object.data.rooms])
                        return true
                    }catch{
                        throw new Error(`Комната переполнена`)
                    }
                }else{
                    throw new Error(`Комната переполнена`)
                }
            }
        }catch(error){
            return new Error(`${error.message}`)
        }
    },
    playerItemManager: (get, project, player, gItem, count) => {
        try{
            try{
                var playerItem = player.data.items.find(item => item.codename == gItem.data.codename)
                var itemId = player.data.items.indexOf(playerItem)
            }catch{}

            if(!get){
                if(player.data.items == undefined){
                    throw new Error(`Ваш инвентарь пуст`)
                }else if(playerItem != undefined){
                    if(playerItem.count <= count){
                        player.data.items.splice(itemId, 1)
                    }else{
                        player.data.items[itemId].count -= count
                    }
                }else{
                    throw new Error(`Предмет не удалось найти`)
                }

                if(player.data.items.length == 0) player.data.items = undefined
                EStats(`${project}/players`, player.id, 'items', [player.data.items])
                return true
            }else if(get){
                if(player.data.items == undefined){
                    player.data.items = [{codename: gItem.data.codename, count: count}]
                }else if(playerItem == undefined){
                    player.data.items.push({codename: gItem.data.codename, count: count})
                }else{
                    player.data.items[itemId].count += count
                }

                if(player.data.items.length <= 25){
                    try{
                        EStats(`${project}/players`, player.id, 'items', [player.data.items])
                        return true
                    }catch(error){
                        console.log(error)
                        throw new Error(`Инвентарь переполнен`)
                    }
                }else{
                    throw new Error(`Инвентарь переполнен`)
                }
            }
        }catch(error){
            return new Error(`${error.message}`)
        }
    },
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
        getRoleId, haveRole, giveRole, removeRole,
        sendLog, createLore, createEx,
        createCom, SlashCom, ReplyInteraction, ErrorInteraction, BDunit,
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
    })
})

client.on('messageDelete', (message) => {
    if(!message.author.bot){
        if(rpGuilds.find(guild => guild == message.guild.id) != null){
            sendLog(message.member, message.channel, 'rp', 'Сообщение удалено', true, `Содержимое сообщения: ${message.content}`)
        }else{
            sendLog(message.member, message.channel, 'other', 'Сообщение удалено', true, `Содержимое сообщения: ${message.content}`)
        }
    }
})

client.on('messageUpdate', (messageOld, messageNew) =>{
    if(!messageNew.author.bot){
        if(rpGuilds.find(guild => guild == messageNew.guild.id) != null){
            sendLog(messageNew.member,messageNew.channel,'rp','Сообщение отредактировано', true,`> Старое соообщение:\n${messageOld.content}\n> Новое сообщение:\n${messageNew.content}`)
        }else{
            sendLog(messageNew.member,messageNew.channel,'other','Сообщение отредактировано', true,`> Старое соообщение:\n${messageOld.content}\n> Новое сообщение:\n${messageNew.content}`)
        }
    }
})

client.on('messageCreate', message => {
    var cA = haveRole(message.member, "[A]"),
        cB = haveRole(message.member, "[B]"),
        cC = haveRole(message.member, "[C]")
    let mb = message.author.bot
    let dm = message.channel.type == "DM"
    let command = cmdParametrs(message.content)

    if(message.content == '⠀' && message.author.bot){
        setTimeout(() => message.delete(), timeOfDelete)
    }
    if(command.com == `send` && !mb && !dm && cA){		
        message.channel.send(`${command.arg}`)
        setTimeout(() => message.delete(), timeOfDelete)
    }
    if(command.com == `clear` && !mb && !dm && (cA || cB)){
        let arg = parseInt(command.splitArg[0])
        if (arg > 0 && arg < 100){
            message.channel.bulkDelete(arg, true)
        }
    }
    if(command.com == `edit` && !dm && cA){
        message.channel.guild.channels.cache.find(id => id == `${command.splitArg[0]}`).messages.fetch(`${command.splitArg[1]}`)
        .then(msg =>{
            if(!msg.author.bot) return
            msg.edit(cmdParametrs(message.content,2).sliceArg)
        })
        setTimeout(() => message.delete(), timeOfDelete)
    }else if(command.com == `checkm` && !mb && !dm && cA){
        console.log(command)
        setTimeout(() => message.delete(), timeOfDelete)
    }
    if(command.com == `cex` && !mb && !dm && cA){
        createEx(command.boundArg[0],command.boundArg[1],command.boundArg[2],command.boundArg[3],message)
        setTimeout(() => message.delete(), timeOfDelete)
    }
    if(command.com == `clore` && !mb && !dm && cA){
        createLore(command.boundArg[0],command.boundArg[1],command.boundArg[2],message)
        setTimeout(() => message.delete(), timeOfDelete)
    }
})

client.login(Config.discordTocens.main)

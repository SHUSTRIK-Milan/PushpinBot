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

const getUnicode = require('emoji-unicode')

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

async function getMessages(chnanel, limit){
    let allMessages = []
    let last_id
    
    while(true){
        let options = {limit: 100}
        if(last_id != undefined){
            options.before = last_id
        }

        let messages = await chnanel.messages.fetch(options)
        if(messages.size == 0){
            break
        }
        allMessages.push(...messages.values())
        last_id = messages.last().id

        if(messages.size != 100 || allMessages >= limit){
            break
        }
    }
    return allMessages.slice(0, limit)
}

function emojiURL(emoji){
    return `https://twemoji.maxcdn.com/v/13.1.0/72x72/${getUnicode(emoji).split(' ').join('-')}.png`
}

function toChannelName(text){
    return text.toLowerCase().split(' ').join('-')
}

function editFirstChar(text, upper){
    if(upper){
        return text[0].toUpperCase() + text.slice(1)
    }else{
        return text[0].toLowerCase() + text.slice(1)
    }
}

function betterLimitText(text, limit){
    if(text.length > limit){
        text = `${text.slice(0,limit-3)}...`
    }
    return text
}

function random(min, max) {
    let rand = min + Math.random() * (max + 1 - min)
    return Math.floor(rand)
}

function getRoleId(guild, roleName){
    let role = guild.roles.cache.find(role => role.name == roleName)
    if(role){
        return role.id
    }
}

function haveRole(guild, userId, role){
    let member = guild?.members.cache.find(fMember => fMember.user.id == userId)
    role = guild?.roles.cache.find(fRole => fRole.name == role)?.id ?? role

    if(member?.roles.cache.get(role)){
        return true
    }else{
        return false
    }
}

function giveRole(member, role){
    role = guild?.roles.cache.find(fRole => fRole.name == role)?.id ?? role
    member?.roles.add(role, `Добавил роль под ID: ${role}.`).catch(console.error)
}

function removeRole(member, role){
    role = guild?.roles.cache.find(fRole => fRole.name == role)?.id ?? role
    member?.roles.remove(role, `Удалил роль под ID: ${role}.`).catch(console.error)
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

async function createCom(embd){
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
    if(cguildId){
        commands = await client.application.commands.fetch({guildId: cguildId})
    }else{
        commands = await client.application.commands.fetch()
    }
    
    var command = commands.find(command => command.name == name)
    
    if(type == 'get'){
        return commands
    }else if(type == 'add' && !command){
        if(permissions){
            client.application.commands.create(data, cguildId).then((cmd) => {
                client.application.commands.permissions.add({ guild: cguildId, command: cmd.id, permissions: permissions})
            })
        }else{
            client.application.commands.create(data, cguildId)
        }
    }else if(type == 'del' && command){
        command.delete()
    }else if(type == 'edit' && command){
        if(permissions){
            client.application.commands.edit(command.id, data, cguildId).then((cmd) => {
                client.application.commands.permissions.add({ guild: cguildId, command: cmd.id, permissions: permissions})
            })
        }else{
            client.application.commands.edit(command.id, data, cguildId)
        }
    }else if(type == 'perm' && command){
        client.application.commands.permissions.add({ guild: cguildId, command: command.id, permissions: permissions})
    }else{return}
}

const IAL = {
    ReplyInteraction: async (interaction, parametrs) => {
        try{
            await interaction?.update(parametrs)
        }catch(error){
            if(interaction?.replied){
                await interaction?.editReply(parametrs)
            }else{
                await interaction?.reply(parametrs)
            }
        }
    },
    ErrorInteraction: (interaction, error, ephemeral) => {
        console.log(error)
        if(error.message == undefined) error.message = ''
        IAL.ReplyInteraction(interaction, {content: `> Ошибка. ${error.message} ⛔`, embeds: [], components: [], ephemeral: ephemeral})
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
    },
    EmptyReply: async (interaction) => {
        try{
            await interaction?.deferReply()
            await interaction?.deleteReply()
        }catch(error){
            console.log(error)
        }
    }
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
        var msgs = await getMessages(chl, 10000)
        var units = []

        for (let msg of msgs){
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
            unit.mid = msg.id
            units.push(unit)
        }

        if(id != undefined){
            let idEnt = units.reverse().find(unit => unit.id == id)
            if(par != undefined){
                par = `['${par.split('.').join(`']['`)}']`
                return eval(`idEnt.data${par}`)
            }else{
                return idEnt
            }
        }else{
            return units.reverse()
        }
    }catch(error){
        console.log(error)
        guildBD.channels.cache.get('920291811614916609').send(`Ошибка.\n> Убедитесь, что вы правильно указали **[путь]**`)
    }
}

async function AStats(chl, structure, data){
    try{
        setTimeout(async () => {
            if(chl.id == undefined){
                let path = chl.split('/')
                let cat = guildBD.channels.cache.find(cat => cat.name.toLowerCase() == path[0].toLowerCase() && cat.type == "GUILD_CATEGORY")
                chl = cat.children.find(channel => channel.name.toLowerCase() == path[1].toLowerCase())
                structure = Config.BDs[`${cat.name}_${chl.name}`]
            }
            var messages = await chl.messages.fetch()
            var units = await GStats(chl)
            var id
            if (!units.length){
                id = messages.size
            }else{
                id = units[units.length-1].id
            }
            
            var returnData = {}
            for (let i = 0; i < structure.length; i++){
                let _data = {
                    struct: structure[i],
                    data: data[i]
                }

                try{
                    if(typeof(_data.data) != 'string'){ // если данные внесены не человеком, то оставляем их неизменными
                        returnData[_data.struct] = _data.data
                    }else if(Number.isInteger(parseInt(_data.data)) && _data.data.length > 16){ // если строка может стать числом и его длина больше 16, то оставляем все как есть
                        returnData[_data.struct] = _data.data
                    }else{ // иначе, если данные внесены человеком, мы превращаем их в код, запихивая его в array, а затем доставая, чтобы исключить ошибки eval
                        returnData[_data.struct] = eval(`[${_data.data}]`)[0]
                    }
                    if(typeof(returnData[_data.struct]) == 'object'){ // если по итогу мы получаем object, тогда мы переделываем его в JSON, чтобы исключить кучу пробелов
                        returnData[_data.struct] = JSON.stringify(returnData[_data.struct])
                    }
                }catch{
                    returnData[_data.struct] = _data.data
                }
            }
            var unit = new BDunit(id+1, returnData)
            var message = JSON.stringify(unit, null, 2)

            if(message.length <= 2000){
                chl.send(message)
            }else{
                console.log('> Ошибка при создании ячейки')
            }

            return unit
        }, 10)
    }catch(error){
        console.log(error)
        guildBD.channels.cache.get('920291811614916609').send(`Ошибка.\n> Убедитесь, что вы правильно указали **[путь, значения]**`)
    }
}

async function EStats(chl, id, par, data){
    try{
        setTimeout(async () => {
            data = data[0]
            if(chl.id == undefined){
                let path = chl.split('/')
                let cat = guildBD.channels.cache.find(cat => cat.name.toLowerCase() == path[0].toLowerCase() && cat.type == "GUILD_CATEGORY")
                chl = cat.children.find(channel => channel.name.toLowerCase() == path[1].toLowerCase())
            }
            par = `['${par.split('.').join(`']['`)}']`
            var units = await GStats(chl)
            var unit = units.find(unit => unit.id == id)
            var msg = await chl.messages.fetch(unit.mid)
            delete unit.mid

            try{
                if(Number.isInteger(parseInt(data)) && data.length > 16){
                    throw new Error
                }
                eval(`unit.data${par} = ${data}`)
            }catch{
                eval(`unit.data${par} = \`${data}\``)
            }

            if(typeof(data) == 'object'){
                eval(`unit.data${par} = ${JSON.stringify(data)}`)
            }

            for(let value in unit.data){
                let data = {
                    value: value
                }
                try{
                    if(typeof(unit.data[data.value]) != 'string'){
                        unit.data[data.value] = unit.data[data.value]
                    }else if(Number.isInteger(parseInt(unit.data[data.value])) && unit.data[data.value].length > 16){
                        unit.data[data.value] = unit.data[data.value]
                    }else{
                        unit.data[data.value] = eval(`[${unit.data[data.value]}]`)[0]
                    }
                    
                    if(typeof(unit.data[data.value]) == 'object'){
                        unit.data[data.value] = JSON.stringify(unit.data[data.value])
                    }
                }catch{}
            }

            var message = JSON.stringify(unit, null, 2)
            
            if(message.length <= 2000){
                msg.edit(message)
            }else{
                console.log('> Ошибка при редактировании ячейки')
            }
        }, 10)
    }catch(error){
        console.log(error)
        guildBD.channels.cache.get('920291811614916609').send(`Ошибка.\n> Убедитесь, что вы правильно указали **[путь, id-ячейки, параметр, замену]**`)
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
        guildBD.channels.cache.get('920291811614916609').send(`Ошибка.\n> Убедитесь, что вы правильно указали **[путь, id-ячейки]**`)
    }
}

//
// РП-ФУНКЦИИ
//

const RPF = {
    randomHomeEmoji: () => {
        return ['🏠', '🏡', '🏡', '⛪', '🕋', '🕌', '🛕', '🕍', '🏢', '🏫', '🏬', '🏯', '🏰', '💒', '🗼', '⛺', '🌁', '🌃', '🌆', '🌇', '🌄'][random(0,20)]
    },
    createObjects: async (path, guild) => {
        let objects = await GStats(path)
        for (let object of objects){
            let cat = guild.channels.cache.find(cat => cat.type == 'GUILD_CATEGORY' && cat.name == object.data.name && object.data.cid == cat.id)
            if(!cat){
                cat = await guild.channels.create(`${object.data.emoji ?? RPF.randomHomeEmoji()} ${object.data.name}`, {
                    type: 'GUILD_CATEGORY',
                    permissionOverwrites: [
                        {
                            id: guild.roles.everyone,
                            deny: ['VIEW_CHANNEL','READ_MESSAGE_HISTORY', 'SEND_MESSAGES'],
                        },
                        {
                            id: getRoleId(guild, 'Admin-Mode'),
                            allow: ['VIEW_CHANNEL','READ_MESSAGE_HISTORY', 'SEND_MESSAGES'],
                        }
                    ]
                })
                cat.setPosition(object.data.pos + 1 ?? object.id)
                EStats(path, object.id, "cid", [`${cat.id}`])
            }
            
            for(let room of object.data.rooms){
                let chnl = cat.children.toJSON().find(chnl => chnl.name == toChannelName(room.name))
                if(!chnl){
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
    objectsSelectMenuOptions: (object, objects, radius, inside = true, defaultOption) => {
        var returnOptions = []
        
        for(let fObject of objects){
            if((radius && object.data.radius?.find(object => object.id == fObject.id)) || (!radius && object.id != fObject.id) || (inside && object.id == fObject.id)){
                if(fObject.data.cid == undefined){
                    fObject.data.cid = `${fObject.id}_undefined`
                }

                let emoji = fObject.data.emoji ?? RPF.randomHomeEmoji()
                if(fObject.data.status && radius){
                    if(!fObject.data.status?.open && fObject.data.status?.ex?.find(ex => ex == object.id)){
                        emoji = '🔓'
                    }else if(!fObject.data.status?.open && !fObject.data.status?.ex?.find(ex => ex == object.id)){
                        emoji = '🔒'
                    }
                }

                let category = guildAges.channels.cache.get(fObject.data.cid)
                let position = category?.position ?? returnOptions.length

                returnOptions[position] = {
                    label: `[${fObject.id}] ${fObject.data.name}`,
                    value: `${fObject.id}`,
                    emoji: {
                        id: null,
                        name: emoji
                    },
                    default: (() => {
                        if(fObject.id == defaultOption){
                            return true
                        }else{
                            return false
                        }
                    })()
                }
            }
        }
        return returnOptions.filter(unit => unit)
    },
    itemsSelectMenuOptions: (inventory = [], items) => {
        let returnOptions = []

        for (let lItem of inventory){
            let gItem = items.find(fItem => fItem.id == lItem.id) ?? lItem
            if(gItem){
                let convar = lItem.convar
                if(convar){
                    convar = `-${convar}`
                }else{
                    convar = ''
                }

                returnOptions.push({
                    label: `[${lItem.id}] ${gItem.data.name} ${`(x${lItem.count?.toLocaleString('en')})` ?? ""}`,
                    description: gItem.data.desc,
                    value: `${lItem.id}${convar}`,
                    emoji: {
                        id: null,
                        name: `${gItem.data.emoji}`
                    }
                })
            }
        }

        return returnOptions
    },
    charsSelectMenuOptions: (chars = [], sChar, gChars, defaultOption) => {
        let returnOptions = []
       
        for(let char of chars){
            char = gChars?.find(fChar => fChar.id == char) ?? char

            if(char && char.id && char.data.name && char.data.desc){
                returnOptions.push({
                    label: `[${char.id}] ${betterLimitText(char.data.name, 100)}`,
                    description: `${betterLimitText(char.data.desc, 100)}`,
                    value: `${char.id}`,
                    emoji: {
                        id: null,
                        name: char.id == sChar ? "☑️" : char.data.emoji ?? '👤'
                    },
                    default: (() => {
                        if(char.id == defaultOption){
                            return true
                        }else{
                            return false
                        }
                    })()
                })
            }
        }
        return returnOptions
    },
    pageButtonsSelectMenu: (customId, placeholder, options, act, sPage = 0, data = '') => {
        let returnOptions = [{
            type: 'ACTION_ROW', 
            components: [
                {
                    type: 'SELECT_MENU',
                    customId: customId,
                    placeholder: placeholder,
                    options: options.slice(0+(sPage*25), 25*(sPage+1))
                }
            ],
        }]

        let act_row = {
            type: 'ACTION_ROW',
            components: []
        }
        
        if(options.length > 25){
            let pages = Math.floor(options.length/25)
            let start = sPage - 2 < 0 ? 0 : sPage - 2

            for(let page = start; page <= start+2; page++){
                if(page <= pages){
                    act_row.components.push({
                        type: 'BUTTON',
                        label: `${page+1}`,
                        customId: `page_${act}_${data}_${page}`,
                        style: (() => {
                            if(page == sPage){
                                return 'SUCCESS'
                            }else{
                                return 'PRIMARY'
                            }
                        })(),
                        disabled: (() => {if(page == sPage) return true})()
                    })
                }
            }
        }
        /* if(options.length > 25){
            let stage = Math.floor(options.length/25)
            for(let i = 0; i <= stage; i++){
                act_row.components.push({
                    type: 'BUTTON',
                    label: `${i+1}`,
                    customId: `page_${act}_${data}_${i}`,
                    style: (() => {
                        if(i == sPage){
                            return 'SUCCESS'
                        }else{
                            return 'PRIMARY'
                        }
                    })(),
                    disabled: (() => {if(i == sPage) return true})()
                })
            }
        } */
        if(act_row.components.length != 0) returnOptions.push(act_row)
        return returnOptions
    },
    ItemManager: (get, options, sourceItem, count) => {
        try{
            let {path, par, id, origin} = options

            let lItem = origin?.find(fItem => (!sourceItem.convar && fItem.id == sourceItem.id) || (sourceItem.convar && fItem.id == sourceItem.id && fItem.convar == sourceItem.convar))
            let itemId = origin?.indexOf(lItem) // находим предмет, среди исходника по id или, если есть, по convar

            if(!get){ // если отбираем, тогда предмет должен быть. Если предмет есть и количество, которые хотим отобрать, больше, то удаляем, иначе просто отнимаем
                if(!lItem) throw new Error(`Предмет не удалось найти`)

                if(!origin?.length){
                    throw new Error(`Контейнер пуст`)
                }else if(lItem){
                    if(lItem.count <= count){
                        origin.splice(itemId, 1)
                    }else{
                        lItem.count -= count
                    }
                }

                if(!origin?.length) origin = undefined
                EStats(`${path}`, id, par, [origin])
                return true
            }else if(get){ // если получаем, то, если нет инвентаря - создаем, используя исходник, если нет предмета - добавляем, если предмет есть изменяем
                if(!origin?.length){
                    origin = [{id: sourceItem.id, convar: sourceItem.convar, count: count}]
                }else if(!lItem){
                    origin.push({id: sourceItem.id, convar: sourceItem.convar, count: count})
                }else{
                    lItem.count += count
                }

                if(origin?.length <= 25){
                    try{
                        if(!origin?.length) origin = undefined
                        EStats(`${path}`, id, par, [origin])
                        return true
                    }catch(error){
                        console.log(error)
                        throw new Error(`Контейнер переполнен`)
                    }
                }else{
                    throw new Error(`Контейнер полон`)
                }
            }
        }catch(error){
            console.log(error)
            return new Error(`${error.message}`)
        }
    },
    step: (guild, userId, charId, objects, targetObject, channelTargetObject, interaction, text) => {
        if(text) IAL.ReplyInteraction(interaction, {content: text, embeds: [], components: []})

        for(let [id, channel] of guild.channels.cache){
            let overwrites = channel.permissionOverwrites
            overwrites?.delete(userId)
        }
        channelTargetObject.permissionOverwrites.create(userId, {'VIEW_CHANNEL': true, 'SEND_MESSAGES': true}).then(() => {
            for(let [id, children] of channelTargetObject.children){
                children.permissionOverwrites.create(userId, {'VIEW_CHANNEL': true, 'SEND_MESSAGES': true})
            }
        })
        if(charId) EStats('ages/chars', charId, 'pos', [targetObject.id])

        for(let targetObjectRadius of targetObject.data.radius ?? []){
            let lObject = objects.find(object => object.id == targetObjectRadius.id)
            let addRooms = targetObjectRadius.rooms?.filter(fRoom => lObject.data.rooms.find(oRoom => oRoom.name == fRoom))

            if(addRooms){
                for(room of addRooms){
                    let channelRooms = guild.channels.cache.filter(channel => channel.name == toChannelName(room) && channel.parentId == lObject.data.cid)
                    for(let [id, channel] of channelRooms){
                        channel.permissionOverwrites.create(userId, {'VIEW_CHANNEL': true, 'SEND_MESSAGES': true})
                    }
                }
            }
        }
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
        Discord, client, REST, Routes,
        Config, prefix, timeOfDelete,
        guildBase:guild, guildAges, guildBD, 
        rpGuilds, cmdParametrs, getMessages, emojiURL, toChannelName, editFirstChar, betterLimitText, random,
        getRoleId, haveRole, giveRole, removeRole,
        sendLog, createLore, createEx,
        createCom, SlashCom, IAL, BDunit,
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
        if(onlinemember.toString().slice(-1) == '1'){
            endword = 'а'
        }else{
            endword = 'ов'
        }

        if (onlinemember > 0){
            client.user.setPresence({
              status: "online",
              activities: [{
                  name: `на ${onlinemember} участник${endword} 👥`,
                  type: "WATCHING",
              }]
            })
        }else if (!onlinemember){
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
    var cA = haveRole(guild, message.author.id, "[A]"),
        cB = haveRole(guild, message.author.id, "[B]"),
        cC = haveRole(guild, message.author.id, "[C]")
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
        let arg = parseInt(command.splitArg[0])+1
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

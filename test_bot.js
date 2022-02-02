const getUnicode = require('emoji-unicode')
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

var guild
var guildAges
var guildBD
var rpGuilds = [Config.guilds.ages]

function random(min, max) {
    let rand = min + Math.random() * (max + 1 - min);
    return Math.floor(rand);
}

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
        client.application.commands.create(data, cguildId)
    }else if(type == 'create' && permissions != undefined && command == undefined){
        client.application.commands.create(data, cguildId).then((cmd) => {
            client.application.commands.permissions.add({ guild: cguildId, command: cmd.id, permissions: permissions})
        })
    }else if(type == 'del' && command != undefined){
        command.delete()
    }else if(type == 'edit' && command != undefined){
        client.application.commands.edit(command.id, data, cguildId)
    }else if(type == 'perm' && command != undefined){
        client.application.commands.permissions.add({ guild: cguildId, command: command.id, permissions: permissions})
    }else{return}
} 

var guild;

client.on('ready', () => {
    console.log(`${client.user.tag} ready!`)
    guild = client.guilds.cache.get('840180165665619998')
    guildBD = client.guilds.cache.get(Config.guilds.BD)

    SlashCom('edit', 'взлом', {
        name: 'взлом',
        description: 'Система взлома замков',
        options: [
            {
                type: 'NUMBER',
                name: 'пины',
                description: 'Количество пинов',
                required: true
            },
            {
                type: 'NUMBER',
                name: 'ряды',
                description: 'Количество рядов',
                required: true
            },
            {
                type: 'NUMBER',
                name: 'стадии',
                description: 'Количество стадий',
                required: true
            },
            {
                type: 'NUMBER',
                name: 'время',
                description: 'Время на один пин (в секундах)',
                required: false
            },
        ]
    }, '840180165665619998')

    SlashCom('wait', 'Репорт', {
        name: 'Репорт',
        description: '',
        type: 'MESSAGE',
        defaultPermission: false
    }, '840180165665619998')

    SlashCom('wait', 'Заплатить', {
        name: 'Заплатить',
        description: '',
        type: 'USER',
        defaultPermission: false,
    }, '840180165665619998')

    SlashCom('wait', 'инвентарь', {
        name: 'инвентарь',
        description: 'Показывает текущий инвентарь',
        type: 'CHAT_INPUT'
    }, '840180165665619998')

    SlashCom('create', 'test', {
        name: 'test',
        description: 'test',
        type: 'CHAT_INPUT',
        options: [
            {
                type: 'CHANNEL',
                name: 'test',
                description: 'test',
                required: true
            },
        ]
    }, '840180165665619998')

    SlashCom('wait', 'auto', {
        name: 'auto',
        description: 'auto',
        type: 'CHAT_INPUT',
        options: [
            {
                type: 'STRING',
                name: 'test',
                autocomplete: true,
                description: 'test',
                required: true
            },
        ]
    }, '840180165665619998')

    SlashCom('edit', 'действия', {
        name: 'действия',
        description: 'Ролевые действия через чат',
        type: 'CHAR_INPUT',
        options: [
            {
                type: 'SUB_COMMAND',
                name: 'do',
                description: 'Действие от первого лица',
                //required: false,
            },
            {
                type: 'SUB_COMMAND',
                name: 'todo',
                description: 'Действие от первого лица',
                //required: false,
            },
        ],
    }, '840180165665619998')
})

function comps(count, rows, user){
    var comps = []

    for (let r = 0; r < rows; r++){
        comps.push({
            type: 'ACTION_ROW',
            components: []
        })
        for (let i = 0; i < count; i++){
            comps[r].components.push({
                type: 'BUTTON',
                label: ' ',
                customId: `lockpickButton_${r}-${i}_${user}`,
                style: ['PRIMARY', 'SECONDARY'][(random(0,1))],
            })
        }
    }
    let randomRowId = random(0, comps.length-1)
    let randomCompId = random(0, comps[randomRowId].components.length-1)
    comps[randomRowId].components[randomCompId].style = 'DANGER'

    return comps
}

var objects = eval(
    [
        {
            "id": "1",
            "data": {
                "name": "Тест-комната",
                "open": true,
                "radius": ['2'],
                "rooms": ['Внутри1']
            }
        },
        {
            "id": "2",
            "data": {
                "name": "Тест-комната",
                "open": true,
                "radius": ['1'],
                "rooms": ['Внутри2']
            }
        },
        {
            "id": "3",
            "data": {
                "name": "Тест-комната",
                "open": true,
                "radius": [],
                "rooms": ['Внутри3']
            }
        },
    ]
)

var items = eval([
    {
      id: '1',
      data: {
        codename: 'beer',
        name: 'Пиво',
        description: 'Жидкое золото',
        emoji: '🍻',
        func: "(function(){console.log('test')})"
      },
      mid: '926858121861804062'
    }
])

var invent = [
    {
        id: 0,
        codename: 'clown',
        count: 1
    },
    {
        id: 1,
        codename: 'beer',
        count: 1
    },
]

function joinItems(inv){
    let returnItems = []
    for (let lItem of inv){
        let gItem = items.find(fItem => fItem.data.codename == lItem.codename)
        if(gItem != undefined){
            returnItems.push({
                label: `${gItem.data.name} (x${lItem.count})`,
                description: gItem.data.description,
                value: `${lItem.id}`,
                emoji: {
                    id: null,
                    name: `${gItem.data.emoji}`
                }
            })
        }
    }
    return returnItems
}

var lockpickCache = new Map()

client.on('ready', () => {
    
})

/* client.on('messageCreate', () => {
    for (let object of objects){
        let cat = client.channels.cache.find(cat => cat.type == 'GUILD_CATEGORY' && cat.name == object.data.name && object.cid != undefined)
        if(cat == undefined){
            guild.channels.create(object.data.name, {
                type: 'GUILD_CATEGORY'
            }).then((cat) => {
                for (let room of object.data.rooms){
                    guild.channels.create(room, {
                        type: 'GUILD_TEXT',
                        parent: cat
                    })
                    object.cid = cat.id
                }
            })
        }else{console.log('уже есть')}
    }
    setTimeout(() => {console.log(objects)}, 3000)
}) */

client.on('interactionCreate', async interaction => {
    var ping = client.ws.ping

    if(interaction.isAutocomplete()){
        let t = [
            {
                name: 'Владик',
                value: 'vlad'
            },
            {
                name: 'Брофсс',
                value: 'kostya'
            },
            {
                name: 'Петри',
                value: 'ilia'
            },
        ]

        if(interaction.member.nickname == 'admin'){
            t.push({
                name: 'админская-функция',
                value: 'admin'
            })
        }

        interaction.respond(t)
        
    }

    if(interaction.isContextMenu()){
        interaction.reply({
            content: '> Выбери сумму, которую хочешь отправить 💵',
            ephemeral: true,
            components: [
                {
                    type: 'ACTION_ROW',
                    components: [
                        {
                            type: 'BUTTON',
                            label: '10',
                            customId: `givemoney_10_${interaction.targetId}`,
                            style: 'SUCCESS'
                        },
                        {
                            type: 'BUTTON',
                            label: '50',
                            customId: `givemoney_50_${interaction.targetId}`,
                            style: 'SUCCESS'
                        },
                        {
                            type: 'BUTTON',
                            label: '100',
                            customId: `givemoney_100_${interaction.targetId}`,
                            style: 'SUCCESS'
                        },
                    ]
                }
            ]
        })
    }

    if(interaction.isCommand()){
        if(interaction.commandName == 'взлом'){
            console.log(!lockpickCache.has(interaction.user.id))
            if(!lockpickCache.has(interaction.user.id)){
                let count = interaction.options.get('стадии').value
                let pins = interaction.options.get('пины').value
                let rows = interaction.options.get('ряды').value
                let time
                if(interaction.options.get('время') != undefined){
                    time = interaction.options.get('время').value*1000
                }else{
                    time = 180*5
                }
                if(pins > 5) pins = 5
                if(rows > 5) rows = 5

                

                //interaction.deferReply()
                //setTimeout(() => {
                    interaction.reply({
                        content: `> Процесс взлома 🔓`,
                        embeds: [
                        {
                            description: `Для успешного взлома вам следует успеть нажать на красный пин за опредленное время. При нажитии на другой цвет, процесс будет завершен неудачей.\n\n**[0/${count}]**`,
                            thumbnail: {url: `https://twemoji.maxcdn.com/v/13.1.0/72x72/1f50f.png`},
                            color: '#ED4245'
                        }],
                        components: comps(pins, rows, interaction.user.id)
                    }).then(console.log(new Date().getUTCMilliseconds() + ": открытие"))
                    lockpickCache.set(interaction.user.id, {steps: 0, count: count, pins: pins, rows: rows, time: time})
                //}, 1000)
            }else{
                interaction.reply({content: '> Вы уже начали взлом! 🔏', ephemeral: true})
            }
        }

        if(interaction.commandName == 'инвентарь'){
            interaction.reply({
                content: '> Ваш инвентарь 💼',
                components: [
                    {
                        type: 'ACTION_ROW', 
                        components: [
                            {
                                type: 'SELECT_MENU',
                                customId: `invent_${interaction.user.id}_open`,
                                placeholder: 'Ваши предметы...',
                                options: joinItems(invent)
                            }
                        ]
                    }
                ]
            })
        }
    }

    if(interaction.isSelectMenu()){
        if(interaction.customId.split('_')[0] == 'invent' && interaction.customId.split('_')[2] == 'open'){
            let item = items.find(fItem => fItem.data.codename == invent.find(item => item.id == interaction.values[0]).codename)

            console.log(item)
            let emoji = getUnicode(item.data.emoji).split(' ').join('-')

            interaction.update({
                content: '> Ваш инвентарь 💼',
                embeds: [
                    {
                        author: {name: `${item.data.name}` },
                        description: item.data.description,
                        thumbnail: {url: `https://twemoji.maxcdn.com/v/13.1.0/72x72/${emoji}.png`}
                    }
                ],
                components: [
                    {
                        type: 'ACTION_ROW',
                        components: [
                            {
                                type: 'BUTTON',
                                label: 'Использовать',
                                customId: `invent_${interaction.customId.split('_')[1]}_use`,
                                style: 'PRIMARY'
                            },
                            {
                                type: 'BUTTON',
                                label: 'Передать',
                                customId: `invent_${interaction.customId.split('_')[1]}_trade`,
                                style: 'SUCCESS'
                            },
                            {
                                type: 'BUTTON',
                                label: 'Вернуться',
                                customId: `invent_${interaction.customId.split('_')[1]}_back`,
                                style: 'SECONDARY'
                            },
                            {
                                type: 'BUTTON',
                                label: 'Закрыть',
                                customId: `invent_${interaction.customId.split('_')[1]}_close`,
                                style: 'DANGER'
                            }
                        ]
                    }
                ]
            })
        }
    }

    if(interaction.isButton()){
        if(interaction.customId.split('_')[0] == 'invent' && interaction.customId.split('_')[2] == 'close'){
            interaction.update({components: []}).then(() => {
                interaction.deleteReply()
            })
        }
        if(interaction.customId.split('_')[0] == 'invent' && interaction.customId.split('_')[2] == 'back'){
            interaction.update({
                content: '> Ваш инвентарь 💼',
                embeds: [],
                components: [
                    {
                        type: 'ACTION_ROW',
                        components: [
                            {
                                type: 'SELECT_MENU',
                                customId: `invent_${interaction.user.id}_open`,
                                placeholder: 'Ваши предметы...',
                                options: joinItems(invent)
                            }
                        ],
                    }
                ]
            })
        }
        if(interaction.customId.split('_')[0] == 'invent' && interaction.customId.split('_')[2] == 'use'){
            interaction.update({components: []}).then(() => {
                interaction.deleteReply()
            })
        }

        if(interaction.customId.split('_')[0] == 'givemoney'){
            client.users.cache.find(user => user.id == interaction.customId.split('_')[2]).send(`> ${interaction.user.username} передал вам ${interaction.customId.split('_')[1]} коинов 💵`)
            interaction.update({content: `> Вы успешно передали сумму денег 💵`, components: []})
        }
        if(interaction.customId.split('_')[0] == 'lockpickButton'){
            function breaking(){
                let data = lockpickCache.get(interaction.user.id)

                if(data != undefined && interaction.user.id == interaction.customId.split('_')[2]){
                    if(interaction.component.style == 'PRIMARY'){
                        clearTimeout(data.timer)
                        interaction.update({content: '> Взлом не удался! 🔴', components: [], embeds: []}).then(() => {
                            lockpickCache.delete(interaction.user.id)
                        })
                        return
                    }
                    if(interaction.component.style == 'DANGER'){
                        clearTimeout(data.timer)
                        data.steps += 1

                        if(data.steps < data.count){
                            interaction.update({
                                content: `> Процесс взлома 🔓`,
                                embeds: [
                                {
                                    description: `Для успешного взлома вам следует успеть нажать на красный пин за опредленное время. При нажитии на другой цвет, процесс будет завершен неудачей.\n\n**[${data.steps}/${data.count}]**`,
                                    thumbnail: {url: `https://twemoji.maxcdn.com/v/13.1.0/72x72/1f50f.png`},
                                    color: '#ED4245'
                                }],
                                components: comps(data.pins, data.rows, interaction.user.id)
                            }).then(() => {
                                data.timer = setTimeout(() => {
                                    lockpickCache.delete(interaction.user.id)
                                    interaction.editReply({content: '> Взлом не удался! Закончилось время 🕐', components: [], embeds: []})
                                    return
                                }, data.time+ping)
                            })
                        }else{
                            interaction.update({content: '> Взлом удался! 🟢', components: [], embeds: []}).then(() => {
                                lockpickCache.delete(interaction.user.id)
                            })
                            return
                        }
                    }
                }else if(data == undefined && interaction.user.id == interaction.customId.split('_')[2]){
                    interaction.update({content: '> Взлом не удался! Закончилось время 🕐', components: [], embeds: []})
                    return
                }else if(interaction.user.id != interaction.customId.split('_')[2]){
                    interaction.reply({content: '> Не вмешивайся в чужое пространтсво! 🛑', ephemeral: true})
                    return
                }
            }
            breaking()
        }
    }
})

client.login(Config.discordTocens.testBot)
const {
    Discord, client, REST, Routes,
    Config, prefix, timeOfDelete,
    guildBase, guildAges, guildBD, 
    rpGuilds, cmdParametrs, getMessages, emojiURL, toChannelName, editFirstChar, betterLimitText, random,
    getRoleId, haveRole, giveRole, removeRole,
    sendLog, createLore, createEx,
    createCom, SlashCom, IAL, BDunit,
    GStats, AStats, EStats,
    DStats, RPF} = require('../bot.js')

const guild = guildAges

console.log(`[bot-ages ready]`)

SlashCom('wait', 'инвентарь', {
    name: 'инвентарь',
    description: 'Показывает текущий инвентарь',
    type: 'CHAT_INPUT'
}, guild.id)

SlashCom('wait', 'осмотреть', {
    name: 'осмотреть',
    description: 'Позволяет осмотреть территорию вокруг, а также человека поблизости',
    type: 'CHAT_INPUT',
    options: [
        {
            type: 'USER',
            name: 'человек',
            description: 'Человек, которого следует осмотреть',
            required: false,
        }
    ],
}, guild.id)

SlashCom('wait', 'идти', {
    name: 'идти',
    description: 'Позволяет пройти в локацию, находящуюся в окружении',
    type: 'CHAT_INPUT',
}, guild.id)

SlashCom('wait', 'меню', {
    name: 'меню',
    description: 'Меню панели управления',
    type: 'CHAT_INPUT'
}, guild.id)

SlashCom('wait', 'self', {
    name: 'self',
    description: 'Действие от первого лица',
    type: 'CHAR_INPUT',
    options: [
        {
            type: 'STRING',
            name: 'действие',
            description: 'Опишите действие от первого лица',
            required: true,
        }
    ],
}, guild.id)

SlashCom('wait', 'do', {
    name: 'do',
    description: 'Действие от третьего лица, описание ситуации вокруг',
    type: 'CHAR_INPUT',
    options: [
        {
            type: 'STRING',
            name: 'описание',
            description: 'Опишите ситуацию вокруг',
            required: true,
        }
    ],
}, guild.id)

SlashCom('wait', 'todo', {
    name: 'todo',
    description: 'Действие совместно с фразой',
    type: 'CHAR_INPUT',
    options: [
        {
            type: 'STRING',
            name: 'действие',
            description: 'Опишите действие от первого лица',
            required: true,
        },
        {
            type: 'STRING',
            name: 'сообщение',
            description: 'Фраза, с которой происходит действие',
            required: true,
        },
    ],
}, guild.id)

SlashCom('wait', 'try', {
    name: 'try',
    description: 'Действие с вероятностью удачи',
    type: 'CHAR_INPUT',
    options: [
        {
            type: 'STRING',
            name: 'действие',
            description: 'Опишите действие от первого лица',
            required: true,
        }
    ],
}, guild.id)

SlashCom('wait', 'roll', {
    name: 'roll',
    description: 'Случайное число в выбранном диапазоне',
    type: 'CHAR_INPUT',
    options: [
        {
            type: 'NUMBER',
            name: 'максимально',
            description: 'Максимальное число, по стандарту 100',
            required: false,
        }
    ],
}, guild.id)

SlashCom('edit', 'looc', {
    name: 'looc',
    description: 'Отправить локальное неролевое сообщение',
    type: 'CHAR_INPUT',
    options: [
        {
            type: 'STRING',
            name: 'сообщение',
            description: 'Текст неролевого сообщения',
            required: true,
        }
    ],
}, guild.id)

client.on('messageCreate', message => { if(message.guild?.id == guild.id){
    var cA = haveRole(guildBase, message.author.id, "[A]"),
        cB = haveRole(guildBase, message.author.id, "[B]"),
        cC = haveRole(guildBase, message.author.id, "[C]")
    let mb = message.author.bot
    let dm = message.channel.type == "DM"
    let command = cmdParametrs(message.content)

    if(!mb && message.content == '!test'){
        RPF.createObjects("ages/objects", guild)
    }

    if(!mb && !dm) sendLog(message.member, message.channel, 'rp', 'Отправил сообщение', true, message.content)
}})

var LAST_INTERACTION = {
    interaction: undefined,
    user: undefined,
    timestamp: undefined
}

var PGF = {}

client.on('interactionCreate', async interaction => {
    if(interaction.guildId == guild.id) try{
        LAST_INTERACTION.interaction = interaction
        LAST_INTERACTION_spam = LAST_INTERACTION.user == interaction.user.id && (LAST_INTERACTION.timestamp == interaction.createdTimestamp || LAST_INTERACTION.timestamp + 1000 > interaction.createdTimestamp)

        if(LAST_INTERACTION_spam){
            let channel = interaction.channel
            await channel.permissionOverwrites.edit(interaction.user.id, {
                'SEND_MESSAGES': false,
            })
            setTimeout(() => {
                channel.permissionOverwrites.edit(interaction.user.id, {
                    'SEND_MESSAGES': true,
                })
            }, 10000)

            throw new Error("Успокойся...")
        }else{
            LAST_INTERACTION.user = interaction.user.id,
            LAST_INTERACTION.timestamp = interaction.createdTimestamp
        }

        //#7B2832
        var CGF = {
            invent: () => {
                console.log(interaction.id)
                let options = RPF.itemsSelectMenuOptions(char.data.items, items)
                if(!options.length) throw new Error("Ваш инвентарь пуст")

                IAL.ReplyInteraction(interaction, {
                    content: '> Ваш инвентарь 💼',
                    embeds: [],
                    components: [
                        {
                            type: 'ACTION_ROW', 
                            components: [
                                {
                                    type: 'SELECT_MENU',
                                    customId: `invent_open`,
                                    placeholder: 'Ваши предметы...',
                                    minValues: 1,
                                    maxValues: (() =>{
                                        if(options.length < 5){
                                            return options.length
                                        }else{
                                            return 5
                                        }
                                    })(),
                                    options: options
                                }
                            ]
                        }
                    ],
                    ephemeral: true
                })
            },
            inspect: () => {
                let options = RPF.itemsSelectMenuOptions(room.items, items)

                if(interaction.options?.get('человек')?.value){
                    let targetPlayer = players.find(fPlayer => fPlayer.data.user == interaction.options.get('человек')?.value)
                    if(!targetPlayer) throw new Error('Игрок не найден')

                    let targetChar = chars.find(fChar => fChar.id == targetPlayer.data.char)
                    if(!targetChar) throw new Error('Персонаж не найден')

                    if(targetChar.data.pos != char.data.pos && !object.data.radius?.find(fObject => fObject.id == targetChar.data.pos)?.rooms && !ADMIN) throw new Error('Персонаж находится на другой локации')

                    IAL.ReplyInteraction(interaction, {
                        content: '> Результат осмотра 👀',
                        embeds: [{
                            author: {name: `[${targetChar.id}] ${betterLimitText(targetChar.data.name, 100)}`},
                            description: targetChar.data.desc,
                            thumbnail: {url: emojiURL(targetChar.data.emoji ?? '👤')},
                            color: 'RANDOM',
                        }],
                        ephemeral: true
                    })
                }else{
                    IAL.ReplyInteraction(interaction, {
                        content: '> Результат осмотра 👀',
                        embeds: [
                            {
                                description: `> **Радиус** 🔘\n${
                                    (() => {
                                        let returnRadius = ''
                                        for(let i = 0; i < object.data.radius.length; i++){
                                            let radiusObject = objects.find(fObject => fObject.id == object.data.radius[i].id)
                                            if(returnRadius == ''){
                                                returnRadius = radiusObject.data.name
                                            }else if(i % 3 == 0){
                                                returnRadius += `,\n${radiusObject.data.name}`
                                            }else{
                                                returnRadius += `, ${radiusObject.data.name}`
                                            }
                                        }
                                        return returnRadius
                                    })()
                                }`,
                                color: '#ED7642'
                            }
                        ],
                        components: (() => {
                            if(options.length != 0){
                                return [{
                                    type: 'ACTION_ROW', 
                                    components: [
                                        {
                                            type: 'SELECT_MENU',
                                            customId: `invent_pick`,
                                            placeholder: 'Предметы...',
                                            minValues: 1,
                                            maxValues: (() =>{
                                                if(options.length < 5){
                                                    return options.length
                                                }else{
                                                    return 5
                                                }
                                            })(),
                                            options: options
                                        }
                                    ]
                                }]
                            }
                        })(),
                        ephemeral: true
                    })
                }
            },
            walk: (page = 0) => {
                if(char.data.pos != object.id && char.data.pos) throw new Error(`Вы находитесь вне объекта, в котором находитесь (**${objects.find(object => object.id == char.data.pos)?.data.name ?? "Неизвестно"}**). Вы очень похожи на кота Шрёдингера 🐈‍⬛`)
                
                let options = RPF.objectsSelectMenuOptions(object, objects, true, false)
                if(!options.length) throw new Error("Объектов поблизости нет")

                let components = RPF.pageButtonsSelectMenu('walk_select', 'Объекты...', options, 'walk', page)
                
                IAL.ReplyInteraction(interaction, {
                    content: '> Выберите направление 🚶',
                    embeds: [],
                    components: components,
                    ephemeral: true
                })
            },
            tpUser: (page = 0) => {
                let options = RPF.charsSelectMenuOptions(chars, player.data.char)
                if(!options.length) throw new Error("Персонажей нет")

                let components = RPF.pageButtonsSelectMenu(`tp_user`, 'Персонажи...', options, 'tpUser', page)

                components.push({
                    type: 'ACTION_ROW',
                    components: [
                        {
                            type: 'BUTTON',
                            label: 'Выбрать себя',
                            customId: `tp_user_self_global`,
                            style: 'PRIMARY'
                        }
                    ]
                })
                
                IAL.ReplyInteraction(interaction, {
                    content: '> Выберите человека 🛸',
                    embeds: [],
                    components: components,
                    ephemeral: true
                })
            },
            char: (page = 0) => {
                let options = RPF.charsSelectMenuOptions(player.data.chars, player.data.char, chars)
                    
                let createButton = {
                    type: 'ACTION_ROW',
                    components: [
                        {
                            type: 'BUTTON',
                            label: 'Создать',
                            customId: 'char_create',
                            style: 'PRIMARY'
                        }
                    ]
                }

                let components
                if(!(player.data.chars?.length ?? 0)){
                    components = [createButton]
                }else{
                    if(!options.length){
                        throw new Error('Персонажи отсутствуют')
                    }else if((player.data.limit ?? 1) > (player.data.chars?.length ?? 0)){
                        components = RPF.pageButtonsSelectMenu('char_select', 'Персонажи...', options, 'char', page)
                        components.splice(1, 0, createButton)
                    }else{
                        components = RPF.pageButtonsSelectMenu('char_select', 'Персонажи...', options, 'char', page)
                    }
                }

                IAL.ReplyInteraction(interaction, {
                    content: '> Ваши персонажи 👥',
                    embeds: [],
                    components: components,
                    ephemeral: true
                })
            },
            admin: () => {
                let pass = cA || cB || cC
                console.log(ADMIN)
                
                if(ADMIN){
                    removeRole(interaction.member, getRoleId(guild, 'Admin-Mode'))
                    IAL.ReplyInteraction(interaction, {content: '> Вы **отключили** Админ-мод ⚒', embeds: [], components: []})
                    if(object) RPF.step(guild, interaction.user.id, char.id, objects, object, interaction.channel.parent)
                }else if(!ADMIN && pass){
                    giveRole(interaction.member, getRoleId(guild, 'Admin-Mode'))
                    IAL.ReplyInteraction(interaction, {content: '> Вы **включили** Админ-мод ⚒', embeds: [], components: []})
                }else{
                    throw new Error("Интересно... Правда?")
                }
            },
            sendEmote: (text, color) => {
                IAL.ReplyInteraction(interaction, {embeds: [
                    {   
                        description: text,
                        color: color,
                    }
                ]})
            },
            keyUse: (page = 0) => {
                let options = RPF.charsSelectMenuOptions(chars)
                if(!options.length) throw new Error("Объектов поблизости нет")

                let components = RPF.pageButtonsSelectMenu(`invent_key_${data}`, 'Объекты...', options, 'keyUse', page, data)
                
                IAL.ReplyInteraction(LAST_INTERACTION.interaction, {
                    content: `> Выберите объект ${LAST_INTERACTION.interaction.id} 🏘`,
                    embeds: [],
                    components: components
                })
            }
        }
        Object.assign(CGF, PGF)

        //#C6DE55
        var cA = haveRole(guildBase, interaction.user.id, "[A]"),
            cB = haveRole(guildBase, interaction.user.id, "[B]"),
            cC = haveRole(guildBase, interaction.user.id, "[C]")

        var ADMIN = haveRole(guild, interaction.user.id, 'Admin-Mode')

        var type = interaction.customId?.split('_')[0]
        var act = interaction.customId?.split('_')[1]
        var data = interaction.customId?.split('_')[2]
        var add = interaction.customId?.split('_')[3]
        var COMMAND = interaction.commandName

        console.log(`${type}: ${act} - ${COMMAND}\n`)

        var values = interaction.values
        var value = values?.[0]

        var pass = ((type == 'char' || COMMAND == 'персонажи') || (type == 'gmenu' && act == 'char' || COMMAND == 'меню') || type == 'page') && !interaction.channel.parent.position
        
        var objects = await GStats("ages/objects")
        if(!objects) throw new Error("Объекты отсутствуют")

        var object = objects.find(object => object.data.cid == interaction.channel.parentId)
        if(!object && !pass) throw new Error("Функция используется вне ролевого поля")

        var roomId = parseInt(interaction.channel.topic)
        var room = object?.data.rooms[roomId]
        if(!room && !pass) throw new Error("Функция используется вне ролевого поля")

        var items = await GStats("ages/items")
        if(!items) throw new Error("Предметы отсутствуют")

        var players = await GStats("ages/players")
        if(!players) throw new Error("Игроки отсутствуют")

        var player = players.find(player => player.data.user == interaction.user.id)
        if(!player) throw new Error("Игрок отсутствует")

        var chars = await GStats("ages/chars")
        if(!chars) throw new Error("Персонажи отсутствуют")

        var char = chars.find(char => char.id == player.data.char && player.data.chars?.find(fChar => fChar == char.id))
        if(!char && !pass) throw new Error("Персонаж отсутствует")

        //#55DEC9
        if(interaction.isCommand()){
            if(COMMAND == 'инвентарь'){
                CGF.invent()
            }else if(COMMAND == 'осмотреть'){
                CGF.inspect()
            }else if(COMMAND == 'идти'){
                CGF.walk()
            }else if(['self', 'do', 'todo', 'try', 'roll', 'looc'].find(fCommand => fCommand == COMMAND)){
                let act = interaction.options.get('действие')?.value
                let desc = interaction.options.get('описание')?.value
                let message = interaction.options.get('сообщение')?.value
                let count = interaction.options.get('максимально')?.value ?? 100
                
                if(COMMAND == 'self'){
                    CGF.sendEmote(`*${interaction.member.nickname} ${editFirstChar(act, false)}.*`, '#4AE85D')
                }else if(COMMAND == 'do'){
                    CGF.sendEmote(`*${editFirstChar(desc, true)}* (**${interaction.member.nickname}**)`, '#4ABDE8')
                }else if(COMMAND == 'try'){
                    CGF.sendEmote(`*${interaction.member.nickname} ${editFirstChar(act, false)}* (**${['удачно','неудачно'][random(0,1)]}**)`, '#EAF449')
                }else if(COMMAND == 'roll'){
                    CGF.sendEmote(`*${interaction.member.nickname} получает **${random(0, count)} из ${count}***`, '#DF3B3B')
                }else if(COMMAND == 'todo'){
                    CGF.sendEmote(`*${interaction.member.nickname} ${editFirstChar(act, false)}* – сказав, ${message}`, '#B05299')
                }else if(COMMAND == 'looc'){
                    CGF.sendEmote(`||\`${message}\`||`, '#4D4747')
                }
            }else if(COMMAND == 'меню'){
                let list_Buttons = [
                    {
                        type: 'BUTTON',
                        label: 'Персонажи',
                        customId: 'gmenu_char',
                        style: 'PRIMARY',
                        emoji: {
                            id: null,
                            name: "👥"
                        }
                    },
                ]

                let list_CA_Buttons = [
                    
                ]

                let list_CB_Buttons = [
                    
                ]

                let list_CC_Buttons = [
                    {
                        type: 'BUTTON',
                        label: 'Админ-мод',
                        customId: 'gmenu_admin',
                        style: 'DANGER',
                        emoji: {
                            id: null,
                            name: "⚒"
                        }
                    }
                ]

                let list_Admin_Buttons = [
                    {
                        type: 'BUTTON',
                        label: 'Телепорт',
                        customId: 'gmenu_tpUser',
                        style: 'SUCCESS',
                        emoji: {
                            id: null,
                            name: "🛸"
                        }
                    }
                ]

                if(haveRole(guildBase, interaction.user.id, '[A]')){
                    list_Buttons = list_Buttons.concat(list_CA_Buttons)
                    list_Buttons = list_Buttons.concat(list_CB_Buttons)
                    list_Buttons = list_Buttons.concat(list_CC_Buttons)
                }

                if(haveRole(guildBase, interaction.user.id, '[B]')){
                    list_Buttons = list_Buttons.concat(list_CC_Buttons)
                    list_Buttons = list_Buttons.concat(list_CC_Buttons)
                }

                if(haveRole(guildBase, interaction.user.id, '[C]')){
                    list_Buttons = list_Buttons.concat(list_CC_Buttons)
                }

                if(haveRole(guild, interaction.user.id, 'Admin-Mode')){
                    list_Buttons = list_Buttons.concat(list_Admin_Buttons)
                }

                list_Buttons = Array.from(new Set(list_Buttons))

                let rows = Math.floor(list_Buttons.length/5)
                let components = []

                for(let row = 0; row <= rows; row++){
                    let actionRow = {
                        type: 'ACTION_ROW',
                        components: []
                    }

                    for(let button = row * 5; button <= ((row + 1) * 5) - 1; button++){
                        if(list_Buttons.length > button) actionRow.components.push(list_Buttons[button])
                    }
                    components.push(actionRow)
                }

                interaction.reply({
                    content: '> Меню панели управления 📟',
                    embeds: [
                        {
                            title: `Что такое панель управления?`,
                            description: `Панель управления это специальная функция Pushpin, которая позволяет быстро работать со всеми второстепенными возможностями игрового процесса.`,
                            color: 'RANDOM',
                            thumbnail: {url: emojiURL('📟')}
                        }
                    ],
                    components: components,
                    ephemeral: true
                })
            }
        }

        //#556FDE
        if(interaction.isUserContextMenu()){
            
        }

        //#DE6255
        if(interaction.isSelectMenu() || add == 'global'){
            if(type == 'invent' && act == 'open'){
                let gItems = []
                let charItems = []
                let embeds = []

                let options = RPF.itemsSelectMenuOptions(char.data.items, items)
                if(options.length == 0) throw new Error("Ваш инвентарь пуст")

                for(let value of values){
                    value = value.split('-') //id и convar

                    let gItem = items.find(fItem => fItem.id == value[0])
                    if(!gItem) throw new Error("Предмет не удалось найти среди глобальных предметов")
                    gItems.push(gItem)

                    let charItem = char.data.items?.find(item => (!value[1] && item.id == gItem.id) || (value[1] && item.id == gItem.id && item.convar == value[1]))
                    if(!charItem) throw new Error("Предмет не удалось найти среди вашего инвентаря")
                    charItems.push(charItem)

                    embeds.push({
                        author: {name: `[${gItem.id}] ${gItem.data.name} ${`(x${charItem.count?.toLocaleString('en')})` ?? ""}`},
                        description: gItem.data.desc,
                        thumbnail: {url: emojiURL(gItem.data.emoji ?? '📦')},
                        color: gItem.data.color ?? Config.itemTypes[gItem.data.type]?.color ?? 'RANDOM'
                    })
                }

                let itemComponents = [
                    {
                        type: 'BUTTON',
                        label: 'Использовать',
                        customId: `invent_use_${values.join(';')}`,
                        style: 'PRIMARY'
                    },
                    {
                        type: 'BUTTON',
                        label: 'Передать',
                        customId: `invent_trade_${values.join(';')}`,
                        style: 'SUCCESS'
                    },
                    {
                        type: 'BUTTON',
                        label: 'Выбросить',
                        customId: `invent_drop_${values.join(';')}`,
                        style: 'DANGER'
                    }
                ]

                if(values.length > 1 || !Config.itemTypes[gItems[0].data.type].usable) itemComponents[0].disabled = true

                interaction.update({
                    content: '> Ваш инвентарь 💼',
                    embeds: embeds,
                    components: [
                        {
                            type: 'ACTION_ROW', 
                            components: [
                                {
                                    type: 'SELECT_MENU',
                                    customId: `invent_open`,
                                    placeholder: 'Ваши предметы...',
                                    minValues: 1,
                                    maxValues: (() =>{
                                        if(options.length < 5){
                                            return options.length
                                        }else{
                                            return 5
                                        }
                                    })(),
                                    options: options
                                }
                            ]
                        },
                        {
                            type: 'ACTION_ROW',
                            components: itemComponents
                        },
                    ]
                })
            }else if(type == 'invent' && act == 'pick'){
                let gItems = []
                let roomItems = []
                let embeds = []

                let options = RPF.itemsSelectMenuOptions(room.items, items)
                if(options.length == 0) throw new Error("Комната пуста")
                
                for(let value of values){
                    value = value.split('-') //id и convar

                    let gItem = items.find(fItem => fItem.id == value[0])
                    if(!gItem) throw new Error("Предмет не удалось найти среди глобальных предметов")
                    gItems.push(gItem)

                    let roomItem = room.items?.find(item => (!value[1] && item.id == gItem.id) || (value[1] && item.id == gItem.id && item.convar == value[1]))
                    if(!roomItem) throw new Error("Предмет не удалось найти среди комнаты")
                    roomItems.push(roomItem)

                    embeds.push({
                        author: {name: `[${gItem.id}] ${gItem.data.name} ${`(x${roomItem.count?.toLocaleString('en')})` ?? ""}`},
                        description: gItem.data.desc,
                        thumbnail: {url: emojiURL(gItem.data.emoji ?? '📦')},
                        color: gItem.data.color ?? Config.itemTypes[gItem.data.type]?.color ?? 'RANDOM'
                    })
                }

                interaction.update({
                    content: '> Предметы 📦',
                    embeds: embeds,
                    components: [
                        {
                            type: 'ACTION_ROW', 
                            components: [
                                {
                                    type: 'SELECT_MENU',
                                    customId: `invent_pick`,
                                    placeholder: 'Предметы...',
                                    minValues: 1,
                                    maxValues: (() =>{
                                        if(options.length < 5){
                                            return options.length
                                        }else{
                                            return 5
                                        }
                                    })(),
                                    options: options
                                }
                            ]
                        },
                        {
                            type: 'ACTION_ROW',
                            components: [
                                {
                                    type: 'BUTTON',
                                    label: 'Взять',
                                    customId: `invent_take_${values.join(';')}`,
                                    style: 'SUCCESS'
                                }
                            ]
                        },
                    ]
                })
            }else if(type == 'invent' && act == 'key'){
                let object = objects.find(object => object.id == value)
                if(!object) throw new Error("Объект не найден")

                let gItem = items.find(fItem => fItem.id == data)
                if(!gItem) throw new Error("Предмет не удалось найти")

                let lItem = char.data.items.find(fItem => fItem.id == gItem.id)
                if(!lItem) throw new Error("Предмет не удалось найти")
                
                if(object.data.status){
                    if(lItem.convar == object.id){
                        interaction.update({content: `> Процесс... 🔐`, embeds: [], components: []})
                        setTimeout(() => {
                            try{
                                if(object.data.status.open){
                                    interaction.editReply({content: `> Вы закрыли объект 🔒`})
                                    EStats("ages/objects", object.id, "status.open", [false])
                                }else if(!object.data.status.open){
                                    interaction.editReply({content: `> Вы открыли объект 🔓`})
                                    EStats("ages/objects", object.id, "status.open", [true])
                                }
                            }catch(error){
                                IAL.ErrorInteraction(interaction, error, true)
                            }
                        }, 2500)
                    }else{
                        interaction.update({content: `> Ключ не подходит к объекту 🔐`, embeds: [], components: []})
                    }
                }else{
                    interaction.update({content: `> Этот объект невозможно закрыть ⛔`, embeds: [], components: []})
                }
            }else if(type == 'walk' && act == 'select'){
                let targetObject = objects.find(object => object.id == value)
                if(!targetObject) throw new Error("Объект не найден")
                
                let channelTargetObject = guild.channels.cache.get(targetObject.data.cid)
                if(!channelTargetObject) throw new Error("Объект не найден")

                interaction.update({content: `> Процесс... 🚶`, embeds: [], components: []})
                setTimeout(() => {
                    try{
                        function walk(){
                            RPF.step(guild, interaction.user.id, char.id, objects, targetObject, channelTargetObject, interaction, `> Вы успешно перешли в **${channelTargetObject.name}** 🚶`)
                        }

                        if(!object.data.status){
                            walk()
                        }else if(!object.data.status?.open && !targetObject.data.status?.ex?.find(ex => ex == object.id)){
                            throw new Error("Ваш объект закрыт")
                        }else if(!targetObject.data.status){
                            walk()
                        }else if(targetObject.data.status?.open){
                            walk()
                        }else if(targetObject.data.status?.ex?.find(ex => ex == object.id)){
                            walk()
                        }else{
                            throw new Error("Объект закрыт")
                        }
                    }catch(error){
                        IAL.ErrorInteraction(interaction, error, true)
                    }
                }, 2500)
            }else if(type == 'tp' && act == 'user'){
                if(!PGF.tpSelect) PGF.tpSelect = (page = 0) => {
                    let selectUserId = value ?? interaction.user.id

                    let options = RPF.objectsSelectMenuOptions(object, objects, false, selectUserId != interaction.user.id)
                    if(options.length == 0) throw new Error("Объектов")

                    let components = RPF.pageButtonsSelectMenu(`tp_select_${selectUserId}`, 'Объекты...', options, 'tpSelect', page, selectUserId)
                    
                    IAL.ReplyInteraction(interaction, {
                        content: '> Выберите направление 🛸',
                        embeds: [],
                        components: components,
                        ephemeral: true
                    })
                }
                Object.assign(CGF, PGF)
                CGF.tpSelect()
            }else if(type == 'tp' && act == 'select'){
                let char = chars.find(char => char.id == data)
                if(!char) throw new Error("Персонаж не найден")

                let targetPlayer = players.find(player => player.data.char == char.id)
                if(!targetPlayer) throw new Error("Игрок не найден")

                let targetObject = objects.find(object => object.id == value)
                if(!targetObject) throw new Error("Объект не найден")
                
                let channelTargetObject = guild.channels.cache.get(targetObject.data.cid)
                if(!channelTargetObject) throw new Error("Объект не найден")

                RPF.step(guild, targetPlayer.data.user, char.id, objects, targetObject, channelTargetObject, interaction, `> ${player.data.user == data ? `Вы успешно перелетели в` : `Вы успешно подбросили человека в`} **${channelTargetObject.name}** 🛸`)
            }else if(type == 'char' && act == 'select'){
                let options = RPF.charsSelectMenuOptions(player.data.chars, player.data.char, chars)
                if(!options) throw new Error('Персонажи отсутствуют')

                let char = chars.find(char => char.id == value)
                if(!char) throw new Error("Персонаж не найден")

                if(!player.data.chars?.find(fChar => fChar == char.id)) throw new Error("Персонаж не найден")

                let components = RPF.pageButtonsSelectMenu('char_select', 'Персонажи...', options, 'char', 0)
                components.splice(1, 0, {
                    type: 'ACTION_ROW',
                    components: [
                        {
                            type: 'BUTTON',
                            label: 'Использовать',
                            customId: `char_use_${char.id}`,
                            style: 'PRIMARY'
                        },
                        {
                            type: 'BUTTON',
                            label: 'Изменить описание',
                            customId: `char_edit_${char.id}`,
                            style: 'SUCCESS'
                        },
                    ]
                })

                if(player.data.char == char.id){
                    components[1].components[0].disabled = true
                }

                interaction.update({
                    content: '> Ваши персонажи 👥',
                    embeds: [{
                        author: {name: `[${char.id}] ${betterLimitText(char.data.name, 100)}`},
                        description: char.data.desc,
                        thumbnail: {url: emojiURL(char.data.emoji ?? '👤')},
                        color: 'RANDOM',
                    }],
                    components: components
                })
            }
        }

        //#DE55C9
        if(interaction.isButton() || add == 'global'){
            if(type == 'invent'){
                let gItems = []
                let charItems = []
                let roomItems = []

                for(let value of data.split(';')){
                    value = value.split('-') //id и convar

                    let gItem = items.find(fItem => fItem.id == value[0])
                    if(!gItem) throw new Error("Предмет не удалось найти среди глобальных предметов")
                    gItems.push(gItem)

                    let charItem = char.data.items?.find(item => (!value[1] && item.id == gItem.id) || (value[1] && item.id == gItem.id && item.convar == value[1]))
                    if(charItem){
                        charItems.push(charItem)
                    }

                    let roomItem = room.items?.find(item => (!value[1] && item.id == gItem.id) || (value[1] && item.id == gItem.id && item.convar == value[1]))
                    if(roomItem){
                        roomItems.push(roomItem)
                    }
                }

                async function getCount(gItem, item, emoji){
                    try{
                        let count = 1
                        if(item.count > 1){
                            let reply = `> Введите количество **[${gItem.id}] ${gItem.data.emoji} ${gItem.data.name} (Всего: ${item.count.toLocaleString('en')})** ${emoji}`

                            IAL.ReplyInteraction(interaction, {content: reply, embeds: [], components: []})
                            
                            let filter = message => message.author.id == interaction.user.id
                            let message = await interaction.channel.awaitMessages({filter, max: 1, time: 15000, errors: ['time']})

                            count = parseInt(message.first().content)
                            setTimeout(() => {
                                try{
                                    message.first().delete()
                                }catch(error){
                                    IAL.ErrorInteraction(interaction, error, true)
                                }
                            }, timeOfDelete)
                        }
                        return count
                    }catch{
                        throw new Error("Время записи числа вышло")
                    }
                }

                if(act == 'use'){
                    if(!charItems.length) throw new Error("Предмет не удалось найти среди вашего инвентаря")
                    if(gItems[0].data.type == 'key'){
                        CGF.keyUse()
                    }
                }else if(act == 'trade'){
                    if(!PGF.trade) PGF.trade = (page = 0) => {
                        let filterChars = chars.filter(fChar => players?.find(fPlayer => fPlayer.data.char == fChar.id) && fChar.data.pos == object.id)
                        console.log(filterChars)
                        let options = RPF.charsSelectMenuOptions(filterChars)
                        if(!options.length) throw new Error("Людей поблизости нет")

                        let components = RPF.pageButtonsSelectMenu(`invent_give_${data}_global`, 'Люди...', options, 'trade', page, data)
                        
                        IAL.ReplyInteraction(interaction, {
                            content: '> Выберите получателя 👥',
                            embeds: [],
                            components: components
                        })
                    }
                    Object.assign(CGF, PGF)
                    CGF.trade()
                }else if(act == 'drop' || act == 'take' || act == 'give'){
                    let dropInfo = []
                    let fArray, lAct, get, main, second
                    main = {path: 'ages/chars', par: 'items', id: char.id, origin: char.data.items}

                    if(act == 'drop'){
                        if(!charItems.length) throw new Error("Предмет не удалось найти среди вашего инвентаря")
                        fArray = charItems
                        lAct = `> Вы выбросили 📤`
                        get = false

                        second = {path: 'ages/objects', par: `rooms.${roomId}.items`, id: object.id, origin: room.items}
                    }else if(act == 'take'){
                        if(!roomItems.length) throw new Error("Предмет не удалось найти среди комнаты")
                        fArray = roomItems
                        lAct = `> Вы получили 📥`
                        get = true

                        second = {path: 'ages/objects', par: `rooms.${roomId}.items`, id: object.id, origin: room.items} 
                    }else if(act == 'give'){
                        if(!charItems.length) throw new Error("Предмет не удалось найти среди вашего инвентаря")
                        fArray = charItems
                        lAct = `> Вы передали 📦`
                        get = false

                        let targetChar = chars.find(fChar => fChar.id == value)
                        if(!targetChar) throw new Error("Получатель не найден")

                        second = {path: 'ages/chars', par: `items`, id: targetChar.id, origin: targetChar.data.items}
                    }
                    for(let lItem of fArray){
                        let gItem = gItems.find(fItem => fItem.id == lItem.id)
                        if(!gItem) throw new Error("Предмет не удалось найти")

                        let count = await getCount(gItem, lItem, lAct.slice(-1))

                        if(count != NaN && lItem.count >= count && count > 0){
                            IAL.ReplyInteraction(interaction, {content: `> Процесс... 📦`, embeds: [], components: []})
                            
                            let action = [
                                RPF.ItemManager(get, main, lItem, count),
                                RPF.ItemManager(!get, second, lItem, count),
                            ]
                            
                            for(let act of action){
                                if(act != true){
                                    throw act
                                }
                            }

                            dropInfo.push(`[${gItem.id}] ${gItem.data.emoji} ${gItem.data.name} (x${count.toLocaleString('en')})`)
                            
                            setTimeout(() => {
                                try{
                                    if(fArray.indexOf(lItem) == fArray.length - 1){
                                        interaction.editReply(`${lAct}\n${dropInfo.join('\n')}`)
                                    }
                                }catch(error){
                                    IAL.ErrorInteraction(interaction, error, true)
                                }
                            }, 2500)
                        }else{
                            throw new Error("Вы указали неверное число")
                        }
                    }
                }
            }else if(type == 'char'){
                if(act == 'use'){
                    let char = chars.find(char => char.id == data)
                    if(!char) throw new Error("Персонаж не найден")

                    if(!player.data.chars?.find(fChar => fChar == char.id)) throw new Error("Персонаж не найден")

                    let posObject = objects.find(object => object.id == char.data.pos)
                    if(!posObject) throw new Error("Позиция персонажа не найдена")

                    let channelPosObject = guild.channels.cache.get(posObject.data.cid)
                    if(!channelPosObject) throw new Error("Позиция персонажа не найдена")

                    EStats('ages/players', player.id, 'char', [char.id])
                    RPF.step(guild, player.data.user, char.id, objects, posObject, channelPosObject)

                    IAL.ReplyInteraction(interaction, {content: `> Вы сменили персонажа на **${char.data.name}** 👤`, embeds: [], components: []})
                    interaction.member.setNickname(betterLimitText(`[${player.id}-${char.id}] ${char.data.name}`, 32))
                }else if(act == 'edit'){
                    let char = chars.find(char => char.id == data)
                    if(!char) throw new Error("Персонаж не найден")

                    if(!player.data.chars?.find(fChar => fChar == char.id)) throw new Error("Персонаж не найден")

                    interaction.update({content: `> Просмотрите личные сообщения с ботом, чтобы продолжить 👤`, embeds: [], components: []})
                    let messageEdit = await interaction.user.send({
                        content: `> Редактирование описания персонажа **${char.data.name}** 👤\n`,
                        embeds: [
                            {
                                description: `Для изменения, напишите новое описание, отправив его в новом сообщении`,
                                color: 'RANDOM'
                            }
                        ],
                        components: [
                            {
                                type: 'ACTION_ROW',
                                components: [
                                    {
                                        type: 'BUTTON',
                                        label: 'Сбросить редактирование',
                                        customId: 'char_editStop',
                                        style: 'DANGER'
                                    }
                                ]
                            }
                        ]
                    })
                    
                    let filterMessage = (msg) => msg.author.id == interaction.user.id
                    let filterInteraction = (interaction) => interaction.message.id == messageEdit.id

                    let reply = interaction.user.dmChannel.createMessageCollector({filterMessage, max: 1, time: (5*60)*1000, dispose: true})
                    let button = interaction.user.dmChannel.createMessageComponentCollector({filterInteraction, max: 1, time: (5*60)*1000, dispose: true})

                    button.on('collect', (interaction) => {
                        if(interaction.customId == 'char_editStop'){
                            messageEdit.edit({content: `> Вы остановили создание 👤`, embeds: [], components: []})

                            button.stop()
                            reply.stop()
                        }
                    })

                    reply.on('collect', (message) => {
                        messageEdit.edit({content: `> Вы успешно изменили персонажа 👤`, embeds: [], components: []})
                        EStats('ages/chars', char.id, 'desc', [betterLimitText(message.content, 100)])

                        button.stop()
                        reply.stop()
                    })

                    reply.on('end', () => {
                        if(!button.ended){
                            messageEdit.edit({content: `> Вышло время записи или закончились попытки 👤`, embeds: [], components: []})

                            reply.stop()
                            button.stop()
                        }
                    })
                }else if(act == 'create'){
                    interaction.update({content: `> Просмотрите личные сообщения с ботом, чтобы продолжить 👤`, embeds: [], components: []})
                    
                    let char = {}

                    let messageEdit = await interaction.user.send({
                        content: `> Создание персонажа 👤\n`,
                        embeds: [
                            {
                                description: `Выберите рассу`,
                                color: 'RANDOM'
                            }
                        ],
                        components: [
                            {
                                type: 'ACTION_ROW',
                                components: [
                                    {
                                        type: 'BUTTON',
                                        label: 'Талоран (Человек)',
                                        customId: 'char_man',
                                        style: 'SUCCESS'
                                    },
                                    {
                                        type: 'BUTTON',
                                        label: 'Ка\'Дош (Орк)',
                                        customId: 'char_ork',
                                        style: 'DANGER'
                                    },
                                    {
                                        type: 'BUTTON',
                                        label: 'Суум (Эльф)',
                                        customId: 'char_elf',
                                        style: 'PRIMARY'
                                    },
                                    {
                                        type: 'BUTTON',
                                        label: 'Сбросить создание',
                                        customId: 'char_createStop',
                                        style: 'DANGER'
                                    }
                                ]
                            }
                        ]
                    })

                    let filterInteraction = (interaction) => interaction.message.id == messageEdit.id
                    let button = interaction.user.dmChannel.createMessageComponentCollector({filterInteraction, max: 3, time: (5*60)*1000, dispose: true})

                    let filterMessage = (msg) => msg.author.id == interaction.user.id
                    let reply = interaction.user.dmChannel.createMessageCollector({filterMessage, max: 3, time: (5*60)*1000, dispose: true})

                    button.on('collect', async (interaction) => {
                        if(interaction.customId == 'char_createStop'){
                            button.stop()
                            reply.stop()

                            messageEdit.edit({content: `> Вы остановили создание 👤`, embeds: [], components: []})
                        }else if(interaction.customId == 'char_createDone'){
                            char = await AStats('ages/chars', undefined, [char.name, char.race, char.desc, undefined, undefined, 1])
                            
                            let targetObject = objects.find(fObject => fObject.id == char.data.pos)
                            if(!targetObject){
                                IAL.ErrorInteraction(interaction, new Error('Объект не найден'))
                                button.stop()
                                reply.stop()
                            }

                            let channelTargetObject = guild.channels.cache.get(targetObject.data.cid)
                            if(!channelTargetObject){
                                IAL.ErrorInteraction(interaction, new Error('Объект не найден'))
                                button.stop()
                                reply.stop()
                            }

                            player.data.chars?.push(char.id)
                            let chars = player.data.chars ?? [char.id]
                            
                            console.log(chars)
                            
                            if(!player.data.char){
                                EStats('ages/players', player.id, 'char', [char.id])
                                RPF.step(guild, player.data.user, undefined, objects, targetObject, channelTargetObject)
                                interaction.member.setNickname(betterLimitText(`[${player.id}-${char.id}] ${char.data.name}`, 32))
                            }
                            if(!player.data.chars?.find(fChar => fChar.id == char.id)){
                                EStats('ages/players', player.id, 'chars', [chars])
                            }

                            IAL.ReplyInteraction(interaction, {content: `> Вы успешно создали персонажа **${char.data.name}** 👤`, embeds: [], components: []})

                            button.stop()
                            reply.stop()
                        }else{
                            char.race = interaction.customId.split('_')[1]
                            IAL.ReplyInteraction(interaction, {
                                embeds: [
                                    {
                                        description: `Напишите имя персонажа`,
                                        color: 'RANDOM'
                                    }
                                ],
                                components: [
                                    {
                                        type: 'ACTION_ROW',
                                        components: [
                                            {
                                                type: 'BUTTON',
                                                label: 'Сбросить создание',
                                                customId: 'char_createStop',
                                                style: 'DANGER'
                                            }
                                        ]
                                    }
                                ]
                            })
                        }
                    })

                    reply.on('collect', (message) => {
                        if(button.collected.size > 0){
                            if(reply.collected.size == 1){
                                char.name = betterLimitText(message.content, 100)
                                messageEdit.edit({
                                    embeds: [
                                        {
                                            description: `Напишите описание персонажа`,
                                            color: 'RANDOM'
                                        }
                                    ]
                                })
                            }else if(reply.collected.size == 2){
                                char.desc = betterLimitText(message.content, 100)
                                messageEdit.edit({
                                    embeds: [
                                        {
                                            title: char.name,
                                            description: char.desc,
                                            thumbnail: {url: `https://twemoji.maxcdn.com/v/13.1.0/72x72/1f464.png`},
                                            color: 'RANDOM',
                                        }
                                    ],
                                    components: [
                                        {
                                            type: 'ACTION_ROW',
                                            components: [
                                                {
                                                    type: 'BUTTON',
                                                    label: 'Подтвердить',
                                                    customId: 'char_createDone',
                                                    style: 'SUCCESS'
                                                },
                                                {
                                                    type: 'BUTTON',
                                                    label: 'Сбросить создание',
                                                    customId: 'char_createStop',
                                                    style: 'DANGER'
                                                },
                                            ] 
                                        }
                                    ]
                                })
                            }
                        }
                    })

                    reply.on('end', () => {
                        if(!button.ended){
                            reply.stop()
                            button.stop()
                            
                            messageEdit.edit({content: `> Вышло время записи или закончились попытки 👤`, embeds: [], components: []})
                        }
                    })
                }
            }

            if(type == 'page'){
                CGF[act](parseInt(add))
            }

            if(type == 'gmenu'){
                CGF[act]()
            }
        }
    }catch(error){
        IAL.ErrorInteraction(interaction, error, true)
    }
})
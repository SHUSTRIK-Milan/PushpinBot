const {
    client, REST, Routes,
    Config, prefix, timeOfDelete,
    guildBase, guildAges, guildBD, 
    rpGuilds, cmdParametrs, getMessages, toChannelName, betterLimitText, random,
    getRoleId, haveRole, giveRole, removeRole,
    sendLog, createLore, createEx,
    createCom, SlashCom, ReplyInteraction, ErrorInteraction, BDunit,
    GStats, AStats, EStats,
    DStats, RPF} = require('../bot.js')

const guild = guildAges
const getUnicode = require('emoji-unicode')

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

SlashCom('wait', 'персонажи', {
    name: 'персонажи',
    description: 'Система управления вашими персонажами',
    type: 'CHAT_INPUT',
}, guild.id)

SlashCom('wait', 'телепорт', {
    name: 'телепорт',
    description: 'Телепортирует в выбранную локацию',
    type: 'CHAT_INPUT',
    options: [
        {
            type: 'USER',
            name: 'человек',
            description: 'Цель, которую нужно телепортировать (по умолчанию: вы)',
            required: false,
        }
    ],
}, guild.id)

client.on('messageCreate', message => { if(message.guild?.id == guild.id){
    var cA = haveRole(message.member, "[A]"),
        cB = haveRole(message.member, "[B]"),
        cC = haveRole(message.member, "[C]")
    let mb = message.author.bot
    let dm = message.channel.type == "DM"
    let command = cmdParametrs(message.content)

    if(!mb && message.content == '!test'){
        RPF.createObjects("ages/objects", guild)
    }

    if(!mb && !dm) sendLog(message.member, message.channel, 'rp', 'Отправил сообщение', true, message.content)
}})

client.on('interactionCreate', async interaction => {
    if(interaction.guildId == guild.id) try{
        let type = interaction.customId?.split('_')[0]
        let act = interaction.customId?.split('_')[1]
        let data = interaction.customId?.split('_')[2]
        let add = interaction.customId?.split('_')[3]

        let values = interaction.values
        let value = values?.[0]

        let charPass = (type == 'char' || interaction.commandName == 'персонажи') && !interaction.channel.parent.position
        
        var objects = await GStats("ages/objects")
        if(!objects) throw new Error("Объекты отсутствуют")

        let object = objects.find(object => object.data.cid == interaction.channel.parentId)
        if(!object && !charPass) throw new Error("Функция используется вне ролевого поля")

        let roomId = parseInt(interaction.channel.topic)
        let room = object?.data.rooms[roomId]
        if(!room && !charPass) throw new Error("Функция используется вне ролевого поля")

        var items = await GStats("ages/items")
        if(!items) throw new Error("Предметы отсутствуют")

        var players = await GStats("ages/players")
        if(!players) throw new Error("Игроки отсутствуют")

        var player = players.find(player => player.data.user == interaction.user.id)
        if(!player) throw new Error("Игрок отсутствует")

        var chars = await GStats("ages/chars")
        if(!chars) throw new Error("Персонажи отсутствуют")

        var char = chars.find(char => char.id == player.data.char && player.data.chars?.find(fChar => fChar == char.id))
        if(!char && !charPass) throw new Error("Персонаж отсутствует")

        if(interaction.isCommand()){
            if(interaction.commandName == 'инвентарь'){
                let options = RPF.itemsSelectMenuOptions(items, char.data.items)
                if(!options.length) throw new Error("Ваш инвентарь пуст")

                interaction.reply({
                    content: '> Ваш инвентарь 💼',
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
            }

            if(interaction.commandName == 'осмотреть'){
                let options = RPF.itemsSelectMenuOptions(items, room.items)

                interaction.reply({
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

            if(interaction.commandName == 'идти'){
                if(char.data.pos != object.id && char.data.pos) throw new Error(`Вы находитесь вне объекта, в котором находитесь (**${objects.find(object => object.id == char.data.pos)?.data.name ?? "Неизвестно"}**). Вы очень похожи на кота Шрёдингера 🐈‍⬛`)
                
                let options = RPF.objectsSelectMenuOptions(object, objects, true, false)
                if(options.length == 0) throw new Error("Объектов поблизости нет")

                let components = RPF.pageButtonsSelectMenu('walk_select', 'Объекты...', options, 'walk')
                
                interaction.reply({
                    content: '> Выберите направление 🚶',
                    components: components,
                    ephemeral: true
                })
            }

            if(interaction.commandName == 'персонажи'){
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
                        components = RPF.pageButtonsSelectMenu('char_select', 'Персонажи...', options, 'char')
                        components.splice(1, 0, createButton)
                    }else{
                        components = RPF.pageButtonsSelectMenu('char_select', 'Персонажи...', options, 'char')
                    }
                }

                interaction.reply({
                    content: '> Ваши персонажи 👥',
                    components: components,
                    ephemeral: true
                })
            }

            if(interaction.commandName == 'телепорт'){
                let selectUserId = interaction.options?.get('человек')?.value ?? interaction.user.id

                let options = RPF.objectsSelectMenuOptions(object, objects, false, selectUserId != interaction.user.id)
                if(options.length == 0) throw new Error("Объектов нет")

                let components = RPF.pageButtonsSelectMenu(`tp_select_${selectUserId}`, 'Объекты...', options, 'tp', 0, selectUserId)
                
                interaction.reply({
                    content: '> Выберите направление 🛸',
                    components: components,
                    ephemeral: true
                })
            }
        }

        if(interaction.isSelectMenu()){
            if(type == 'invent' && act == 'open'){
                let gItems = []
                let charItems = []
                let embeds = []

                let options = RPF.itemsSelectMenuOptions(items, char.data.items)
                if(options.length == 0) throw new Error("Ваш инвентарь пуст")

                for(let value of values){
                    value = value.split('-') //id и convar

                    let gItem = items.find(fItem => fItem.id == value[0])
                    if(!gItem) throw new Error("Предмет не удалось найти среди глобальных предметов")
                    gItems.push(gItem)

                    let charItem = char.data.items?.find(item => (!value[1] && item.id == gItem.id) || (value[1] && item.id == gItem.id && item.convar == value[1]))
                    if(!charItem) throw new Error("Предмет не удалось найти среди вашего инвентаря")
                    charItems.push(charItem)

                    let emoji = getUnicode(gItem.data.emoji ?? '📦').split(' ').join('-')
                    embeds.push({
                        author: {name: `[${char.data.items.indexOf(charItem)+1}] ${gItem.data.name} (x${charItem.count.toLocaleString('en')})` },
                        description: gItem.data.desc,
                        thumbnail: {url: `https://twemoji.maxcdn.com/v/13.1.0/72x72/${emoji}.png`},
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

                let options = RPF.itemsSelectMenuOptions(items, room.items)
                if(options.length == 0) throw new Error("Комната пуста")
                
                for(let value of values){
                    value = value.split('-') //id и convar

                    let gItem = items.find(fItem => fItem.id == value[0])
                    if(!gItem) throw new Error("Предмет не удалось найти среди глобальных предметов")
                    gItems.push(gItem)

                    let roomItem = room.items?.find(item => (!value[1] && item.id == gItem.id) || (value[1] && item.id == gItem.id && item.convar == value[1]))
                    if(!roomItem) throw new Error("Предмет не удалось найти среди комнаты")
                    roomItems.push(roomItem)

                    let emoji = getUnicode(gItem.data.emoji ?? '📦').split(' ').join('-')
                    embeds.push({
                        author: {name: `[${room.items.indexOf(roomItem)+1}] ${gItem.data.name} (x${roomItem.count.toLocaleString('en')})` },
                        description: gItem.data.desc,
                        thumbnail: {url: `https://twemoji.maxcdn.com/v/13.1.0/72x72/${emoji}.png`},
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
                                ErrorInteraction(interaction, error, true)
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
                            RPF.step(interaction, interaction.user.id, char, objects, targetObject, channelTargetObject, `> Вы успешно перешли в **${channelTargetObject.name}** 🚶`)
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
                        ErrorInteraction(interaction, error, true)
                    }
                }, 2500)
            }else if(type == 'tp' && act == 'select'){
                let player = players.find(player => player.data.user == data)
                if(!player) throw new Error("Игрок не найден")

                let char = chars.find(char => char.id == player.data.char)
                if(!char) throw new Error("Персонаж не найден")

                let targetObject = objects.find(object => object.id == value)
                if(!targetObject) throw new Error("Объект не найден")
                
                let channelTargetObject = guild.channels.cache.get(targetObject.data.cid)
                if(!channelTargetObject) throw new Error("Объект не найден")

                RPF.step(interaction, player.data.user, char, objects, targetObject, channelTargetObject, `> Вы успешно перелетели в **${channelTargetObject.name}** 🛸`)
            }else if(type == 'char' && act == 'select'){
                let options = RPF.charsSelectMenuOptions(player.data.chars, player.data.char, chars)
                if(!options) throw new Error('Персонажи отсутствуют')

                let char = chars.find(char => char.id == value)
                if(!char) throw new Error("Персонаж не найден")

                if(!player.data.chars?.find(fChar => fChar == char.id)) throw new Error("Персонаж не найден")

                let components = RPF.pageButtonsSelectMenu('char_select', 'Персонажи...', options, 'char')
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

                let emoji = getUnicode(char.data.emoji ?? '👤').split(' ').join('-')
                interaction.update({
                    content: '> Ваши персонажи 👥',
                    embeds: [{
                        author: {name: `[${player.data.chars.indexOf(char.id)+1}] ${betterLimitText(char.data.name, 100)} ${char.id == player.data.char ? "✅" : ""}`},
                        description: char.data.desc,
                        thumbnail: {url: `https://twemoji.maxcdn.com/v/13.1.0/72x72/${emoji}.png`},
                        color: 'RANDOM',
                    }],
                    components: components
                })
                
            }
        }

        if(interaction.isButton() || add == 'ex'){
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
                            let reply = `> Введите количество **${gItem.data.emoji} ${gItem.data.name} (Всего: ${item.count.toLocaleString('en')})** ${emoji}`

                            ReplyInteraction(interaction, {content: reply, embeds: [], components: []})
                            
                            let filter = message => message.author.id == interaction.user.id
                            let message = await interaction.channel.awaitMessages({filter, max: 1, time: 15000, errors: ['time']})

                            count = parseInt(message.first().content)
                            setTimeout(() => {
                                try{
                                    message.first().delete()
                                }catch(error){
                                    ErrorInteraction(interaction, error, true)
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
                        let options = RPF.objectsSelectMenuOptions(object, objects, true, true)
                        if(!options.length) throw new Error("Объектов поблизости нет")

                        let components = RPF.pageButtonsSelectMenu(`invent_key_${data}`, 'Объекты...', options, 'keyuse', 0, data)
                        
                        interaction.update({
                            content: '> Выберите объект 🏘',
                            embeds: [],
                            components: components
                        })
                    }
                }else if(act == 'trade'){
                    let filterChars = chars.filter(fChar => players?.find(fPlayer => fPlayer.data.char == fChar.id) && !player.data.chars?.find(fpChar => fpChar == fChar.id) && fChar.data.pos == char.data.pos)
                    let options = RPF.charsSelectMenuOptions(filterChars)
                    if(!options.length) throw new Error("Людей поблизости нет")

                    let components = RPF.pageButtonsSelectMenu(`invent_give_${data}_ex`, 'Люди...', options, 'trade', 0, data)
                    
                    interaction.update({
                        content: '> Выберите получателя 👥',
                        embeds: [],
                        components: components
                    })
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
                        console.log('test')
                        /* if(!charItems.length) throw new Error("Предмет не удалось найти среди вашего инвентаря")
                        fArray = charItems
                        lAct = `> Вы передали 📦`
                        get = false

                        second = {path: 'ages/chars', par: `items`, id: object.id, origin: room.items} */
                    }
                    for(let lItem of fArray){
                        let gItem = gItems.find(fItem => fItem.id == lItem.id)
                        if(!gItem) throw new Error("Предмет не удалось найти")

                        let count = await getCount(gItem, lItem, lAct.slice(-1))

                        if(count != NaN && lItem.count >= count && count > 0){
                            ReplyInteraction(interaction, {content: `> Процесс... 📦`, embeds: [], components: []})
                            
                            let action = [
                                RPF.ItemManager(get, main, lItem, count),
                                RPF.ItemManager(!get, second, lItem, count),
                            ]
                            
                            for(let act of action){
                                if(act != true){
                                    throw act
                                }
                            }

                            dropInfo.push(`**${gItem.data.emoji}** ${gItem.data.name} (x${count.toLocaleString('en')})`)
                            
                            setTimeout(() => {
                                try{
                                    if(fArray.indexOf(lItem) == fArray.length - 1){
                                        interaction.editReply(`${lAct}\n${dropInfo.join('\n')}`)
                                    }
                                }catch(error){
                                    ErrorInteraction(interaction, error, true)
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
                    RPF.step(interaction, player.data.user, char, objects, posObject, channelPosObject)

                    interaction.update({content: `> Вы сменили персонажа на **${char.data.name}** 👤`, embeds: [], components: []})
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
                                        label: 'Завершить редактирование',
                                        customId: 'char_editStop',
                                        style: 'DANGER'
                                    }
                                ]
                            }
                        ]
                    })
                    
                    let filterMessage = (msg) => msg.author.id == interaction.user.id
                    let stop = false

                    let filterInteraction = (interaction) => interaction.message.id == messageEdit.id

                    let reply = interaction.user.dmChannel.createMessageCollector({filterMessage, max: 1, time: (5*60)*1000, dispose: true})
                    let button = interaction.user.dmChannel.createMessageComponentCollector({filterInteraction, max: 1, time: (5*60)*1000, dispose: true})

                    button.on('collect', (interaction) => {
                        if(interaction.customId == 'char_editStop'){
                            interaction.update({content: `> Вы остановили редактирование 👤`, embeds: [], components: []})
                            stop = true

                            reply.stop()
                            button.stop()
                        }
                    })

                    reply.on('collect', (message) => {
                        messageEdit.edit({content: `> Вы успешно изменили персонажа 👤`, embeds: [], components: []})
                        EStats('ages/chars', char.id, 'desc', [betterLimitText(message.content, 100)])
                        stop = true

                        reply.stop()
                        button.stop()
                    })

                    reply.on('end', () => {
                        if(!stop){
                            messageEdit.edit({content: `> Вышло время записи 👤`, embeds: [], components: []})

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
                                        label: 'Завершить создание',
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

                    let stop = false

                    button.on('collect', async (interaction) => {
                        if(interaction.customId == 'char_createStop'){
                            interaction.update({content: `> Вы остановили создание 👤`, embeds: [], components: []})
                            stop = true

                            reply.stop()
                            button.stop()
                        }else if(interaction.customId == 'char_createDone'){
                            interaction.update({content: `> Вы успешно создали персонажа **${char.name}** 👤`, embeds: [], components: []})

                            char = await AStats('ages/chars', undefined, [char.name, char.race, char.desc, undefined, 1])
                            player.data.chars?.push(char.id)
                            let chars = player.data.chars ?? [char.id]
                            if(!player.data.chars?.find(fChar => fChar.id == char.id)){
                                EStats('ages/players', player.id, 'chars', [chars])
                            }

                            stop = true

                            reply.stop()
                            button.stop()
                        }else{
                            char.race = interaction.customId.split('_')[1]
                            interaction.update({
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
                                                label: 'Завершить создание',
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
                                                    label: 'Завершить создание',
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
                        if(!stop){
                            messageEdit.edit({content: `> Вышло время записи или закончились попытки 👤`, embeds: [], components: []})

                            reply.stop()
                            button.stop()
                        }
                    })
                }
            }

            if(type == 'page'){
                if(act == 'walk'){
                    let options = RPF.objectsSelectMenuOptions(object, objects, true, false)
                    if(options.length == 0) throw new Error("Объектов поблизости нет")

                    let components = RPF.pageButtonsSelectMenu('walk_select', 'Объекты...', options, 'walk', parseInt(add))
                    
                    ReplyInteraction(interaction, {
                        content: '> Выберите направление 🚶',
                        components: components,
                    })
                }else if(act == 'key'){
                    let options = RPF.objectsSelectMenuOptions(object, objects, true, true)
                    if(options.length == 0) throw new Error("Объектов поблизости нет")

                    let components = RPF.pageButtonsSelectMenu(`invent_key_${data}`, 'Объекты...', options, 'key', parseInt(add), data)

                    ReplyInteraction(interaction, {
                        content: '> Выберите объект 🏘',
                        embeds: [],
                        components: components
                    })
                }else if(act == 'tp'){
                    let options = RPF.objectsSelectMenuOptions(object, objects, false, data != interaction.user.id)
                    if(options.length == 0) throw new Error("Объектов нет")

                    let components = RPF.pageButtonsSelectMenu(`tp_select_${data}`, 'Объекты...', options, 'tp', parseInt(add), data)
                    
                    ReplyInteraction(interaction, {
                        content: '> Выберите направление 🛸',
                        components: components,
                        ephemeral: true
                    })
                }else if(act == 'char'){
                    let options = RPF.charsSelectMenuOptions(player.data.chars, player.data.char, chars)
                    if(!options) throw new Error('Персонажи отсутствуют')

                    let components = RPF.pageButtonsSelectMenu('char_select', 'Персонажи...', options, 'char', parseInt(add))
                    
                    ReplyInteraction(interaction, {
                        content: '> Ваши персонажи 👥',
                        components: components,
                        ephemeral: true
                    })
                }
            }
        }
    }catch(error){
        ErrorInteraction(interaction, error, true)
    }
})
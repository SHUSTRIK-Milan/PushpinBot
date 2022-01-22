const {
    client, REST, Routes,
    Config, prefix, timeOfDelete,
    guildBase, guildAges, guildBD, 
    rpGuilds, cmdParametrs, getMessages, toChannelName, random,
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

SlashCom('create', 'телепорт', {
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

client.on('messageCreate', message => { if(message.guild.id == guild.id){
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
        let value = interaction.values?.[0]

        var items = await GStats("ages/items")
        if(!items) throw new Error("Предметы отсутствуют")

        var players = await GStats("ages/players")
        if(!players) throw new Error("Игроки отсутствуют")

        var chars = await GStats("ages/chars")
        if(!chars) throw new Error("Персонажи отсутствуют")

        var objects = await GStats("ages/objects")
        if(!objects) throw new Error("Объекты отсутствуют")

        var player = players.find(player => player.data.user == interaction.user.id)
        if(!player) throw new Error("Игрок отсутствует")

        var char = chars.find(char => char.id == player.data.char && player.data.chars.find(fChar => fChar == char.id))
        if(!char) throw new Error("Персонаж отсутствует")

        let object = objects.find(object => object.data.cid == interaction.channel.parentId)
        if(!object) throw new Error("Функция используется вне ролевого поля")

        let roomId = parseInt(interaction.channel.topic)
        let room = object.data.rooms[roomId]

        if(interaction.isCommand()){
            if(interaction.commandName == 'инвентарь'){
                let options = RPF.itemsSelectMenuOptions(items, char.data.items)
                if(options.length == 0) throw new Error("Ваш инвентарь пуст")

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

            }

            if(interaction.commandName == 'телепорт'){
                let options = RPF.objectsSelectMenuOptions(object, objects, false, false)
                if(options.length == 0) throw new Error("Объектов нет")

                let components = RPF.pageButtonsSelectMenu('tp_select', 'Объекты...', options, 'tp', 0, interaction.options?.get('человек')?.value ?? interaction.user.id)
                
                interaction.reply({
                    content: '> Выберите направление 🛸',
                    components: components,
                    ephemeral: true
                })
            }
        }

        if(interaction.isSelectMenu()){
            if(type == 'invent' && act == 'open'){
                let values = interaction.values
                let gItems = []
                let charItems = []
                let embeds = []

                let itemComponents = [
                    {
                        type: 'BUTTON',
                        label: 'Использовать',
                        customId: `invent_use_${values.join(',')}`,
                        style: 'PRIMARY'
                    },
                    {
                        type: 'BUTTON',
                        label: 'Передать',
                        customId: `invent_trade_${values.join(',')}`,
                        style: 'SUCCESS'
                    },
                    {
                        type: 'BUTTON',
                        label: 'Выбросить',
                        customId: `invent_drop_${values.join(',')}`,
                        style: 'DANGER'
                    }
                ]

                let options = RPF.itemsSelectMenuOptions(items, char.data.items)
                if(options.length == 0) throw new Error("Ваш инвентарь пуст")

                for(let value of values){
                    console.log(value)
                    let gItem = items.find(fItem => fItem.id == value.split('-')[0])
                    if(!gItem) throw new Error("Предмет не удалось найти среди глобальных предметов")
                    gItems.push(gItem)

                    let charItem = char.data.items?.find(item => (!value.split('-')[1] && item.id == gItem.id) || (value.split('-')[1] && item.id == gItem.id && item.convar == value.split('-')[1]))
                    if(!charItem) throw new Error("Предмет не удалось найти среди вашего инвентаря")
                    charItems.push(charItem)

                    let emoji = getUnicode(gItem.data.emoji).split(' ').join('-')
                    embeds.push({
                        author: {name: `${gItem.data.name} (x${charItem.count})` },
                        description: gItem.data.description,
                        thumbnail: {url: `https://twemoji.maxcdn.com/v/13.1.0/72x72/${emoji}.png`},
                        color: Config.itemTypes[gItem.data.type].color
                    })
                }
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
                let values = interaction.values
                let gItems = []
                let roomItems = []
                let embeds = []

                let options = RPF.itemsSelectMenuOptions(items, room.items)
                if(options.length == 0) throw new Error("Комната пуста")
                
                for(let value of values){
                    let gItem = items.find(fItem => fItem.id == value.split('-')[0])
                    if(!gItem) throw new Error("Предмет не удалось найти среди глобальных предметов")
                    gItems.push(gItem)

                    let roomItem = room.items?.find(item => (!value.split('-')[1] && item.id == gItem.id) || (value.split('-')[1] && item.id == gItem.id && item.convar == value.split('-')[1]))
                    if(!roomItem) throw new Error("Предмет не удалось найти среди комнаты")
                    roomItems.push(roomItem)

                    let emoji = getUnicode(gItem.data.emoji).split(' ').join('-')
                    embeds.push({
                        author: {name: `${gItem.data.name} (x${roomItem.count})` },
                        description: gItem.data.description,
                        thumbnail: {url: `https://twemoji.maxcdn.com/v/13.1.0/72x72/${emoji}.png`},
                        color: Config.itemTypes[gItem.data.type].color
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
                                    customId: `invent_take_${values.join(',')}`,
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
                                    EStats("ages/objects", object.id, "status", [{open: false, ex: object.data.status.ex}])
                                }else if(!object.data.status.open){
                                    interaction.editReply({content: `> Вы открыли объект 🔓`})
                                    EStats("ages/objects", object.id, "status", [{open: true, ex: object.data.status.ex}])
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
                            RPF.step(interaction, char, objects, targetObject, channelTargetObject, `> Вы успешно перешли в **${channelTargetObject.name}** 🚶`)
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
                let targetObject = objects.find(object => object.id == value)
                if(!targetObject) throw new Error("Объект не найден")
                
                let channelTargetObject = guild.channels.cache.get(targetObject.data.cid)
                if(!channelTargetObject) throw new Error("Объект не найден")

                RPF.step(interaction, char, objects, targetObject, channelTargetObject, `> Вы успешно перелетели в **${channelTargetObject.name}** 🛸`)
            }
        }

        if(interaction.isButton()){
            if(type == 'invent'){
                let gItems = []
                let charItems = []
                let roomItems = []

                for(let value of data.split(',')){
                    let gItem = items.find(fItem => fItem.id == value.split('-')[0])
                    if(!gItem) throw new Error("Предмет не удалось найти среди глобальных предметов")
                    gItems.push(gItem)

                    let charItem = char.data.items?.find(item => (!value.split('-')[1] && item.id == gItem.id) || (value.split('-')[1] && item.id == gItem.id && item.convar == value.split('-')[1]))
                    if(charItem){
                        charItems.push(charItem)
                    }

                    let roomItem = room.items?.find(item => (!value.split('-')[1] && item.id == gItem.id) || (value.split('-')[1] && item.id == gItem.id && item.convar == value.split('-')[1]))
                    if(roomItem){
                        roomItems.push(roomItem)
                    }
                }

                async function getCount(get, gItem, item){
                    try{
                        let count = 1
                        if(item.count > 1){
                            let reply
                            if(get){
                                reply = `> Введите количество **${gItem.data.emoji} ${gItem.data.name}**, которое вы хотите поднять **(Всего: ${item.count})** 📥`
                            }else{
                                reply = `> Введите количество **${gItem.data.emoji} ${gItem.data.name}**, которое вы хотите выбросить **(Всего: ${item.count})** 📤`
                            }

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
                    if(charItems.length == 0) throw new Error("Предмет не удалось найти среди вашего инвентаря")
                    if(gItems[0].data.type == 'key'){
                        let options = RPF.objectsSelectMenuOptions(object, objects, true, true)
                        if(options.length == 0) throw new Error("Объектов поблизости нет")

                        let components = RPF.pageButtonsSelectMenu(`invent_key_${data}`, 'Объекты...', options, 'keyuse', 0, data)
                        
                        interaction.update({
                            content: '> Выберите объект 🏘',
                            embeds: [],
                            components: components
                        })
                    }
                }else if(act == 'trade'){
        
                }else if(act == 'drop' || act == 'take'){
                    let dropInfo = []
                    let fArray
                    let lAct
                    let get

                    if(act == 'drop'){
                        if(!charItems.length) throw new Error("Предмет не удалось найти среди вашего инвентаря")
                        fArray = charItems
                        lAct = `> Вы выбросили 📤`
                        get = false
                    }else{
                        if(!roomItems.length) throw new Error("Предмет не удалось найти среди комнаты")
                        fArray = roomItems
                        lAct = `> Вы подняли 📥`
                        get = true
                    }

                    for(let lItem of fArray){
                        let gItem = gItems.find(fItem => fItem.id == lItem.id)
                        if(!gItem) throw new Error("Предмет не удалось найти")
                        console.log(lItem)

                        let count = await getCount(get, gItem, lItem)

                        if(count != NaN && lItem.count >= count && count > 0){
                            ReplyInteraction(interaction, {content: `> Процесс... 📦`, embeds: [], components: []})
                            
                            let action = [
                                RPF.ItemManager(get, 'ages/chars', 'items', char.id, char.data.items, lItem, count),
                                RPF.ItemManager(!get, 'ages/objects', `rooms.${roomId}.items`, object.id, room.items, lItem, count),
                            ]
                            
                            for(let act of action){
                                if(act != true){
                                    throw act
                                }
                            }

                            dropInfo.push(`**${gItem.data.emoji}** ${gItem.data.name} (x${count})`)
                            
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
            }

            if(type == 'switchPage'){
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
                    let options = RPF.objectsSelectMenuOptions(object, objects, false, false)
                    if(options.length == 0) throw new Error("Объектов нет")

                    let components = RPF.pageButtonsSelectMenu('tp_select', 'Объекты...', options, 'tp', parseInt(add), data)
                    
                    ReplyInteraction(interaction, {
                        content: '> Выберите направление 🛸',
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
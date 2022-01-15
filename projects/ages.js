const {
    client, REST, Routes,
    Config, prefix, timeOfDelete,
    guildBase, guildAges, guildBD, 
    rpGuilds, cmdParametrs, toChannelName, random,
    getRoleId, haveRole, giveRole, removeRole,
    sendLog, createLore, createEx,
    createCom, SlashCom, EditInteraction, ErrorInteraction, BDunit,
    GStats, AStats, EStats,
    DStats, RPF} = require('../bot.js')

const guild = guildAges
const getUnicode = require('emoji-unicode')

console.log(`[bot-ages ready]`)

async function joinItems(items, inv){
    let returnItems = []
    if(items != undefined && inv != undefined){
        for (let lItem of inv){
            let gItem = items.find(fItem => fItem.data.codename == lItem.codename)
            if(gItem != undefined){
                returnItems.push({
                    label: `${gItem.data.name} (x${lItem.count})`,
                    description: gItem.data.description,
                    value: `${gItem.data.codename}`,
                    emoji: {
                        id: null,
                        name: `${gItem.data.emoji}`
                    }
                })
            }
        }
    }
    return returnItems
}

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

SlashCom('create', 'идти', {
    name: 'идти',
    description: 'Позволяет пройти в локацию, находящуюся в окружении',
    type: 'CHAT_INPUT',
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
        var items = await GStats("ages/items")
        var players = await GStats("ages/players")
        var objects = await GStats("ages/objects")
        
        var player = players.find(player => player.data.user == interaction.user.id)
        if(player == undefined) throw new Error("Игрок отсутствуют")
        if(items == undefined) throw new Error("Предметы отсутствуют")

        let object = objects.find(object => object.data.cid == interaction.channel.parentId)
        if(object == undefined) throw new Error("Функция используется вне ролевого поля")

        let roomId = parseInt(interaction.channel.topic)
        let room = object.data.rooms[roomId]

        if(interaction.isCommand()){
            if(interaction.commandName == 'инвентарь'){
                let options = await joinItems(items, player.data.items)
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
                let options = await joinItems(items, room.items)

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
                let options = RPF.radiusSelectMenu(object.id, objects, false)
                if(options == undefined) throw new Error("Объектов по близости нет")
                
                interaction.reply({
                    content: '> Выберите направление 🚶‍♂️',
                    components: [{
                        type: 'ACTION_ROW', 
                        components: [
                            {
                                type: 'SELECT_MENU',
                                customId: `walk_select`,
                                placeholder: 'Объекты...',
                                options: options
                            }
                        ]
                    }],
                    ephemeral: true
                })
            }
        }

        if(interaction.isSelectMenu()){
            let type = interaction.customId.split('_')[0]
            let act = interaction.customId.split('_')[1]
            let data = interaction.customId.split('_')[2]
            let value = interaction.values[0]
            
            if(type == 'invent' && act == 'open'){
                let values = interaction.values
                let gItems = []
                let playerItems = []
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

                let options = await joinItems(items, player.data.items)
                if(options.length == 0) throw new Error("Ваш инвентарь пуст")

                for(let value of values){
                    let gItem = items.find(fItem => fItem.data.codename == value)
                    if(gItem == undefined) throw new Error("Предмет не удалось найти среди глобальных предметов")
                    gItems.push(gItem)

                    let playerItem = player.data.items.find(item => item.codename == gItem.data.codename)
                    if(playerItem == undefined) throw new Error("Предмет не удалось найти среди вашего инвентаря")
                    playerItems.push(playerItem)

                    let emoji = getUnicode(gItem.data.emoji).split(' ').join('-')
                    embeds.push({
                        author: {name: `${gItem.data.name} (x${playerItem.count})` },
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

                let options = await joinItems(items, room.items)
                if(options.length == 0) throw new Error("Комната пуста")
                
                for(let value of values){
                    let gItem = items.find(fItem => fItem.data.codename == value)
                    if(gItem == undefined) throw new Error("Предмет не удалось найти среди глобальных предметов")
                    gItems.push(gItem)

                    let roomItem = room.items.find(item => item.codename == gItem.data.codename)
                    if(roomItem == undefined) throw new Error("Предмет не удалось найти среди комнаты")
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
                let object = objects.find(object => object.data.cid == value)
                if(object == undefined) throw new Error("Объект не найден")

                let gItem = items.find(fItem => fItem.data.codename == data)
                if(gItem == undefined) throw new Error("Предмет не удалось найти")
                
                if(object.data.status != undefined){
                    if(gItem.data.convar == object.id){
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
                                ErrorInteraction(interaction, error)
                            }
                        }, 2500)
                    }else{
                        interaction.update({content: `> Ключ не подходит к объекту 🔐`, embeds: [], components: []})
                    }
                }else{
                    interaction.update({content: `> Этот объект невозможно закрыть ⛔`, embeds: [], components: []})
                }
            }else if(type == 'walk' && act == 'select'){
                let targetObject = objects.find(object => object.data.cid == value)
                if(targetObject == undefined) throw new Error("Объект не найден")
                
                let channelObject = guild.channels.cache.get(targetObject.data.cid)
                if(channelObject == undefined) throw new Error("Объект не найден")

                function step(){
                    channelObject.permissionOverwrites.create(interaction.user.id, {'VIEW_CHANNEL': true, 'SEND_MESSAGES': true}).then(() => {
                        setTimeout(() => {
                            try{
                                interaction.channel.parent.permissionOverwrites.delete(interaction.user.id)
                            }catch(error){
                                ErrorInteraction(interaction, error)
                            }
                        }, timeOfDelete*3)
                    })
                }

                interaction.update({content: `> Процесс... 🚶‍♂️`, embeds: [], components: []})
                setTimeout(() => {
                    try{
                        if(object.data.status != undefined){
                            if(!object.data.status.open){
                                throw new Error("Ваш объект закрыт")
                            }
                        }
                        if(targetObject.data.status != undefined){
                            if(targetObject.data.status.open){
                                step()
                            }else if(targetObject.data.status.ex != undefined){
                                if(targetObject.data.status.find(ex => ex == object.id) != undefined){
                                    step()
                                }
                            }else{
                                throw new Error("Объект закрыт")
                            }
                        }else{
                            step()
                        }
                    }catch(error){
                        ErrorInteraction(interaction, error)
                    }
                }, 2500)
            }
        }

        if(interaction.isButton()){
            let type = interaction.customId.split('_')[0]
            let act = interaction.customId.split('_')[1]
            let data = interaction.customId.split('_')[2]

            if(type == 'invent'){
                let gItems = []
                let playerItems = []
                let roomItems = []

                let options = RPF.radiusSelectMenu(object.id, objects, true)

                for(let value of data.split(',')){
                    let gItem = items.find(fItem => fItem.data.codename == value)
                    if(gItem == undefined) throw new Error("Предмет не удалось найти среди глобальных предметов")
                    gItems.push(gItem)

                    if(player.data.items != undefined){
                        let playerItem = player.data.items.find(item => item.codename == gItem.data.codename)
                        playerItems.push(playerItem)
                    }

                    if(room.items != undefined){
                        let roomItem = room.items.find(item => item.codename == gItem.data.codename)
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

                            EditInteraction(interaction, {content: reply, embeds: [], components: []})
                            
                            let filter = message => message.author.id == interaction.user.id
                            let message = await interaction.channel.awaitMessages({filter, max: 1, time: 10000, errors: ['time']})

                            count = parseInt(message.first().content)
                            setTimeout(() => {
                                try{
                                    message.first().delete()
                                }catch(error){
                                    ErrorInteraction(interaction, error)
                                }
                            }, timeOfDelete)
                        }
                        return count
                    }catch{
                        throw new Error("Время записи числа вышло")
                    }
                }

                if(act == 'use'){
                    if(playerItems.length == 0) throw new Error("Предмет не удалось найти среди вашего инвентаря")
                    if(gItems[0].data.type == 'key'){
                        interaction.update({
                            content: '> Выберите объект 🏘',
                            embeds: [],
                            components: [
                                {
                                    type: 'ACTION_ROW',
                                    components: [
                                        {
                                            type: 'SELECT_MENU',
                                            customId: `invent_key_${data}`,
                                            placeholder: 'Объекты...',
                                            options: options
                                        }
                                    ],
                                }
                            ]
                        })
                    }
                }else if(act == 'trade'){
        
                }else if(act == 'drop' || act == 'take'){
                    let dropInfo = []
                    let fArray
                    let lAct
                    let get

                    if(act == 'drop'){
                        if(playerItems.length == 0) throw new Error("Предмет не удалось найти среди вашего инвентаря")
                        fArray = playerItems
                        lAct = `> Вы выбросили 📤`
                        get = false
                    }else{
                        if(roomItems.length == 0) throw new Error("Предмет не удалось найти среди комнаты")
                        fArray = roomItems
                        lAct = `> Вы подняли 📥`
                        get = true
                    }

                    for(let gItem of gItems){
                        let lItem = fArray.find(fItem => fItem.codename == gItem.data.codename)
                        if(lItem == undefined) throw new Error("Предмет не удалось найти")
                        let count = await getCount(get, gItem, lItem)

                        if(count != NaN && lItem.count >= count && count > 0){
                            EditInteraction(interaction, {content: `> Процесс... 📦`, embeds: [], components: []})
                            
                            let action = [RPF.playerItemManager(get, 'ages', player, gItem, count),
                            RPF.roomItemManager(!get, 'ages', object, room, gItem, count)]
                            
                            for(let act of action){
                                if(act != true){
                                    throw act
                                }
                            }

                            dropInfo.push(`**${gItem.data.emoji}** ${gItem.data.name} (x${count})`)
                            
                            setTimeout(() => {
                                try{
                                    if(gItems.indexOf(gItem) == gItems.length - 1){
                                        interaction.editReply(`${lAct}\n${dropInfo.join('\n')}`)
                                    }
                                }catch(error){
                                    ErrorInteraction(interaction, error)
                                }
                            }, 2500)
                        }else{
                            throw new Error("Вы указали неверное число")
                        }
                    }
                }
            }
        }
    }catch(error){
        ErrorInteraction(interaction, error)
    }
})
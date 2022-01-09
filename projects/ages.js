const {
    client, REST, Routes,
    Config, prefix, timeOfDelete,
    guildBase, guildAges, guildBD, 
    rpGuilds, cmdParametrs, toChannelName, random,
    getRoleId, haveRole, giveRole, removeRole,
    sendLog, createLore, createEx,
    createCom, SlashCom, BDentity,
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
                    value: `${lItem.codename}`,
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
    var items = await GStats("ages/items")
    var players = await GStats("ages/players")
    var objects = await GStats("ages/objects")
    var player = players.find(player => player.data.user == interaction.user.id)

    if(interaction.isCommand()){
        if(interaction.commandName == 'инвентарь'){
            try{
                let object = objects.find(object => object.data.cid == interaction.channel.parentId)
                if(object == undefined) throw new Error("Функция используется вне ролевого поля")

                let options = await joinItems(items, player.data.inv)
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
                                    options: options
                                }
                            ]
                        }
                    ],
                    ephemeral: true
                })
            }catch(error){
                interaction.reply({content: `> Ошибка. ${error.message} ⛔`, ephemeral: true})
            }
        }

        if(interaction.commandName == 'осмотреть'){
            try{
                let object = objects.find(object => object.data.cid == interaction.channel.parentId)
                if(object == undefined) throw new Error("Функция используется вне ролевого поля")

                
            }catch{
                interaction.reply({content: `> Ошибка. ${error.message} ⛔`, ephemeral: true})
            }
        }
    }

    if(interaction.isSelectMenu()){
        let type = interaction.customId.split('_')[0]
        let act = interaction.customId.split('_')[1]
        let data = interaction.customId.split('_')[2]
        let value = interaction.values[0]

        if(type == 'invent' && act == 'open'){
            try{
                let object = objects.find(object => object.data.cid == interaction.channel.parentId)
                if(object == undefined) throw new Error("Функция используется вне ролевого поля")

                let lItem = player.data.inv.find(item => item.codename == value)
                if(lItem == undefined) throw new Error("Предмет не удалось найти")

                let gItem = items.find(fItem => fItem.data.codename == lItem.codename)
                let emoji = getUnicode(gItem.data.emoji).split(' ').join('-')
                let itemComponents = [
                    {
                        type: 'BUTTON',
                        label: 'Использовать',
                        customId: `invent_use_${value}`,
                        style: 'PRIMARY'
                    },
                    {
                        type: 'BUTTON',
                        label: 'Передать',
                        customId: `invent_trade_${value}`,
                        style: 'SUCCESS'
                    },
                    {
                        type: 'BUTTON',
                        label: 'Выбросить',
                        customId: `invent_drop_${value}`,
                        style: 'DANGER'
                    },
                    {
                        type: 'BUTTON',
                        label: 'Вернуться',
                        customId: `invent_back_${value}`,
                        style: 'SECONDARY'
                    }
                ]
                if(!Config.itemTypes[gItem.data.type].usable) itemComponents[0].disabled = true

                interaction.update({
                    content: '> Ваш инвентарь 💼',
                    embeds: [
                        {
                            author: {name: `${gItem.data.name}` },
                            description: gItem.data.description,
                            thumbnail: {url: `https://twemoji.maxcdn.com/v/13.1.0/72x72/${emoji}.png`},
                            color: Config.itemTypes[gItem.data.type].color
                        }
                    ],
                    components: [
                        {
                            type: 'ACTION_ROW',
                            components: itemComponents
                        }
                    ]
                }).then(() => {
                    try{
                        if(interaction.message.embeds[0].thumbnail.height == 0){
                            interaction.editReply({
                                embeds: [interaction.message.embeds[0].setThumbnail(`https://twemoji.maxcdn.com/v/13.1.0/72x72/${emoji.split('-')[0]}.png`)]
                            })
                        }
                    }catch{}
                })
            }catch(error){
                interaction.update({content: `> Ошибка. ${error.message} ⛔`, embeds: [], components: []})
            }
        }else if(type == 'invent' && act == 'key'){
            try{
                let object = objects.find(object => object.data.cid == value)
                if(object == undefined) throw new Error("Функция используется вне ролевого поля")

                let lItem = player.data.inv.find(item => item.codename == data)
                if(lItem == undefined) throw new Error("Предмет не удалось найти")

                let gItem = items.find(fItem => fItem.data.codename == lItem.codename)
                if(object.data.status != undefined){
                    if(gItem.data.convar == object.id){
                        interaction.update({content: `> Процесс... 🔐`, embeds: [], components: []})
                        setTimeout(() => {
                            if(object.data.status.open){
                                interaction.editReply({content: `> Вы закрыли объект 🔒`})
                                EStats("ages/objects", object.id, "status", [{open: false, ex: object.data.status.ex}])
                            }else if(!object.data.status.open){
                                interaction.editReply({content: `> Вы открыли объект 🔓`})
                                EStats("ages/objects", object.id, "status", [{open: true, ex: object.data.status.ex}])
                            }
                        }, 2500)
                    }else{
                        interaction.update({content: `> Ключ не подходит к объекту 🔐`, embeds: [], components: []})
                    }
                }else{
                    interaction.update({content: `> Этот объект невозможно закрыть ⛔`, embeds: [], components: []})
                }
            }catch(error){
                interaction.update({content: `> Ошибка. ${error.message} ⛔`, embeds: [], components: []})
            }
        }
    }

    if(interaction.isButton()){
        let type = interaction.customId.split('_')[0]
        let act = interaction.customId.split('_')[1]
        let data = interaction.customId.split('_')[2]

        if(type == 'invent'){
            try{
                let object = objects.find(object => object.data.cid == interaction.channel.parentId)
                if(object == undefined) throw new Error("Функция используется вне ролевого поля")

                let lItem = player.data.inv.find(item => item.codename == data)
                if(lItem == undefined) throw new Error("Предмет не удалось найти")

                let gItem = items.find(fItem => fItem.data.codename == lItem.codename)

                let roomId = parseInt(interaction.channel.topic)
                let room = object.data.rooms[roomId]
                let options = RPF.radiusSelectMenu(object.id, objects)

                if(act == 'use'){
                    if(gItem.data.type == 'key'){
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
        
                }else if(act == 'drop'){
                    let count = 1
                    if(lItem.count > 1){
                        interaction.update({content: `> Введите количество предметов, которое вы хотите выбросить 📥`, embeds: [], components: []})
                        let filter = message => message.author.id == interaction.user.id
                        let message = await interaction.channel.awaitMessages({filter, max: 1, time: 120000, errors: ['time']})

                        count = parseInt(message.first().content)
                        setTimeout(() => {message.first().delete()}, timeOfDelete)
                    }
                    if(count != NaN && lItem.count >= count && count > 0){
                        if(interaction.replied){
                            interaction.editReply({content: `> Процесс... 📦`, embeds: [], components: []})
                        }else{
                            interaction.update({content: `> Процесс... 📦`, embeds: [], components: []})
                        }
                        setTimeout(() => {
                            let itemId = player.data.inv.indexOf(lItem)
                            let roomItem = room.items.find(item => item.codename == lItem.codename)
                            let roomItemId = room.items.indexOf(roomItem)

                            if(room.items == undefined){
                                room.items = [{codename: lItem.codename, count: count}]
                            }else if(roomItem == undefined){
                                room.items.push({codename: lItem.codename, count: count})
                            }else{
                                roomItem.count += count
                                room.items.splice(roomItemId, count, roomItem)
                            }

                            if(room.items.length <= 25){
                                try{
                                    object.data.rooms.splice(roomId, count, room)

                                    if(lItem.count <= count){
                                        player.data.inv.splice(itemId, 1)
                                    }else{
                                        lItem.count -= count
                                        player.data.inv.splice(itemId, 1, lItem)
                                    }
                                    if(player.data.inv.length == 0) player.data.inv = undefined

                                    EStats('ages/players', player.id, 'inv', [player.data.inv])
                                    EStats('ages/objects', object.id, 'rooms', [object.data.rooms])
                                    interaction.editReply({content: `> Вы выбросили предмет ${gItem.data.emoji}`, embeds: [], components: []})
                                }catch{
                                    interaction.editReply({content: `> Комната переполнена 📦`, embeds: [], components: []})
                                }
                            }else{
                                interaction.editReply({content: `> Комната переполнена 📦`, embeds: [], components: []})
                            }
                        }, 2500)
                    }else{
                        interaction.editReply({content: `> Вы указали неверное число 🔢`, embeds: [], components: []})
                    }
                }else if(act == 'back'){
                    try{
                        let options = await joinItems(items, player.data.inv)
                        if(options.length == 0) throw new Error("Ваш инвентарь пуст")
        
                        interaction.update({
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
                                            options: options
                                        }
                                    ]
                                }
                            ]
                        })
                    }catch(error){
                        interaction.update({content: `> Ошибка. ${error.message} ⛔`, embeds: [], components: []})
                    }
                }
            }catch(error){
                interaction.update({content: `> Ошибка. ${error.message} ⛔`, embeds: [], components: []})
            }
        }
    }
})
const {
    client, REST, Routes,
    Config, prefix, timeOfDelete,
    guildBase, guildAges, guildBD, 
    rpGuilds, cmdParametrs, toChannelName, random,
    haveRole, giveRole, removeRole,
    sendLog, createLore, createEx,
    createCom, SlashCom, BDentity,
    GStats, AStats, EStats,
    DStats, RPF} = require('../bot.js')

const guild = guildAges
const getUnicode = require('emoji-unicode')

console.log(`[bot-ages ready]`)

async function joinItems(items, inv){
    let returnItems = []
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
    return returnItems
}

SlashCom('wait', 'инвентарь', {
    name: 'инвентарь',
    description: 'Показывает текущий инвентарь',
    type: 'CHAT_INPUT'
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

    if(!mb && !dm) sendLog(message.member, message.channel, 'rp', 'Отправил сообщение', '0', message.content)
}})

client.on('interactionCreate', async interaction => {
    var items = await GStats("ages/items")
    var players = await GStats("ages/players")
    var objects = await GStats("ages/objects")
    var player = players.find(player => player.data.user == interaction.user.id)

    if(interaction.isCommand()){
        if(interaction.commandName == 'инвентарь'){
            if(player != undefined){
                if(player.data.inv != undefined){
                    let options = await joinItems(items, player.data.inv)
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
                }else{
                    interaction.reply({content: "> Ваш инвентарь пуст ⛔", ephemeral: true})
                }
            }else{interaction.reply({content: "> Ваш инвентарь пуст ⛔", ephemeral: true})}
        }
    }

    if(interaction.isSelectMenu()){
        let type = interaction.customId.split('_')[0]
        let act = interaction.customId.split('_')[1]
        let data = interaction.customId.split('_')[2]
        let value = interaction.values[0]

        if(type == 'invent' && act == 'open'){
            let lItem = player.data.inv.find(item => item.codename == value)
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
                    label: 'Выбросить',
                    customId: `invent_drop_${value}`,
                    style: 'DANGER'
                },
                {
                    type: 'BUTTON',
                    label: 'Передать',
                    customId: `invent_trade_${value}`,
                    style: 'SUCCESS'
                },
                {
                    type: 'BUTTON',
                    label: 'Вернуться',
                    customId: `invent_back_${value}`,
                    style: 'SECONDARY'
                }
            ]
            if(!Config.itemTypes[gItem.data.type].usable) itemComponents.splice(0,1)

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
        }else if(type == 'invent' && act == 'key'){
            let object = objects.find(object => object.data.cid == value)
            let lItem = player.data.inv.find(item => item.codename == data)
            let gItem = items.find(fItem => fItem.data.codename == lItem.codename)

            if(object.data.status != undefined){
                if(gItem.data.convar == object.id){
                    interaction.update({content: "> Процесс... 🔐", embeds: [], components: []})
                    setTimeout(() => {
                        if(object.data.status.open){
                            interaction.editReply({content: "> Вы закрыли объект 🔒"})
                            EStats("ages/objects", object.id, "status", [{open: false, ex: object.data.status.ex}])
                        }else if(!object.data.status.open){
                            interaction.editReply({content: "> Вы открыли объект 🔓"})
                            EStats("ages/objects", object.id, "status", [{open: true, ex: object.data.status.ex}])
                        }
                    }, 5000)
                }else{
                    interaction.update({content: "> Ключ не подходит к объекту 🔐", embeds: [], components: []})
                }
            }else{
                interaction.update({content: "> Этот объект невозможно закрыть ⛔", embeds: [], components: []})
            }
        }
    }

    if(interaction.isButton()){
        let type = interaction.customId.split('_')[0]
        let act = interaction.customId.split('_')[1]
        let data = interaction.customId.split('_')[2]

        if(type == 'invent' && act == 'back'){
            if(player != undefined){
                if(player.data.inv != undefined){
                    let options = await joinItems(items, player.data.inv)
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
                                ],
                            }
                        ]
                    })
                }else{interaction.update({content: "> Ваш инвентарь пуст ⛔", embeds: [], components: []})}
            }else{interaction.update({content: "> Ваш инвентарь пуст ⛔", embeds: [], components: []})}
        }else if(type == 'invent' && act == 'use'){
            let object = objects.find(object => object.data.cid == interaction.channel.parentId)
            let options = RPF.radiusSelectMenu(object.id, objects)
            let lItem = player.data.inv.find(item => item.codename == data)
            let gItem = items.find(fItem => fItem.data.codename == lItem.codename)

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
        }
    }
})
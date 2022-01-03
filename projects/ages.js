const {
    client, REST, Routes,
    Config, prefix, timeOfDelete,
    guildBase, guildAges, guildBD, 
    rpGuilds, cmdParametrs, random,
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

SlashCom('wait', 'инвентарь', {
    name: 'инвентарь',
    description: 'Показывает текущий инвентарь',
    type: 'CHAT_INPUT'
}, guild.id)

client.on('messageCreate', message => { if(message.guild.id == guild.id){
    var cA = haveRole(message.member, "[A]"),
        cB = haveRole(message.member, "[B]"),
        cC = haveRole(message.member, "[C]")
    let mb = message.author.bot;
    let dm = message.channel.type == "DM";
    let command = cmdParametrs(message.content)

    if(!mb && message.content == '!test'){
        RPF.createObjects("ages/objects", guild)
    }

    if(!mb && !dm) sendLog(message.member, message.channel, 'rp', 'Отправил сообщение', '0', message.content)
}})

client.on('interactionCreate', async interaction => {
    var items = await GStats("ages/items")
    var players = await GStats("ages/players")
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
                                        customId: `invent_${interaction.user.id}_open`,
                                        placeholder: 'Ваши предметы...',
                                        options: options
                                    }
                                ]
                            }
                        ]
                    })
                }else{
                    interaction.reply({content: "> Ваш инвентарь пуст ⛔", embeds: [], components: []})
                }
            }else{interaction.reply({content: "> Ваш инвентарь пуст ⛔", embeds: [], components: []})}
        }
    }

    if(interaction.isSelectMenu()){
        if(interaction.customId.split('_')[0] == 'invent' && interaction.customId.split('_')[2] == 'open'){
            let item = items.find(fItem => fItem.data.codename == player.data.inv.find(item => item.id == interaction.values[0]).codename)

            let emoji = getUnicode(item.data.emoji).split(' ').join('-')
            let itemComponents = [
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
            if(!Config.itemTypes[item.data.type].usable) itemComponents.splice(0,1)

            interaction.update({
                content: '> Ваш инвентарь 💼',
                embeds: [
                    {
                        author: {name: `${item.data.name}` },
                        description: item.data.description,
                        thumbnail: {url: `https://twemoji.maxcdn.com/v/13.1.0/72x72/${emoji}.png`},
                        color: Config.itemTypes[item.data.type].color
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
        }
    }

    if(interaction.isButton()){
        if(interaction.customId.split('_')[0] == 'invent' && interaction.customId.split('_')[2] == 'close'){
            interaction.update({components: []}).then(() => {
                interaction.deleteReply()
            })
        }
        if(interaction.customId.split('_')[0] == 'invent' && interaction.customId.split('_')[2] == 'back'){
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
                                        customId: `invent_${interaction.user.id}_open`,
                                        placeholder: 'Ваши предметы...',
                                        options: options
                                    }
                                ],
                            }
                        ]
                    })
                }else{interaction.update({content: "> Ваш инвентарь пуст ⛔", embeds: [], components: []})}
            }else{interaction.update({content: "> Ваш инвентарь пуст ⛔", embeds: [], components: []})}
        }
        if(interaction.customId.split('_')[0] == 'invent' && interaction.customId.split('_')[2] == 'use'){
            if()
        }
    }
})
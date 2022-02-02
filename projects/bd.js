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

const guild = guildBD

console.log(`[bot-bd ready]`)

async function awaitPutInBD(structure, channel, authorId){
    try{
        let filter = m => m.author.id == authorId
        let returnData = []

        let collection = await channel.awaitMessages({filter, max: structure.length, time: 120000, errors: ['time']})
        /* setTimeout(() => {
            for(let [id, msg] of collection){
                msg.delete()
            }
        }, 10000) */

        for(let [id, msg] of collection){
            if(msg.content == '_null'){
                returnData.push(undefined)
            }else if(msg.content == '_stop'){
                return 'stop'
            }else{
                returnData.push(msg.content)
            }
        }
        return returnData
    }catch{}
}

SlashCom('wait', 'add', {
    name: 'add',
    description: 'Добавить значение в базу данных',
    type: 'CHAT_INPUT',
    options: [
        {
            type: 'CHANNEL',
            name: 'path',
            description: 'Путь к файлу записи',
            required: true,
        }
    ],
    defaultPermission: false
}, guild.id, [
    {id: getRoleId(guild, '[A]'), type: 'ROLE', permission: true},
    {id: getRoleId(guild, '[B]'), type: 'ROLE', permission: true}
])

SlashCom('wait', 'get', {
    name: 'get',
    description: 'Получить данные в консоль',
    type: 'CHAT_INPUT',
    options: [
        {
            type: 'CHANNEL',
            name: 'path',
            description: 'Путь к файлу записи',
            required: true,
        },
        {
            type: 'NUMBER',
            name: 'id',
            description: 'ID ячейки данных',
            required: false,
        },
        {
            type: 'STRING',
            name: 'par',
            description: 'Параметр, который требуется узнать',
            required: false,
        },
    ],
    defaultPermission: false
}, guild.id, [{id: getRoleId(guild, '[A]'), type: 'ROLE', permission: true}])

SlashCom('wait', 'edit', {
    name: 'edit',
    description: 'Изменить ячейку базы данных',
    type: 'CHAT_INPUT',
    options: [
        {
            type: 'CHANNEL',
            name: 'path',
            description: 'Путь к файлу записи',
            required: true,
        },
        {
            type: 'NUMBER',
            name: 'id',
            description: 'ID ячейки базы данных',
            required: true,
        },
        {
            type: 'STRING',
            name: 'par',
            description: 'Параметр, который требуется изменить',
            required: true,
        }
    ],
    defaultPermission: false
}, guild.id, [
    {id: getRoleId(guild, '[A]'), type: 'ROLE', permission: true},
    {id: getRoleId(guild, '[B]'), type: 'ROLE', permission: true}
])

SlashCom('wait', 'del', {
    name: 'del',
    description: 'Удалить значение ячейки базы данных',
    type: 'CHAT_INPUT',
    options: [
        {
            type: 'CHANNEL',
            name: 'path',
            description: 'Путь к файлу записи',
            required: true,
        },
        {
            type: 'NUMBER',
            name: 'id',
            description: 'ID ячейки базы данных',
            required: true,
        },
    ],
    defaultPermission: false
}, guild.id, [{id: getRoleId(guild, '[A]'), type: 'ROLE', permission: true}])

client.on('messageCreate', message => { if(message.guild?.id == guild.id){
    var cA = haveRole(guild, message.author.id, "[A]"),
        cB = haveRole(guild, message.author.id, "[B]"),
        cC = haveRole(guild, message.author.id, "[C]")
    let mb = message.author.bot
    let dm = message.channel.type == "DM"
    let command = cmdParametrs(message.content)
}})

client.on('interactionCreate', async interaction => {
    if(interaction.isCommand()){
        if(interaction.commandName == 'add'){
            let channel = interaction.options.get('path').channel
            if(channel.parent != undefined){
                let structure = Config.BDs[`${channel.parent.name}_${channel.name}`]
                interaction.reply(`> Вводите данные: [${structure.join(', ')}]`)
                awaitPutInBD(structure, interaction.channel, interaction.user.id).then((data) => {
                    if(data != undefined && data != 'stop'){
                        AStats(channel, structure, data)
                        interaction.editReply('> Данные добавлены!')
                    }else{
                        interaction.editReply('> Вышло время записи данных!')
                    }
                })
            }else{
                interaction.reply(`> Указывать можно лишь каналы, но не категории!`)
            }
        }
        if(interaction.commandName == 'get'){
            let channel = interaction.options.get('path').channel
            let id = interaction.options.get('id')
            let par = interaction.options.get('par')
            if(id != undefined){id = id.value}
            if(par != undefined){par = par.value}
            
            if(channel.parent != undefined){
                interaction.reply(`> Данные получены!`)
                GStats(channel, id, par).then(console.log)
            }else{
                interaction.reply(`> Указывать можно лишь каналы, но не категории!`)
            }
        }
        if(interaction.commandName == 'edit'){
            let channel = interaction.options.get('path').channel
            let id = interaction.options.get('id').value
            let par = interaction.options.get('par').value
            if(channel.parent != undefined){
                interaction.reply(`> Введите значение`)
                awaitPutInBD(['unit'], interaction.channel, interaction.user.id).then((data) => {
                    if(data != undefined && data != 'stop'){
                        EStats(channel, id, par, data)
                        interaction.editReply('> Данные изменены!')
                    }else{
                        interaction.editReply('> Вышло время изменения данных!')
                    }
                })
            }else{
                interaction.reply(`> Указывать можно лишь каналы, но не категории!`)
            }
        }
        if(interaction.commandName == 'del'){
            let channel = interaction.options.get('path').channel
            let id = interaction.options.get('id').value
            if(channel.parent != undefined){
                interaction.reply(`> Данные удалены!`)
                DStats(channel, id)
            }else{
                interaction.reply(`> Указывать можно лишь каналы, но не категории!`)
            }
        }
    }
})
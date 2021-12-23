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

function random(min, max) {
    let rand = min + Math.random() * (max + 1 - min);
    return Math.floor(rand);
}

async function GSlashCom(cguildId){
    var commands
    if(cguildId != undefined){
        commands = await client.application.commands.fetch({guildId: cguildId})
    }else{commands = await client.application.commands.fetch()}
    return commands
} 

async function CSlashCom(data, cguildId){
    var commands = await GSlashCom(cguildId)
    if(commands.find(command => command.name == data.name) != undefined){return}
    client.application.commands.create(data, cguildId)
    console.log('create')
}

async function ESlashCom(data, cguildId){
    var commands = await GSlashCom(cguildId)
    if(commands.find(command => command.name == data.name) != undefined){return}
    client.application.commands.create(data, cguildId)
    console.log('create')
}

async function DSlashCom(name, cguildId){
    var commands = await GSlashCom(cguildId)
    var findCom = commands.find(command => command.name == name)

    if(findCom != undefined){
        findCom.delete()
    }else{return}
} 

var guild;

client.on('ready', () => {
    console.log(`${client.user.tag} ready!`);
    guild = client.guilds.cache.get('840180165665619998');

    /* cSlashCom({
        name: 'test2',
        description: 'A test command',
    }, '840180165665619998') */

    //DSlashCom('test2', '840180165665619998')

    //SlashCom('840180165665619998').then(console.log)
});

function comps(count, user){
    var comps = [{
        type: 'ACTION_ROW',
        components: []
    }]

    for (let i = 0; i < count; i++){
        comps[0].components.push({
            type: 'BUTTON',
            label: ' ',
            customId: `lockpickButton_${i}_${user}`,
            style: 'PRIMARY'
        })
    }
    comps[0].components[random(0, comps[0].components.length-1)].style = 'DANGER'
    return comps
}

var lockpickCache = new Map()

client.on('interactionCreate', async interaction => {
    console.log(lockpickCache)
    if(interaction.isApplicationCommand()){
        if(interaction.commandName == 'test'){
            interaction.deferReply()
            setTimeout(() => {
                interaction.editReply({
                    content: '> [0/5] Процесс взлома... 🔏',
                    components: comps(5, interaction.user.id)
                })
                lockpickCache.set(interaction.user.id.toString(), {user: interaction.user.id, steps: 0, count: 5})
            }, 1000)
        }
    }

    if(interaction.isButton()){
        if(interaction.customId.split('_')[0] == 'lockpickButton'){
            let status
            let data = lockpickCache.get(interaction.user.id)

            if(data != undefined && interaction.user.id == interaction.customId.split('_')[2]){
                if(interaction.component.style == 'PRIMARY'){
                    interaction.update({
                        content: '> Взлом не удался! 🔴',
                        components: []
                    }).then(() => {
                        lockpickCache.delete(interaction.user.id)
                    })
                    clearTimeout(data.timer)
                    status = false
                }
                if(interaction.component.style == 'DANGER'){
                    data.steps += 1

                    if(data.steps < data.count){
                        interaction.update({
                            content: `> [${data.steps}/${data.count}] Процесс взлома... 🔏`,
                            components: comps(5, interaction.user.id)
                        })
                    }else{
                        interaction.update({
                            content: '> Взлом удался! 🟢',
                            components: []
                        }).then(() => {
                            lockpickCache.delete(interaction.user.id)
                        })
                        clearTimeout(data.timer)
                        status = true
                    }

                    if(data.steps == 1){
                        let timer = setTimeout(() => {
                            interaction.editReply({
                                content: '> Взлом не удался! 🔴',
                                components: []
                            }).then(() => {
                                lockpickCache.delete(interaction.user.id)
                                status = false
                            })
                        }, data.count*1000)

                        data.timer = timer
                    }
                }
            }else if(data != undefined && interaction.user.id != interaction.customId.split('_')[2]){
                interaction.reply({content: '> Не вмешивайся в чужое пространтсво! 🛑', ephemeral: true})
            }else{
                interaction.message.delete()
                interaction.reply({content: '> Ошибка, повторите попытку 🔁', ephemeral: true})
            }

            console.log(status)
        }
    }
})

client.login(Config.discordTocens.testBot);
const {
    client, REST, Routes,
    Config, prefix, timeOfDelete,
    guildBase, guildAges, guildBD, 
    rpGuilds, cmdParametrs, toChannelName, random,
    getRoleId, haveRole, giveRole, removeRole,
    sendLog, createLore, createEx,
    createCom, SlashCom, EditInteraction, ErrorInteraction, BDunit,
    GStats, AStats, EStats,
    DStats} = require('../bot.js')

const guild = guildBase

console.log(`[bot-pushpin ready]`)

client.on('guildMemberAdd', (member) => {
    if(member.guild.id == Config.guilds.main){
        giveRole(member, '829423238169755658')
    }
    sendLog(member, undefined, 'other', 'Новый пользователь', true, `${member.user.tag} присоеденился к сообществу!`)
})

client.on('messageCreate', message => { if(message.guild.id == guild.id){
    var cA = haveRole(message.member, "[A]"),
        cB = haveRole(message.member, "[B]"),
        cC = haveRole(message.member, "[C]")
    let mb = message.author.bot
    let dm = message.channel.type == "DM"
    let command = cmdParametrs(message.content)

    if(!mb && !dm) sendLog(message.member, message.channel, 'other', 'Отправил сообщение', '0', message.content)

    if(message.channel.id == Config.channelsID.dev_process && message.webhookId == Config.webhooks.github && !dm && mb){
        createCom(message.embeds[0],message)
        setTimeout(() =>{message.delete()}, timeOfDelete)
    }
}})
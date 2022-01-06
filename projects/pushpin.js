const {
    client,
    Config, prefix, timeOfDelete,
    guildBase, guildAges, guildBD, 
    rpGuilds, cmdParametrs, toChannelName, random,
    haveRole, giveRole, removeRole,
    sendLog, createLore, createEx,
    createCom, SlashCom, BDentity,
    GStats, AStats, EStats,
    DStats} = require('../bot.js')

const guild = guildBase

console.log(`[bot-pushpin ready]`)

client.on('messageCreate', message => { if(message.guild.id == guild.id){
    var cA = haveRole(message.member, "[A]"),
        cB = haveRole(message.member, "[B]"),
        cC = haveRole(message.member, "[C]")
    let mb = message.author.bot;
    let dm = message.channel.type == "DM";
    let command = cmdParametrs(message.content)

    if(!mb && !dm) sendLog(message.member, message.channel, 'other', 'Отправил сообщение', '0', message.content)

    if(message.channel.id == Config.channelsID.dev_process && message.webhookId == Config.webhooks.github && !dm && mb){
        createCom(message.embeds[0],message)
        setTimeout(() =>{message.delete()}, timeOfDelete)
    }
}})
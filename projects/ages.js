const {
    client, REST, Routes,
    Config, prefix, timeOfDelete,
    guild, guildAges, guildBD, 
    rpGuilds, cmdParametrs, random,
    haveRole, giveRole, removeRole,
    sendLog, createLore, createEx,
    createCom, SlashCom, BDentity,
    GStats, AStats, EStats,
    DStats} = require('../bot.js')

console.log(`[bot-ages ready]`)

client.on('messageCreate', message => { if(message.guild.id == guildAges.id){
    var cA = haveRole(message.member, "[A]"),
        cB = haveRole(message.member, "[B]"),
        cC = haveRole(message.member, "[C]")
    let mb = message.author.bot;
    let mg = message.channel.type == "DM";
    let comand = cmdParametrs(message.content)

    console.log(`${message.author.username} написал сообщение в ${guildAges.name}`)
    
    if(!mb && !mg) sendLog(message.member, message.channel, 'rp', 'Отправил сообщение', '0', message.content)
}})
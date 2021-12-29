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

console.log(`[bot-bd ready]`)

client.on('messageCreate', message => { if(message.guild.id == guildBD.id){
    var cA = haveRole(message.member, "[A]"),
        cB = haveRole(message.member, "[B]"),
        cC = haveRole(message.member, "[C]")
    let mb = message.author.bot;
    let mg = message.channel.type == "DM";
    let comand = cmdParametrs(message.content)

    console.log(`${message.author.username} написал сообщение в ${guildBD.name}`)
    
    if(!mb && !mg && comand.com == "Add" && cA){
        AStats(comand.oarg[0], comand.barg)
        setTimeout(() => {message.delete()}, 15000)
    }
    if(!mb && !mg && comand.com == "Get" && cA){
        GStats(comand.oarg[0]).then(console.log)
        setTimeout(() => {message.delete()}, 15000)
    }
    if(!mb && !mg && comand.com == "Edit" && cA){
        EStats(comand.oarg[0], comand.oarg[1], comand.oarg[2], comand.barg[0], comand.oarg[3])
        setTimeout(() => {message.delete()}, 15000)
    }
    if(!mb && !mg && comand.com == "Del" && cA){
        DStats(comand.oarg[0], comand.oarg[1])
        setTimeout(() => {message.delete()}, 15000)
    }
}})
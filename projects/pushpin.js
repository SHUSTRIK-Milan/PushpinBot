const {
    client, REST, Routes,
    Config, prefix, timeOfDelete,
    guildBase, guildAges, guildBD, 
    rpGuilds, cmdParametrs, random,
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

    if(message.channel.id == Config.channelsID.dev_process && message.webhookId == '822500483826450454' && !dm && mb){
        createCom(message.embeds[0],message)
        setTimeout(() =>{message.delete()}, timeOfDelete)
    }

    if(command.com == `refreshFA` && (haveRole(message.member, `833778527609552918`) || head || rpCreator) && !mb && !dm){
        setTimeout(() => message.delete(), timeOfDelete);
        let channel
        let specialChannel = [
            {id: guild.roles.everyone, deny: 'VIEW_CHANNEL'},
            {id: `833226140755689483`, allow: 'VIEW_CHANNEL'},
            {id: `833227050550296576`, allow: 'VIEW_CHANNEL'},
            {id: `830061387849662515`, allow: 'VIEW_CHANNEL'},
            {id: `856092976702816287`, allow: 'VIEW_CHANNEL'},
        ]
        try{
            for(let channelID of guild.channels.cache){
                channel = guild.channels.cache.get(channelID[0])
                if(channel != undefined){
                    if(channel.parentID == Config.channelsID.fast_access){channel.delete()}
                }
            }
            setTimeout(() =>{
                if(channel != undefined){
                    for(let obj of Config.objects){
                        if(obj.open){
                            guild.channels.create(`«${obj.name}»`, {type: 'text', topic: `${obj.id}-${Config.globalObjects.find(gobj => gobj.id == obj.id).name}`, parent: Config.channelsID.fast_access})
                        }else if(!obj.open){
                            guild.channels.create(`«${obj.name}»`, {type: 'text', topic: `${obj.id}-${Config.globalObjects.find(gobj => gobj.id == obj.id).name}`, parent: Config.channelsID.fast_access, permissionOverwrites: specialChannel})
                        }
                    } 
                }
            }, timeOfDelete*5)
        }catch(error){console.log(error)}
    }

    if(command.com == `refreshIDobj` && (haveRole(message.member, `833778527609552918`) || head || rpCreator) && !mb && !dm){
        setTimeout(() => message.delete(), timeOfDelete);
        let channelsRefr = []
        for(let channel of guild.channels.cache) if(channel[1].parentID != undefined) channelsRefr.push(channel[1])
        try{
            for(let obj of Config.objects){
                for(let room of obj.rooms){
                    let channel = channelsRefr.find(channel => channel.name.toLowerCase() == room.toLowerCase() && channel.parent.id == obj.cId)
                    channel.setTopic(`${obj.id}-${Config.globalObjects.find(gobj => gobj.id == obj.id).name}`)
                }
            }
        }catch(error){console.log(error)}
    }

    if(command.com == `commands` && head && !mb && !dm){
        setTimeout(() => message.delete(), timeOfDelete);
        client.interaction.getApplicationCommands(config.guild_id).then(console.log);
    }
}})
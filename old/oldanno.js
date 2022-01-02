// ОПОВЕЩЕНИЕ О СБОРАХ
    /* setInterval(async () => {
        var date = new Date()
        if(date.getUTCDay() == 5 ||
        date.getUTCDay() == 6 ||
        date.getUTCDay() == 0){
            let channel = guild.channels.cache.get(Config.channelsID.announcements)
            let lastMessage = await channel.messages.fetch()

            lastMessageBot = lastMessage.filter(msg => msg.author.bot)
            if(lastMessageBot.size == 0){
                lastMessage = lastMessage.first()
            }else{
                lastMessage = lastMessageBot.first()
            }

            let dateOfMessage = new Date(lastMessage.createdTimestamp)

            if(date.getUTCHours()+3 == 17 && (dateOfMessage.getUTCFullYear() != date.getUTCFullYear() || dateOfMessage.getUTCMonth() != date.getUTCMonth() || dateOfMessage.getUTCDate() != date.getUTCDate())){
                channel.send(`> <@&836269090996879387>, сбор, дамы и господа!\nВсем приятной и интересной игры! 📌`)
            }
        }
    }, 60000) */
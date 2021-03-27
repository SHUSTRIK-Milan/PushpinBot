const Discord = require('discord.js');
const client = new Discord.Client();
const prefix = '!';

const logsId = `825078587312177162`;
const commitsID = `823476184388993054`;

const street = [
    {
        name: 'Белт-Паркуэй',
        id: '001',
        radius: ['Бродвей'],
        desc: 'Прекрасный город. Отличное начало жизни в этом городе.',
        objects: [
            {
                name: 'Магазин',
                id: '001',
                addCondition: ''
            },
            {
                name: 'Туалет',
                id: '0011',
                addCondition: 'Магазин'
            },
            {
                name: 'Дом-1',
                id: '002',
                addCondition: ''
            }
        ]
    },
    {
        name: 'Бродвей',
        id: '002',
        radius: ['Белт-Паркуэй', 'Парк-авеню'],
        desc: 'Центр города.',
        objects: [
            {
                name: 'Полицейский Департамент',
                id: '001',
                addCondition: ''
            }
        ]
    },
    {
        name: 'Парк-авеню',
        id: '003',
        radius: ['Бродвей'],
        desc: 'Самая зеленая улица города.',
        objects: [
            {
                name: 'Завод',
                id: '001',
                addCondition: ''
            }
        ]
    }
];


client.on('ready', () => {
  console.log(`${client.user.tag} ready!`);
});

client.on('message', message => {
    const command = message.content.split(' ',2);
    const args = message.content.slice(command.join(' ').length+1);

    let mb = message.author.bot;

    function sendLog(cat,act,status,add){
        let img;
        if (status == 'Успешно') img = `https://i.imgur.com/cjSSwtu.png`;
        if (status == 'Ошибка') img = `https://i.imgur.com/utuBexR.png`;

        if (message.guild != null && mb == false && add.slice(0,(`!осмотреться`).length) != `!осмотреться` && add.slice(0,(`!идти`).length) != `!идти` && message.channel.id != commitsID){
            client.channels.cache.get(logsId).send({embed: {
                color: 14560833,
                author: {
                    name: message.author.username,
                    icon_url: message.author.avatarURL()
                },
                thumbnail: {
                    url: img
                },
                title: `[${cat}] ${act}`,
                fields: [{
                    name: `[${status}] Допольнительно:`,
                    value: `${add}`
                }],
                
                timestamp: new Date()
                }
            });

            return;
        }else{
            return;
        }
    };

    sendLog(`Общее`,`Отправил сообщение.`,`Успешно`,message.content);

    if (message.channel.name == 'test' && mb == false){
        function member(nick, name, money, status, car) {
            this.nick = nick;
            this.name = name;
            this.money = money;
            this.status = status;
            this.car = car;
        };

        async function GetStats(idChl, idMsg) {
            let channel = client.channels.cache.get(idChl);
            let msg = await channel.messages.fetch(idMsg);
            try{
                mainArray = [];
                let messageNormal = msg.content.split('\n');

                for(let msg of messageNormal){
                    let split = msg.split(':');
                    if (split[0] != ''){
                        mainArray.push(split);
                    }else{
                        split.splice(0,1);
                        mainArray.push(split);
                    }
                };
                membersArray = [];

                for(let i of mainArray){
                    var newMember = new member(i[0], i[1], i[2], i[3], i[4]);
                    membersArray.push(newMember);
                };

                return membersArray;
            }catch{
                return null;
            };
        };

        /* GetStats(`825075071403032626`,`825075316161642496`).then(members => {
            console.log(members);
        }); */
    };

    if (command[0] == `${prefix}осмотреться` && mb == false){
        message.delete();
        let homestreet = street.find(st => st.name.toLowerCase() == message.channel.parent.name.toLowerCase());

        if(message.channel.name == "улица"){
            let objects = [];

            for (let pobj of homestreet.objects) if (pobj.addCondition == '') objects.push(pobj.name);

            if (homestreet != null){
                message.author.send(`Соседние улицы с ${homestreet.name}: ${homestreet.radius.join(', ')}.\nБлижайшие объекты: ${objects.join(', ')}.`);
                sendLog(`Общее`,`Осмотрелся на улице.`,`Успешно`,`Вывод: Соседние улицы с ${homestreet.name}: ${homestreet.radius.join(', ')}.\nБлижайшие объекты: ${objects.join(', ')}.`);
            };
        }else if(homestreet.objects.filter(ob => ob.addCondition.toLowerCase() == message.channel.name.toLowerCase()) != null){
            let objects = [];

            for (let pobj of homestreet.objects) if (pobj.addCondition.toLowerCase() == message.channel.name.toLowerCase()) objects.push(pobj.name);

            if (homestreet != null && objects != null){
                message.author.send(`Ближайшие помещения: ${objects.join(', ')}.`);
                sendLog(`Общее`,`Осмотрелся в объекте.`,`Успешно`,`Вывод: Ближайшие помещения: ${objects.join(', ')}.`);
            };
        }else{
            message.author.send(`Вызов команды \`осмотреться\` должны выполнятся на улицах или внутри помещений.`);
            sendLog(`Общее`,`Попытался осмотреться.`,`Ошибка`,`Вызов команды \`осмотреться\` должны выполнятся на улицах или внутри помещений.`);
        };
    };

    if (command[0] == `${prefix}идти` && mb == false){
        message.delete();
        let homestreet = street.find(st => st.name == message.channel.parent.name);

        if (command[1] == "на" && message.channel.name == 'улица'){
            let walkway = homestreet.radius.find(st => st.toLowerCase() == args.toLowerCase());

            if (walkway != null && message.channel.parent.permissionOverwrites.get(message.author.id) != null){
                let cat = client.channels.cache.find(cat => cat.name == walkway);
                if (cat.type == 'category'){
                    client.channels.cache.find(cat => cat.name == walkway).updateOverwrite(message.author, { VIEW_CHANNEL: true });
                    message.channel.parent.permissionOverwrites.get(message.author.id).delete();
                    sendLog(`Общее`,`Пошел.`,`Успешно`,`Перешел с ${homestreet.name} на ${walkway}.`);
                };
            }else if (walkway == null && street.find(st => st.name.toLowerCase() == args.toLowerCase()) != null){
                message.author.send(`${args} не является соседней улицей с ${homestreet.name}.`);
                sendLog(`Общее`,`Попытался пойти.`,`Ошибка`,`Вывод: ${args} не является соседней улицей с ${homestreet.name}.`);
            }else{
                message.author.send(`Вероятнее всего улицы ${args} нет, либо вы ввели ее неправильно.`);
                sendLog(`Общее`,`Попытался пойти.`,`Ошибка`,`Вывод: Вероятнее всего улицы ${args} нет, либо вы ввели ее неправильно.`);
            };
        }else if (command[1] == "в"){
            let walkway = homestreet.objects.find(st => st.name.toLowerCase() == args.toLowerCase());
        }else{
            message.author.send(`Вызов команды \`идти\` должны выполнятся с дополнительными аргументами: на - для перехода на улицу или в - для перехода в помещение/объект.`);
            sendLog(`Общее`,`Попытался пойти.`,`Ошибка`,`Вывод: Вызов команды \`идти\` должны выполнятся с дополнительными аргументами: на - для перехода на улицу или в - для перехода в помещение/объект.`);
        }
    };

    if(command[0] == `${prefix}send` && message.author.id == `621917381681479693`){	
        if(mb) return;	
        message.delete();	
        message.channel.send(`${args}`);	
    };

    if(command[0] == `${prefix}очистить` && mb == false && message.guild.member(message.author).roles.cache.get(`822493460493500436`) != null){
        message.delete();
        let arg = parseInt(command[1]);
        
        if (arg > 0){
            console.log(arg);
            message.channel.messages.fetch({limit: 10})
            .then(message => {
                message.delete();
                console.log(message.content);
            });
            sendLog(`Админ`,`Удалил сообщения.`,`Успешно`,`Удалено ${arg} сообщений.`);
        }else{
            sendLog(`Админ`,`Попытался удалить сообщения.`,`Ошибка`,`Неверный аргумент.`);
        };
    };

});

client.login(process.env.BOT_TOKEN);

const Discord = require('discord.js')
const Config = require('./config');
const client = new Discord.Client();

var guild;

client.on('ready', () => {
    console.log(`${client.user.tag} ready!`);
    guild = client.guilds.cache.get('840180165665619998');
});

let objects = [
    {
        name: 'Черчель Стрит',
        id: '1',
        cId: '849709660579954748',
        open: true,
        rooms: ['улица',
                'стена-славы-уличных-художников',
                'скейтпарк',]
    },
    {
        name: 'Главная площадь',
        id: '1',
        cId: '863422966498197524',
        open: true,
        rooms: ['главная-площадь',
                'тир',
                'тележка-с-корн-догами',
                'тележка-с-сувенирами',
                'тележка-попкорна-и-сладкой-ваты']
    }
]



client.login(Config.discordTocens.testBot);
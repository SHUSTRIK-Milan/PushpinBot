const Discord = require('discord.js');
const client = new Discord.Client();
const prefix = '!';

let streets = [
    {
        name: 'Йорк',
        radius: ['Ирвин','Рурк']
    },
    {
        name: 'Рурк',
        radius: ['Йорк','Ирвин']
    }
];

client.on('ready', () => {
  console.log(`${client.user.tag} ready!`);
});

client.on('message', message => {
    /* if ( != undefined){
        print("Вы перешли на улицу Рурк")
    }else{

    } */
    console.log(streets.find(street => street.radius == message.channel.name));
});

client.login(process.env.BOT_TOKEN);
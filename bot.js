const Discord = require('discord.js');
const client = new Discord.Client();
const prefix = '!';

let streets = [
    {
        name: 'Йорк',
        radius: ['Ирвин', 'Рурк']
    },
    {
        name: 'Рурк',
        radius: ['Йорк', 'Ирвин']
    }
];

let test = [

    

]

client.on('ready', () => {
  console.log(`${client.user.tag} ready!`);
});

client.on('message', message => {
    /* if ( != undefined){
        print("Вы перешли на улицу Рурк")
    }else{

    } */
    message.channel.send(`Соседняя улица: ${streets.find(st => st.radius.find(st => st == message.channel.name)).name}`);
    console.log(streets.find(st => st.radius.find(st => st == message.channel.name)));
});

client.login(process.env.BOT_TOKEN);
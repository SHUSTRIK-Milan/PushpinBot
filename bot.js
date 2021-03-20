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


client.on('ready', () => {
  console.log(`${client.user.tag} ready!`);
});

client.on('message', message => {
    /* if ( != undefined){
        print("Вы перешли на улицу Рурк")
    }else{

    } */
    let out = streets.find(st => st.radius.find(st => st == message.channel.name))

    //message.channel.send(`Соседняя улица: ${out.name}`);
    console.log(out);
    console.log(out[1]);
});

client.login(process.env.BOT_TOKEN);
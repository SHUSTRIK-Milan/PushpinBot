const Discord = require('discord.js');
const client = new Discord.Client();
const prefix = '!';

let streets = {Street:[
    {
        name: 'Йорк',
        radius: ['Ирвин', 'Рурк']
    },
    {
        name: 'Рурк',
        radius: ['Йорк', 'Ирвин']
    }
]};

client.on('ready', () => {
  console.log(`${client.user.tag} ready!`);
});

client.on('message', message => {
    /* if ( != undefined){
        print("Вы перешли на улицу Рурк")
    }else{

    } */
    console.log(streets.Street.find(st => st.name == "Рурк"));
    console.log(streets);
    console.log(streets.Street);
});

client.login(process.env.BOT_TOKEN);
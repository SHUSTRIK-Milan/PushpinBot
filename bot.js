const Discord = require('discord.js');
const client = new Discord.Client();
const prefix = '!';

let streets = [
    {
        name: 'Йорк',
        id: '001',
        radius: ['Ирвин', 'Рурк']
    },
    {
        name: 'Рурк',
        id: '002',
        radius: ['Йорк', 'Ирвин']
    },
    {
        name: 'Ирвин',
        id: '003',
        radius: ['Рурк', 'Йорк']
    }
];


client.on('ready', () => {
  console.log(`${client.user.tag} ready!`);
});

client.on('message', message => {
    let mb = message.author.bot;

    if (mb != true){
        let out = streets.find(st => st.name == test);

        if (out != null){
            message.channel.send(`Соседняя улица: ${out.radius.join(', ')}`);
            console.log(out);
        };
    };
});

client.login(process.env.BOT_TOKEN);
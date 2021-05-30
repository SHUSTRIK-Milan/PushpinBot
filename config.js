module.exports.channelsID = {
    welcome: `822528060196388926`,
    devblog: `837393627360788480`,
    commits: `837393666527985694`,
    /////////main[OOC]////////////
    main: `837393382229409823`,
    chatMain: `837393400121524259`,
    qa: `837393416202878989`,
    offers: `837393458435063886`,
    voiceMain: `837397109463711744`,
    /////////Project Rules//////
    projectRules: `837395201726742528`,
    generalRules: `837395238360055879`,
    generalTerm: `837395471877013595`,
    /////////Lore///////////////
    lore: `837397940073922610`,
    generalLore: `837398017325269002`,
    /////////Team-General/////////////
    serverMsg: `838002676709064754`,
    logs: `838002959610675221`,
    bd: `838002825765322792`,
};

module.exports.BLChannelsID = {
    welcome: `822528060196388926`,
    devblog: `837393627360788480`,
    commits: `837393666527985694`,
    serverMsg: `838002676709064754`,
    logs: `838002959610675221`,
    bd: `838002825765322792`,
};

module.exports.discordTocens = {
    testBot: `ODQwMjMwNTMxNjYwNTEzMjgw.YJVLqQ.Lr7HGn01gH50OUcHrHr4Rl-BpSM`
};

module.exports.streets = [
    {
        name: 'Белт-Паркуэй',
        id: '001',
        radius: ['Бродвей'],
        objects: [
            {
                name: 'Улица',
                id: '001',
                addCondition: ''
            },
            {
                name: 'Магазин',
                id: '002',
                addCondition: ''
            },
            {
                name: 'Туалет',
                id: '0021',
                addCondition: 'Магазин'
            },
            {
                name: 'Дом-1',
                id: '003',
                addCondition: ''
            },
            {
                name: 'Дом-2',
                id: '004',
                addCondition: ''
            } 
        ]
    },
    {
        name: 'Бродвей',
        id: '002',
        radius: ['Белт-Паркуэй', 'Парк-авеню'],
        objects: [
            {
                name: 'Улица',
                id: '001',
                addCondition: ''
            },
            {
                name: 'Полицейский-Департамент',
                id: '002',
                addCondition: ''
            }
        ]
    },
    {
        name: 'Парк-авеню',
        id: '003',
        radius: ['Бродвей'],
        objects: [
            {
                name: 'Улица',
                id: '001',
                addCondition: ''
            },
            {
                name: 'Завод',
                id: '002',
                addCondition: ''
            }
        ]
    }
];
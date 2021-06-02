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
        name: 'Черчель-Стрит',
        id: '001',
        radius: ['Бродвей'],
        objects: [
            {
                name: 'Улица',
                id: '001',
                addCondition: ''
            }
        ]
    },
    {
        name: 'Бродвей',
        id: '003',
        radius: ['Черчель-Стрит','Либерти','Фримонт'],
        objects: [
            {
                name: 'Улица',
                id: '001',
                addCondition: ''
            }
        ]
    },
    {
        name: 'Либерти',
        id: '003',
        radius: ['Бродвей'],
        objects: [
            {
                name: 'Улица',
                id: '001',
                addCondition: ''
            }
        ]
    },
    {
        name: 'Фримонт',
        id: '003',
        radius: ['Бродвей'],
        objects: [
            {
                name: 'Улица',
                id: '001',
                addCondition: ''
            }
        ]
    },
    {
        name: 'Конарв',
        id: '002',
        radius: ['Фримонт','Либерти','Белт-Паркуй'],
        objects: [
            {
                name: 'Улица',
                id: '001',
                addCondition: ''
            },
        ]
    },
    {
        name: 'Белт-Паркуй',
        id: '003',
        radius: ['Конарв'],
        objects: [
            {
                name: 'Улица',
                id: '001',
                addCondition: ''
            }
        ]
    },
];
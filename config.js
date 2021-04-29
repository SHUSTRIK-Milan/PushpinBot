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
    teamGeneral: `837393532808986625`,
    chatTeam: `822493674738941963`,
    head: `837394245660442624`,
    logs: `837395554484486145`,
    bd: `837395642677985280`,
    discus: `833617702832046121`,
    voiceTeam: `837394291835404360`,
    /////////Team-Admin/////////////
    teamAdmin: `837395873637728277`,
    chatAdmin: `837396026545405962`,
    headAdmin: `837396050943148133`,
    /////////Team-Helper/////////////
    teamHelper: `837395933838049290`,
    chatHelper: `837396131129851915`,
    headHelper: `837396148183629904`,
    resultHelper: `837396230841040957`,
    /////////Team-Moders/////////////
    teamModers: `837395990927376424`,
    chatModers: `837396443593572362`,
    warns: `837396506104430592`
};

module.exports.BLChannelsID = {
    welcome: `822528060196388926`,
    devblog: `837393627360788480`,
    commits: `837393666527985694`,
    head: `837394245660442624`,
    logs: `837395554484486145`,
    bd: `837395642677985280`,
};

module.exports.streets = [
    {
        name: 'Белт-Паркуэй',
        id: '001',
        radius: ['Бродвей'],
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
            },
            {
                name: 'Дом-2',
                id: '003',
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
        objects: [
            {
                name: 'Завод',
                id: '001',
                addCondition: ''
            }
        ]
    }
];
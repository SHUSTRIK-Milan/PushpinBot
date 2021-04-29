module.exports.channelsID = {
    welcome: `822528060196388926`,
    devblog: `829429779207815229`,
    commits: `829434075688206347`,
    /////////main[OOC]////////////
    main: `814795850885627965`,
    chatMain: `822529113239453706`,
    qa: `822885506270232651`,
    offers: `831827280379641866`,
    voiceMain: `814795850885627969`,
    /////////Project Rules//////
    projectRules: `835433939812089856`,
    generalRules: `835434150596837446`,
    generalTerm: `835434387293339658`,
    /////////Lore///////////////
    lore: `836472670899404810`,
    generalLore: `836481279377539112`,
    /////////Team-General/////////////
    teamGeneral: `822762670058766336`,
    teamDev: `829995884150390795`,
    chatTeam: `822493674738941963`,
    head: `831214097005281290`,
    logs: `825078587312177162`,
    bd: `833225101218152459`,
    discus: `833617702832046121`,
    voiceTeam: `835201663534891060`,
    /////////Team-Admin/////////////
    teamAdmin: `835628015986671626`,
    chatAdmin: `835628842415947856`,
    headAdmin: `835628904084406272`,
    /////////Team-Helper/////////////
    teamHelper: `835204987285274624`,
    chatHelper: `833779481902710825`,
    headHelper: `835621333223604274`,
    resultHelper: `835190639578316821`,
    /////////Team-Moders/////////////
    teamModers: `835205499397472296`,
    chatModers: `835205687638360115`,
    punishments: `833779056347709462`
};

module.exports.BLChannelsID = {
    welcome: `822528060196388926`,
    devblog: `829429779207815229`,
    commits: `829434075688206347`,
    head: `831214097005281290`,
    logs: `825078587312177162`,
    bd: `833225101218152459`
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
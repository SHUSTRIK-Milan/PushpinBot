module.exports.catID = {
    main: `814795850885627965`, //main[ooc]
    rules: `835433939812089856`, //projectRules
    lore: `836472670899404810`, //lore
    team_general: `822762670058766336`, //team-general
    team_admin: `835628015986671626`, //team-admin
    team_helper: `835204987285274624`, //team-helper
    team_moders: `835205499397472296` //team-moders
};

module.exports.channelsID = {
    logsId: `825078587312177162`,//logs
    commitsID: `829434075688206347`,//commits
    infoID: `822528060196388926`,//welcome
    devID: `822796606952177664`,//devblog
    mainIDusers: `822529113239453706`,//chat
    questID: `822885506270232651`,//qa
    mainIDteam: `822493674738941963`,//chat
    headsID: `831214097005281290`,//heads
    devTeamID: `829995884150390795`,//dev-team
    generalR: `835434150596837446`,//general rules
    generalT: `835434387293339658`//general terminology
};

module.exports.BLChannelsID = {
    logsId: `825078587312177162`,
    commitsID: `829434075688206347`,
    infoID: `822528060196388926`,
    devID: `822796606952177664`,
    headsID: `831214097005281290`,
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
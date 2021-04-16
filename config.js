module.exports.channelsID = {
    logsId: `825078587312177162`,
    commitsID: `823476184388993054`,
    infoID: `822528060196388926`,
    devID: `822796606952177664`,
    mainIDusers: `822529113239453706`,
    questID: `822885506270232651`,
    mainIDteam: `822493674738941963`,
    headsID: `831214097005281290`,
    devTeamID: `829995884150390795`
};

module.exports.BLChannelsID = {
    logsId: `825078587312177162`,
    commitsID: `823476184388993054`,
    infoID: `822528060196388926`,
    devID: `822796606952177664`,
    headsID: `831214097005281290`,
};

module.exports.street = [
    {
        name: 'Белт-Паркуэй',
        id: '001',
        radius: ['Бродвей'],
        desc: 'Прекрасный город. Отличное начало жизни в этом городе.',
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
        desc: 'Центр города.',
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
        desc: 'Самая зеленая улица города.',
        objects: [
            {
                name: 'Завод',
                id: '001',
                addCondition: ''
            }
        ]
    }
];
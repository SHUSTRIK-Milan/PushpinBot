async function updateChannels(){
    let allChannels = guild.channels.cache;
    let channelsID = [];
    let pawStreets = [];
    let pawObjects = [];

    for (channel in Config.channelsID) channelsID.push(Config.channelsID[channel]);
    for (outAllChannel of allChannels){
        for(street of Config.streets) if(`«${street.name.toLowerCase()}»` == outAllChannel[1].name.toLowerCase()) channelsID.push(`${outAllChannel[0]}`)
        for(street of Config.streets) if(street.objects.find(object => object.name.toLowerCase() == outAllChannel[1].name.toLowerCase()) != undefined) channelsID.push(`${outAllChannel[0]}`)
    };

    for (outAllChannel of allChannels){
        let pawStreet = Config.streets.find(street => `«${street.name.toLowerCase()}»` == outAllChannel[1].name.toLowerCase());
        if(pawStreet != undefined) pawStreets.push(pawStreet);
        
        for(street of Config.streets){
            pawObject = street.objects.find(object => object.name.toLowerCase() == outAllChannel[1].name.toLowerCase());
            if(pawObject != undefined) pawObjects.push(pawObject);
        };

        if(channelsID.find(channel => channel == outAllChannel[0]) == undefined){
            guild.channels.cache.get(outAllChannel[0]).delete();
        };
    };

    let oStreets = Config.streets.filter(street => !pawStreets.includes(street));
    let oObjects = [];
    for(street of Config.streets){
        fobjects = street.objects.filter(object => !pawObjects.includes(object));
        for(fo of fobjects) oObjects.push(fo);
    };

    for (street of oStreets){
        var cat = await guild.channels.create(`«${street.name}»`,{
            type:'category', permissionOverwrites:[{id:`814795850885627964`,deny:'VIEW_CHANNEL'}]
        });
        
        for(object of oObjects){
            if(street.objects.find(obj => obj == object) != undefined) guild.channels.create(`${object.name}`,{
                type:'text', parent:cat, permissionOverwrites:[{id:`814795850885627964`,deny:'VIEW_CHANNEL'}]
            });
        };
    };
};
// тест

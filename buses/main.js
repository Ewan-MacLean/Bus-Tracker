(function(){

    let busIcon = L.icon({iconUrl: 'bus.png', iconSize: [30,40]});
    // set the map coordinates
    let map = L.map('theMap').setView([44.650627,-63.597140], 14);
    // apply bus locations to the bus elements
    busLayer = L.geoJSON(null,{pointToLayer: function (feature, latlng) {

        //adding the bus info popup (OLD VERSION)
        // let popup = L.popup();

        // busLayer.addEventListener('click',onBusClick)

        // function onBusClick(event) {
        //     popup
        //     .setLatLng(event.latlng)
        //     .setContent('You just clicked on a bus at coordinates: ' + latlng + '   route: '  +  feature.properties.route +  ' direction: ' + feature.properties.bearing )
        //     .openOn(map)
        // }  

        // for each element, return a bus Icon with bearing specific to the 
        // location data passed up from generateGeoFromLatLong.
        // then add location data to the popup that appears upon
        // clicking the bus.
        // ...Then add it to the map
        return L.marker(latlng,
            {
                icon: busIcon,
                rotationAngle: feature.properties.bearing
            }).bindPopup(function (layer) {
                return 'ROUTE: ' + layer.feature.properties.route + '   Direction: ' + layer.feature.properties.bearing + '°' + '   at ' + latlng
            })

            
            
    }}).addTo(map);

    // set the map display
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);


    // show initial map with buses
    moment(map)
    // upate locations every 8 seconds
    setInterval(moment,3000,map);

})();

    // generate bus location data
function generateGeoFromLatLong(lat,long,bearing,routeID)
{
    return ({
        "type": "Feature",
        "geometry": {
            "type": "Point" ,
            "coordinates": [long,lat]
        },
        "properties": {
            "route": routeID,
            "bearing": bearing
        }
    });

};

// this function retrieves the live data for the bus locations
function moment(map) {
    fetch('http://hrmbusapi.herokuapp.com/')
    .then(res=>res.json())
    .then(json=>{
        busLayer.clearLayers();
        // for each element in the routeID array. Create these 4 variables and assign them to
        // the array element. Then add that data to the bus layer
        json.entity.filter(x=>x.vehicle.trip.routeId < 11).map(el=>{
            const lat = el.vehicle.position.latitude;
            const long = el.vehicle.position.longitude;
            const bearing = el.vehicle.position.bearing;
            const routeID = el.vehicle.trip.routeId;
            busLayer.addData(generateGeoFromLatLong(lat,long,bearing,routeID));

        });
    })
};

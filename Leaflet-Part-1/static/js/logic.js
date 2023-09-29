

// Creating a tile layers of map
let maplayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

// setting up url link

const link = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson';

// read geojson request 
d3.json(link).then(function (data) {
    console.log(data);  //check console data for debug

    createFeatures(data.features);  // fetch data had features property 
});

//creating function to deternmine marker size

function markerSize(magnitude) {
    return magnitude * 10000;
};

// creating function marker color by the depth 

function chooseColor(depth) {
    if (depth < 10) return "Blue";
    else if (depth < 30) return "Green";
    else if (depth < 50) return "Yellow";
    else if (depth < 70) return "Orange";
    else if (depth < 90) return "Red";
    else return "Pink";
}

// creating fucntion for earth quake 

function createFeatures(earthquakeData) {

    // popup features to show the place and time of earth quake
    function onEachfeature(feature, layer) {
        layer.bindPopup(`<h3>Location: ${feature.properties.place}</h3><hr><p>Date: ${new Date(feature.properties.time)}
        </p><p>Magnitude: ${feature.properties.mag}</p><p>Depth: ${feature.geometry.coordinates[2]}</p>`);
    //this var rub each futures for each data in the array
    }
    var earthquakes = L.geoJSON(earthquakeData, {
        onEachFeature: onEachfeature, // Corrected option name

        // create another layer used for marker
        pointToLayer: function (feature, latlng) { // Corrected option name
            // styling of markers
            var markers = {
                radius: markerSize(feature.properties.mag),
                fillColor: chooseColor(feature.geometry.coordinates[2]),
                fillOpacity: 0.6,
                color: "black",
                stroke: true,
                weight: 1
            }
            return L.circle(latlng, markers);
        }
    });

    // Send our earthquakes layer to the createMap function
    createMap(earthquakes);
}


function createMap(earthquakes) {

    // base layers.
    var street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    })
        // tobo base
    var topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
    });

    // baseMaps object.
    var baseMaps = {
        "Street Map": street,
        "Topographic Map": topo
    };

    // overlay object to hold our overlay.
    var overlayMaps = {
        Earthquakes: earthquakes
    };

    // Create our map, giving it the streetmap and earthquakes layers to display on load.
    var myMap = L.map("map", {
        center: [41, 35],
        zoom: 3,
        layers: [street, earthquakes]
    });

    // Create a layer control with basemaps and overlaymaps 
    
    // Add the layer control to the map.
    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(myMap);

    // Create a legend 
    var legend = L.control({ position: "bottomright" });

    legend.onAdd = function (myMap) {
        var div = L.DomUtil.create("div", "legend");
        div.innerHTML += "<h4 style='text-align: center'>Legend by Depth (km)</h4>";
        div.innerHTML += '<i style="background: #64B5F6"></i><span>10 km or less</span><br>';
        div.innerHTML += '<i style="background: #43A047"></i><span>30 km or less</span><br>';
        div.innerHTML += '<i style="background: #FFF176"></i><span>50 km or less</span><br>';
        div.innerHTML += '<i style="background: #FB8C00"></i><span>70 km or less</span><br>';
        div.innerHTML += '<i style="background: #FF3300"></i><span>90 km or less</span><br>';
        div.innerHTML += '<i style="background: #B71C1C"></i><span>More than 90 km</span><br>';
            return div;
    };

    legend.addTo(myMap);
}

// create the URL for the geoJson
var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson";

// creating a map object
var htown = L.map("map", {
    center: [29.749907, -95.358421],
    zoom: 7
});

// adding a base map naming it tileLayer (fix typo)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(htown);

// d3 retrieve data
d3.json(url).then(function(data){
    console.log(data);
    dataFeatures(data.features);
});

// creating marker size
function markerSize(magnitude) {
    return magnitude * 15432;
}

// marker color by depth
function markerColor(depth) {
    if (depth > -10 && depth < 10) return "blue";
    else if (depth >= 10 && depth < 30) return "green";
    else if (depth >= 30 && depth < 50) return "yellow";
    else if (depth >= 50 && depth < 70) return "orange";
    else if (depth >= 70 && depth < 90) return "red";
    else return "pink";
}

function dataFeatures(earthquakeData){
    function onEachFeature(feature, layer) {
        layer.bindPopup(`<h3>Location: ${feature.properties.place}</h3><hr><p>Date: ${new Date(feature.properties.time)}</p><p>Magnitude: ${feature.properties.mag}</p><p>Depth: ${feature.geometry.coordinates[2]}</p>`);
    }

    var earthquakeLayer = L.geoJSON(earthquakeData, {
        onEachFeature: onEachFeature,
        pointToLayer: function (feature, latlng) {
            var markers = {
                radius: markerSize(feature.properties.mag),
                fillColor: markerColor(feature.geometry.coordinates[2]),
                fillOpacity: 0.5,
                color: "black",
                stroke: true,
                weight: 1
            };
            return L.circle(latlng, markers);
        }
    });

    // Add the earthquake layer to the map
    earthquakeLayer.addTo(htown);

    // Create a legend and add it to the map
    var legend = L.control({ position: "bottomright" });
    legend.onAdd = function (map) {
        var div = L.DomUtil.create("div", "info legend");
        var depths = [-10, 10, 30, 50, 70, 90];
        var labels = [];

        for (var i = 0; i < depths.length; i++) {
            var from = depths[i];
            var to = depths[i + 1];
            labels.push(
                '<i style="background:' + markerColor(from + 1) + '"></i> ' +
                from + (to ? "&ndash;" + to : "+")
            );
        }
        div.innerHTML = labels.join("<br>");
        return div;
    };
    legend.addTo(htown);
}

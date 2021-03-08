// Store the past 7 days earthquake JSON and the tectonic plate boundry JSON as variables
var eqDataURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
var tectonicBoundryDataURL = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json";

// Get the earthquake data from the USGS JSON
d3.json(eqDataURL, function(data) {
    createFeatures(data.features);
});

// Create the function to generate the feature feature data
function createFeatures(eqData) {
    var earthquakes = L.geoJSON(eqData, {
        onEachFeature: function(feature, layer) {
            layer.bindPopup("<p><h3>Magnitude: " + feature.properties.mag +"</h3></p><p><h3>Location: "+ feature.properties.place +
              "</h3></p><p>" + new Date(feature.properties.time) + "</p>");
        },

        pointToLayer: function (feature, latlng) {
            return new L.circle(latlng,
              {radius: markerRadius(feature.properties.mag),
              fillColor: markerColor(feature.properties.mag),
              fillOpacity: .5,
              color: "black",
              stroke: true,
              weight: .8
              })
        }
    });

    createMap(earthquakes);
};

function createMap(eqs) {

    // Create the base maps
    var satellite = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
        tileSize: 512,
        maxZoom: 10,
        zoomOffset: -1,
        id: "mapbox/satellite-streets-v11",
        accessToken: API_KEY
    });  

    var outdoors = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
        tileSize: 512,
        maxZoom: 10,
        zoomOffset: -1,
        id: "mapbox/outdoors-v11",
        accessToken: API_KEY
    });

    var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
        tileSize: 512,
        maxZoom: 10,
        zoomOffset: -1,
        id: "mapbox/light-v10",
        accessToken: API_KEY
    });

      // Store the base map layers
    var baseMaps = {
        "Satellite": satellite,
        "Grayscale": lightmap,
        "Outdoors": outdoors
    };

    // Create layer for the tectonic plate boundries
    var tectonicBoundries = new L.LayerGroup();

    // Create overlay object to hold overlay layer
    var overlayMaps = {
        "Earthquakes": eqs,
        "Tectonic Plates": tectonicBoundries
    };

    // Create our map
    var myMap = L.map("map-id", {
        center: [37.09, -95.71],
        zoom: 5,
        layers: [lightmap, eqs, tectonicBoundries]
    });

    // Add tectonic plates data
    d3.json(tectonicBoundryDataURL, function(tectonicData) {
        L.geoJson(tectonicData, {
            color: "lemonchiffon",
            weight: 2
        })
        .addTo(tectonicBoundries);
    });

    //Add layer control to map
    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(myMap);

    // Create Legend
    var legend = L.control({
        position: "bottomright"
    });

    legend.onAdd = function(myMap) {
        var div = L.DomUtil.create("div", "info legend"),
        grades = [0, 1, 2, 3, 4, 5],
        labels = [];
    
        // Legend Grades
        for (var i = 0; i < grades.length; i++) {
            div.innerHTML +=
            '<i style="background:' + markerColor(grades[i] + 1) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
        }
        return div;
    };
    
    legend.addTo(myMap);
};

// Create color function
function markerColor(magnitude) {
    switch (true) {
      case magnitude > 5:
        return "red";
      case magnitude > 4:
        return "orangered";
      case magnitude > 3:
        return "orange";
      case magnitude > 2:
        return "yellow";
      case magnitude > 1:
        return "lime";
      default:
        return "green";
    }
  };

//Create function for calculating radius based on magnitude
function markerRadius(magnitude) {
    return Math.pow(magnitude, 2);
};
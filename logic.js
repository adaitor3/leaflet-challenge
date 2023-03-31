// Store our API endpoint inside queryUrl

  // Define a function we want to run once for each feature in the features array
  // Give each feature a popup describing the place and time of the earthquake
  function popUpMsg(feature, layer) {
    layer.bindPopup("<h3>" + feature.properties.place +
      "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
  }

  function circleSize(feature) {
    radius = feature.properties.mag;
    return radius*5 ;
  };
  
  function circleColor(feature) {
    depth = feature.geometry.coordinates[2]
   if (depth <10) {
    color = "#000000"
   }
   else if (depth <30) {
    color = "#ff0000"
   }
   else if (depth <50) {
    color = "#00ff00"
   }
   else if (depth <70){
    color = "#0000ff"
   }
   else if (depth < 90) {
    color = "#bf00ff"
   }
   else  {
    color = "#40ff00"
   }
   return color
  };

 // Create the base layers.
 var streetmap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1
});

var topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)',
maxZoom: 18
});

// Create a baseMaps object.
var baseMaps = {
"Street Map": streetmap,
"Topographic Map": topo
};

// Create a new map.
  // Edit the code to add the earthquake data to the layers.
  var myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
    layers: [streetmap]
  });

    // add streetmap
    streetmap.addTo(myMap);

 // create layer
 let earthquakes = L.layerGroup();

 // Create an overlays object.
 let overlayMaps = {
   Earthquakes: earthquakes
 }

 // createMap() takes the earthquake data and incorporates it into the visualization:
createMap();
function createMap(earthquake) {
 
// get endpoint
const url = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson'

// Build function for the data
    d3.json(url).then((data) => {
    L.geoJSON(data, {
      onEachFeature: popUpMsg,
      pointToLayer: function(feature,Latlong) {
      return new L.CircleMarker(Latlong, {
        radius: circleSize(feature),
        fillOpacity: 0.5
      });
    },
    style: function(feature){
      return {color: circleColor(feature)}
    }
  })
  .addTo(earthquakes);

   earthquakes.addTo(myMap);
    });

    var legend = L.control({position: 'bottomright'});
  legend.onAdd = function() {
      var div = L.DomUtil.create('div', 'legend');
      var legendColors = [-10, 10, 30, 50, 70, 90];
      // var labels = [];

      div.innerHTML += "<h4>Depth in Kilometers<h4>";

      for (var i = 0; i < legendColors.length; i++) {
        div.innerHTML +=
        '<i style="background:' + circleColor({geometry: {coordinates: [0, 0, legendColors[i]]}}) + '"></i>' +
        legendColors[i] + (legendColors[i +1] ? '&ndash;' + legendColors[i + 1] + ' km<br>' : '+ km');
      }
      div.innerHTML = '<div style="background-color: white; padding: 5px; border: 1px solid black; ">' + div.innerHTML + '</div>';
      return div;
    };
 legend.addTo(myMap);

  // Create a layer control that contains our baseMaps.
  // Be sure to add an overlay Layer that contains the earthquake GeoJSON.
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);
};

let map;
let mapStyle = [
  {
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#212121"
      }
    ]
  },
  {
    "elementType": "labels.icon",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#757575"
      }
    ]
  },
  {
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#212121"
      }
    ]
  },
  {
    "featureType": "administrative",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#757575"
      },
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "administrative.country",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#9e9e9e"
      }
    ]
  },
  {
    "featureType": "administrative.land_parcel",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "administrative.locality",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#bdbdbd"
      }
    ]
  },
  {
    "featureType": "poi",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#757575"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#181818"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#616161"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#1b1b1b"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "geometry.fill",
    "stylers": [
      {
        "color": "#2c2c2c"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "labels.icon",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#8a8a8a"
      }
    ]
  },
  {
    "featureType": "road.arterial",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#373737"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#3c3c3c"
      }
    ]
  },
  {
    "featureType": "road.highway.controlled_access",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#4e4e4e"
      }
    ]
  },
  {
    "featureType": "road.local",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#616161"
      }
    ]
  },
  {
    "featureType": "transit",
    "stylers": [
      {
        "visibility": "on"
      }
    ]
  },
  {
    "featureType": "transit",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#757575"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#000000"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#3d3d3d"
      }
    ]
  }
];

function initMap() {
  map = new google.maps.Map(d3.select("#map").node(), {
    center: { lat: 44.6487027, lng: -63.6008893 },
    zoom: 14,
    mapTypeControl: false,
    streetViewControl: false,
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    styles: mapStyle
  });
};



function drawBuses() {
  d3.json("http://localhost:3000/get", function (error, data) {
    if (error) throw error;
    console.log("initial data loaded...");

    let overlay = new google.maps.OverlayView();

    // Add the container when the overlay is added to the map.
    overlay.onAdd = function () {
      let layer = d3.select(this.getPanes().overlayLayer)
        .append("div")
        .attr("class", "stations");

      // Draw each marker as a separate SVG element.
      overlay.draw = function () {
        let projection = this.getProjection();
        let padding = 10;

        function transform(d) {
          // console.log(d);
          d = new google.maps.LatLng(d.value.vehicle.position.latitude, d.value.vehicle.position.longitude);
          d = projection.fromLatLngToDivPixel(d);
          return d3.select(this)
            .style("left", (d.x - padding) + "px")
            .style("top", (d.y - padding) + "px");
        }

        function transformWithEase(d) {
          //console.log(d);
          d = new google.maps.LatLng(d.value.vehicle.position.latitude, d.value.vehicle.position.longitude);
          d = projection.fromLatLngToDivPixel(d);
          return d3.select(this)
            .transition().duration(800)
            .style("left", (d.x - padding) + "px")
            .style("top", (d.y - padding) + "px");
        }


        let marker = layer.selectAll("svg")
          .data(d3.entries(data))
          .each(transform) // update existing markers
          .enter().append("svg")
          .each(transform)
          .attr("class", "marker");

        // Add a circle.
        marker.append("circle")
          .attr("r", 4.5)
          .attr("cx", padding)
          .attr("cy", padding)
        //.attr("id", function (data) { return data.value.id });

        //console.log(data.value.id)

        //Add a label.
        // marker.append("text")
        //   .attr("x", padding + 7)
        //   .attr("y", padding)
        //   .attr("dy", ".31em")
        //   .attr("fill", "white")
        //   .text(function (data) { return data.value.id; });


        // overlay.onRemove = function () {
        //   layer.remove()
        // };

        this.update = function (data) {
          layer.selectAll("svg")
            .data(d3.entries(data))
            //.enter().append("svg")
            //.attr("fill", "tomato");
            //.enter()
            .each(transform);

          //layer.exit().remove();


          //.enter().append("svg")
          //.each(transform)

          console.log("new data update..")
        }

        function updateBuses() {
          d3.json("http://localhost:3000/get", function (error, data) {
            if (error) throw error;
            //console.log(data);
            console.log("number of bus nodes.. " + data.length)
            overlay.update(data)
          })
        }

        setInterval(updateBuses, 6000)

      };
    };

    // Bind overlay to map
    overlay.setMap(map);
  });

}

drawBuses();



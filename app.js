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
    console.log("initial data loaded... " + data.length);

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
          console.log("rendered new static nodes");
          d = new google.maps.LatLng(d.value.vehicle.position.latitude, d.value.vehicle.position.longitude);
          d = projection.fromLatLngToDivPixel(d);
          return d3.select(this)
            .style("left", (d.x - padding) + "px")
            .style("top", (d.y - padding) + "px")
            .text(function (d) { return d.value.id })
        }

        function initialRender(d) {
          console.log("initial render of nodes...");
          d = new google.maps.LatLng(d.value.vehicle.position.latitude, d.value.vehicle.position.longitude);
          d = projection.fromLatLngToDivPixel(d);
          return d3.select(this)
            .style("left", (d.x - padding) + "px")
            .style("top", (d.y - padding) + "px")
            // .text(function (d) { return d.key })
            .text(function (d) { return d.value.id })
        }

        // for ( let i = 0 ; i < data.length; i++) {
        //   console.log(data[i])
        // }

        function transformWithEase(d) {
          //console.log("animated existing nodes");
          //console.log("animating " + d.key)
          //console.log("animating node no. " + d.key + " --> " + d.value.vehicle.position.latitude, d.value.vehicle.position.longitude)

          //console.log(d)

          // for (let i = 0; i < data.length; i++) if (d.value.id == layer.selectAll("svg").)


          d = new google.maps.LatLng(d.value.vehicle.position.latitude, d.value.vehicle.position.longitude);
          d = projection.fromLatLngToDivPixel(d);


          return d3.select(this)
            .transition().duration(500)
            .style("left", (d.x - padding) + "px")
            .style("top", (d.y - padding) + "px")



        }




        let marker = layer.selectAll("svg")
          .data(d3.entries(data), function (d) { return d.id; })
          //.each(transform) // update existing markers
          .enter().append("svg")
          .each(initialRender)
          .attr("class", "marker")
        //.text(function(d){return d});

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


        function updateBuses() {
          d3.json("http://localhost:3000/get", function (error, data) {
            if (error) throw error;
            console.log("-------------------------------------");
            console.log("polling for new data.. " + data.length)
            //console.log(data)
            overlay.update(data)
          })
        }

        this.update = function (data) {
          let newLayer = d3.select(".stations").selectAll("svg");

          // for (i = 0; i < newLayer._parents[0].children.length; i++) {
          //   console.log(newLayer._parents[0].children[i].textContent);
          //   console.log(data[i].id)
          // }

          for (i = 0; i < data.length; i++) {
            for (j = 0; j < newLayer._parents[0].children.length; j++) {
              if (data[i].id == newLayer._parents[0].children[j].textContent) {
                //console.log("found a match" + i)
                // console.log(data[i].vehicle.position)
                d = data[i];
                k = newLayer._parents[0].children[j];
                d = new google.maps.LatLng(d.vehicle.position.latitude, d.vehicle.position.longitude);
                d = projection.fromLatLngToDivPixel(d);


                d3.select(k)
                  .transition().duration(500)
                  .style("left", (d.x - padding) + "px")
                  .style("top", (d.y - padding) + "px")

              } //else {
              //let newBusNodesArray = [];
              //newBusNodesArray.push(data[i]);
              //}
              //console.log(newBusNodesArray)
            }
            //console.log(newLayer._parents[0].children[i].textContent);
            //console.log(data[i].id)
          }
          // newLayer //this animates the existing nodes
          //   .data(d3.entries(data))
          //   .each(transformWithEase) //ease transform existing nodes




          newLayer.data(d3.entries(data)) //this adds new nodes to the dom
            .enter() //stores new nodes
            .append("svg") //render nodes before transform
            .each(transform) //static transform
            .attr("class", "marker").append("circle")
            .attr("r", 4.5)
            .attr("cx", padding)
            .attr("cy", padding)
            .style("fill", "tomato");



          newLayer.data(d3.entries(data)) //this removes dead nodes from the dom
            .exit().remove()
          //.style("fill", "royalblue");



          console.log("applying new bus nodes..")
        }

        setInterval(updateBuses, 6000)

      };
    };

    // Bind overlay to map
    overlay.setMap(map);
  });

}

drawBuses();



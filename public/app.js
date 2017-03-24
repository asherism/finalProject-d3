"use strict";

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





function initMap()  {
  map = new google.maps.Map(d3.select("#map").node(), {
    center: { lat: 44.6524458, lng: -63.6029722 },
    zoom: 13,
    mapTypeControl: false,
    streetViewControl: false,
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    styles: mapStyle

  });


  map.data.loadGeoJson('./paths/paths.geojson');  //GeoJSON via googlemaps
  map.data.setStyle({
    strokeColor: 'mediumblue',
    strokeWeight: 3.5,
    strokeOpacity: 0.1,
  });

  map.data.addListener('mouseover', function (event) {
    map.data.revertStyle();
    map.data.setStyle({ strokeOpacity: 0.1, strokeWeight: 0 });
    map.data.overrideStyle(event.feature, { strokeColor: 'blue', strokeOpacity: 1, strokeWeight: 6, zIndex: 1000 });
    // map.data.overrideStyle(event.feature, {})
    //map.data.overrideStyle(event.feature, { strokeWeight: 8 });
  });

  map.data.addListener('mouseout', function (event) {
    map.data.revertStyle();
    map.data.setStyle({
      //strokeColor: '#2d3d6d',
      strokeColor: 'mediumblue',
      strokeWeight: 3.5,
      strokeOpacity: 0.1
    })
  })


  let transitLayer = new google.maps.TransitLayer();
  transitLayer.setMap(map);
};






function drawBuses() {
  d3.json("http://thisismyfinalproject.website:9000/get", function (error, data) {
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
          d = new google.maps.LatLng(d.vehicle.position.latitude, d.vehicle.position.longitude);
          d = projection.fromLatLngToDivPixel(d);
          return d3.select(this)
            .style("left", (d.x - padding) + "px")
            .style("top", (d.y - padding) + "px")
            .text(function (d) { return d.id })
        }

        function initialRender(d) {
          console.log("initial render of nodes...");
          d = new google.maps.LatLng(d.vehicle.position.latitude, d.vehicle.position.longitude);
          d = projection.fromLatLngToDivPixel(d);
          return d3.select(this)
            .style("left", (d.x - padding) + "px")
            .style("top", (d.y - padding) + "px")
            // .text(function (d) { return d.key })
            .text(function (d) { return d.id })
        }

        function transformWithEase(d) {
          d = new google.maps.LatLng(d.vehicle.position.latitude, d.vehicle.position.longitude);
          d = projection.fromLatLngToDivPixel(d);

          return d3.select(this)
            .transition().duration(1000)
            .style("left", (d.x - padding) + "px")
            .style("top", (d.y - padding) + "px")
        };

        let marker = layer.selectAll("svg")
          //.data(data, function (d) { console.log(d) }) //this was working for some reason????
          .data(data, function (d) { return d.id; })
          .enter().append("svg")
          .each(initialRender) //initial rendering of bus nodes
          .attr("class", "marker")

        // Add a circle.
        marker.append("circle")
          //.attr("opacity", 0)
          .attr("r", 4)
          .attr("cx", padding)
          .attr("cy", padding)
          .attr("opacity", 1);

        // marker.transition()
        //   .duration(1250)
        //   .attr("opacity", 1);

        //Add a label.
        // marker.append("text")
        //   .attr("x", padding + 7)
        //   .attr("y", padding)
        //   .attr("dy", ".31em")
        //   .attr("fill", "white")
        //   .text(function (data) { return data.value.id; });



        //Load in GeoJSON data vid d3 - WIP

        // let svg = d3.select("body").append("svg")

        // d3.json("./paths/paths.geojson", function (data) {

        //   console.log(data);

        //   var projection = d3.geoAlbersUsa()
        //     .scale(1)
        //     .translate([0, 0]);


        //   svg.append("path")
        //     .datum({ type: "FeatureCollection", features: data.features })
        //     .attr("d", d3.geoPath(data).projection(projection))
        //     .enter()
        //     .append("path")
        //     .style("stroke-width", "1")
        //     .style("stroke", "blue")
        // svg.selectAll("path")
        //   .data(json.features)
        //   .enter()
        //   .append("path")
        //   .attr("d", path)
        //   .attr("fill", "#666666");
        //})


        function updateBuses() {
          d3.json("http://thisismyfinalproject.website:9000/get", function (error, data) {
            if (error) throw error;
            console.log("-------------------------------------");
            console.log("polling for new data.. " + data.length)
            //console.log(data)
            overlay.update(data)

            function info(data) {
              let d = data.length;
              document.getElementById("numOfNodes").innerHTML = d;
              //document.getElementById("numOfNodes").innerHTML = d.toLocaleTimeString();
            }
          })
        }


        this.update = function (data) {
          let newLayer = d3.select(".stations").selectAll("svg");

          // for (i = 0; i < newLayer._parents[0].children.length; i++) {
          //   console.log(newLayer._parents[0].children[i].textContent);
          //   console.log(data[i].id)
          // }

          // for (i = 0; i < data.length; i++) {
          //   for (j = 0; j < newLayer._parents[0].children.length; j++) {
          //     if (data[i].id == newLayer._parents[0].children[j].textContent) {
          //       //console.log("found a match" + i)
          //       // console.log(data[i].vehicle.position)
          //       d = data[i];
          //       k = newLayer._parents[0].children[j];
          //       d = new google.maps.LatLng(d.vehicle.position.latitude, d.vehicle.position.longitude);
          //       d = projection.fromLatLngToDivPixel(d);

          //       d3.select(k)
          //         .transition().duration(500)
          //         .style("left", (d.x - padding) + "px")
          //         .style("top", (d.y - padding) + "px")

          //     } //else {
          //     //let newBusNodesArray = [];
          //     //newBusNodesArray.push(data[i]);
          //     //}
          //     //console.log(newBusNodesArray)
          //   }
          //   //console.log(newLayer._parents[0].children[i].textContent);
          //   //console.log(data[i].id)

          // } ***this chunk of code is now unnecessary with the data key working*** ¯\_(ツ)_/¯ 

          newLayer //this animates the existing nodes
            .data(data, function (d) { return d.id }) // pass in data key
            .each(transformWithEase); //ease transform existing nodes

          newLayer //this adds new nodes to the dom
            .data(data, function (d) { return d.id }) //pass in data key
            .enter() //stores new nodes
            .append("svg") //render nodes before transform
            .each(transform) //static transform
            .attr("class", "marker").append("circle")
            .attr("r", 4)
            .attr("cx", padding)
            .attr("cy", padding)
            .style("fill", "tomato") //add new color for new nodes
            .attr("opacity", 1)

          newLayer.data(data, function (d) { return d.id }) //this removes dead nodes from the dom
            .exit().remove();

          console.log("applying new bus nodes..")
        }

        setInterval(updateBuses, 6000) //set up polling for new data
      };
    };

    // Bind overlay to map
    overlay.setMap(map);
  });

}

drawBuses();



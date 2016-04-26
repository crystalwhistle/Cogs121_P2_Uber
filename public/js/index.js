var map;
var allData;

  d3.json("/getRankedData?uber=UberX", function(err, dat) {
    allData = dat.SortedData;
    // console.log(allData);
    // console.log(dat.SortedData[0].data['scaled data']);
    // console.log(dat);
  });

    //var data = [4, 8, 15, 16, 23, 42];
    // Function to create the bar graph
    function buildGraph(data) {
      // console.log(data);
       var obj = allData[i].data['scaled data']; // gets all the scaled data json
       var arr = Object.keys(obj).map(function(k) { return obj[k] }); // converts the values to an array
       var key = Object.keys(obj); // gets the key of json
      console.log(obj);
      console.log('ARRRRRR ' + arr);
      console.log('KEYYYYY ' + key);

      var scale = {
        //x: d3.scale.ordinal(),
        y: d3.scale.linear()
      };
      var margin = {top: 20, right: 20, bottom: 70, left: 40},
          width = 600 - margin.left - margin.right,
          height = 300 - margin.top - margin.bottom;
      // var totalWidth = 500;
      // var totalHeight = 200;

      function mergeArray(keyArray,valueArray) {
          var result = [];
          var tmp = [];
          for (var i = 0; i < keyArray.length; i++) {
              tmp = [keyArray[i], valueArray[i]];
              result.push(tmp);
          }
          return result;
      }

      var dataset = mergeArray(key,arr);



      // scale.x.domain([0,6]);
      // scale.x.range([0, totalWidth]);

      scale.y.domain([0, 10]);
      scale.y.range([height, 0]);

      var barWidth = 20;

      var chart = d3.select('.chart')
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
        // .attr({
        //   'width': width,
        //   'height': height
        // });



    var x = d3.scale.ordinal().domain(key).rangeRoundBands([0, width], 0.05);


    var y = d3.scale.linear().range([height, 0]);
        // var xScale = d3.scale.linear()
        //                 .domain([0, d3.max(dataset, function(d) {
        //                   // console.log(d[0]);
        //                   return d[0];})])
        //                 .range([0,totalWidth]);
        // var yScale = d3.scale.linear()
        //                 .domain([0, d3.max(dataset, function(d) {return d[1]; })])
        //                 .range([0, totalHeight]);

        var xAxis = d3.svg.axis()
                      .scale(x)
                      .orient("bottom");


      var yAxis = d3.svg.axis()
                .scale(y)
                .orient("left")
                .ticks(10);

      x.domain(data.map(function(d) { return d.date; }));
      y.domain([0, d3.max(data, function(d) { return d.value; })]);

        var padding = 1;

        chart.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", "-.55em")
        .attr("transform", "rotate(-90)" );

        chart.append("text")
          .attr("class", "x label")
          .attr("text-anchor", "end")
          .attr("x", width)
          .attr("y", height - 6)
          .text(key[0]);
        chart.append("text")
        .attr("class", "x label")
        .attr("text-anchor", "end")
        .attr("x", width)
        .attr("y", height - 19)
        .text(key[1]);

        chart.append("g")
            .attr("class", "axis")
            .attr("transform", "translate(" + padding + ",0)")
            .call(yAxis);


      // var xAxis = d3.svg.axis().scale(scale.x)
      //   .orient("bottom")
      //   .tickValues(key);

      var bars = chart
        .selectAll('g')
        .data(arr)
        .enter()
        .append('g');




        var text = chart.selectAll("text")
                        .data()

      bars.append('rect')
        .attr({
          'x': function(d, i) {
            return i * barWidth;
          },
          'y': scale.y,
          'height': function(d) {
            return height - scale.y(d);
          },
          'width': barWidth - 1
        });


        // chart.selectAll("text")
        //    .data(obj, 12)
        //    .enter()
        //    .append("text")
        //    .text(function(d) {
        // 		return d.value;
        //    })
        //    .attr("text-anchor", "middle")
        //    .attr("x", function(d, i) {
        // 		return xScale(i) + xScale.rangeBand() / 2;
        //    })
        //    .attr("y", function(d) {
        // 		return h - yScale(d.value) + 14;
        //    })
        //    .attr("font-family", "sans-serif")
        //    .attr("font-size", "11px")
        //    .attr("fill", "white");

console.log(bars);
        return bars;

    }


window.initMap = function(){

    var minZoomLevel = 9;

    map = new google.maps.Map(document.getElementById('map'), {
        zoom: minZoomLevel,
        center: new google.maps.LatLng(32.8787, -117.0400),
        mapTypeId: google.maps.MapTypeId.ROADMAP,
    });


    // Bounds for North America
    var strictBounds = new google.maps.LatLngBounds(
        new google.maps.LatLng(32.7297, -117.0451),
        new google.maps.LatLng(33.2157, -117.0300));

    // Listen for the dragend event
    google.maps.event.addListener(map, 'center_changed', function() {
        if (strictBounds.contains(map.getCenter())) {
            // still within valid bounds, so save the last valid position
            lastValidCenter = map.getCenter();
            return;
        }

        // not valid anymore => return to last valid position
        map.panTo(lastValidCenter);
    });

    // Limit the zoom level
    google.maps.event.addListener(map, 'zoom_changed', function() {
        if (map.getZoom() < minZoomLevel) map.setZoom(minZoomLevel);
    });

    var cityName;
    map.data.loadGeoJson('./map/sdcounty.json');
    map.data.addListener('mouseover', function(event) {
      document.getElementById('info-box').textContent =
      event.feature.getProperty('NAME');
    });


    // Creates the infoWindow object
    var infoWindow = new google.maps.InfoWindow({

    });

    map.data.addListener('click', function(event) {
      cityName = event.feature.getProperty('NAME');
      for (i = 0; i < allData.length; i++) {
          if(cityName.toUpperCase() == allData[i].Area.toUpperCase()) {
            // Render Data for bar graphs
            console.log(allData[i].data['scaled data']);
            var bars = buildGraph(allData, infoWindow);

          }
      }
      var html = "<p>" + cityName + "</p>";
      var d3 = $('#d3').html();
      console.log(d3);
      infoWindow.setContent(d3);
      //buildGraph(html, infoWindow);
    })

    // Opens infoWindow on click
    map.data.addListener("click", function(event) {
      var latlng = event.latLng;
      //console.log(latlng);
      infoWindow.setPosition(latlng);
      infoWindow.open(map);

    });

    // Closes window when mouseOut
    map.data.addListener("mouseout", function() {
      infoWindow.close();
    });



}

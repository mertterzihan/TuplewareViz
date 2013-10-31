//<script src="http://d3js.org/d3.v3.js"></script>

window.addEventListener('load', function(){
	
	$("#LR").on('click', function() {execLinearRegression()} );
	

}, false);


function execLinearRegression() {
	var code = $('textarea#code').val();
	$.post( "/data", {code : code}, function( data ) {
	});
	var req = new XMLHttpRequest();
	req.open('GET', '/LinearRegression', true);
	req.addEventListener('load', function(){
		
		if(req.status == 200)
		{
			var content = req.responseText;
			// reverse stingify function 
			renderLinearRegression(JSON.parse(content));
		}
		
	}, false); 
	
	req.send(null);
	
}

function renderLinearRegression(result) {

	var margin = {top: 20, right: 20, bottom: 30, left: 50},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

	var parseDate = d3.time.format("%d-%b-%y").parse;
	
	var x = d3.time.scale()
	    .range([0, width]);
	
	var y = d3.scale.linear()
	    .range([height, 0]);
	
	var xAxis = d3.svg.axis()
	    .scale(x)
	    .orient("bottom");
	
	var yAxis = d3.svg.axis()
	    .scale(y)
	    .orient("left");
	
	var line = d3.svg.line()
	    .x(function(d) { return x(d.date); })
	    .y(function(d) { return y(d.close); });
	
	var svg = d3.select("body").append("svg")
	    .attr("width", width + margin.left + margin.right)
	    .attr("height", height + margin.top + margin.bottom)
	  .append("g")
	    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
	
	var data = [];
	d3.tsv.parse(result, function(d) {
		d.date = parseDate(d.date);
		d.close = +d.close;
		data.push(d);
	});
		
	//console.log(data);
	x.domain(d3.extent(data, function(d) { return d.date; }));
	y.domain(d3.extent(data, function(d) { return d.close; }));
	
	svg.append("g")
	  .attr("class", "x axis")
	  .attr("transform", "translate(0," + height + ")")
	  .call(xAxis);
	
	svg.append("g")
	  .attr("class", "y axis")
	  .call(yAxis)
	.append("text")
	  .attr("transform", "rotate(-90)")
	  .attr("y", 6)
	  .attr("dy", ".71em")
	  .style("text-anchor", "end")
	  .text("Price ($)");
	
	svg.append("path")
	  .datum(data)
	  .attr("class", "line")
	  .attr("d", line);
			
}
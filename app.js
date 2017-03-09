var year = '2014';//default year
var xVariable = 'HE';//default x variable of scatterplot (i.e. choose sub measurement from education or employment)
var yVariable = 'AHI';//default y variable of scatterplot (i.e. average househoul income)
var datasetBar;//dataset for bar charts. i.e.income distribution
var datasetScatter;//dataset for scatter plot. i.e. avg household income and education/employment rate
var bars;//svg of bar chart
var circles;//svg for scatter plot

//tooltip for scatter plot
var tooltip = d3.select("body").append("div")
.attr("class", "tooltip")
.attr("id","tooltipscatter")
.style("opacity", 0);


//tooltip for bard
var tooltipbars = d3.select("body").append("div")
.attr("class", "tooltip")
.style("opacity", 0);


//setup the components of bar charts
var svg1 = d3.select("#bars");
var margin = {top: 20, right: 20, bottom: 30, left: 40};
var width = 500 - margin.left - margin.right;
var height = 400 - margin.top - margin.bottom;
var g = svg1.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var x0 = d3.scaleBand()//For each bar group, constructs a new band scale with the empty domain, map to each row (i.e. each type of couple)
.rangeRound([0, width])
    .paddingInner(0.1);//set padding between bar groups

var x1 = d3.scaleBand()//For each individual bar in a group, constructs a new band scale with the empty domain, map to each columns of one row (i.e. different income ranks of one type of couples)
    .padding(0.05);//set padding between individual bars

    var y = d3.scaleLinear()
    .rangeRound([height, 0]);

var z = d3.scaleOrdinal()//colors for different columns i.e. for different ranks
.range(["#C6E9BF","#A2D89A", "#73C475", "#30A355", "#006F2F"]);


function drawBars(data,year){

	var ndata = data.filter(function(d) {
		return d["year"] == year;
	});

	x0.domain(ndata.map(function(d) { return d.type; }));//set the domain of those types of couples
	x1.domain(keys).rangeRound([0, x0.bandwidth()]);//set the sub-domain (i.e. the income ranks) of each group of couples
	y.domain([0, 70]);

	bars = 
	g.append("g");

	//delete data
	bars
	.selectAll("g")
	.data(ndata)
	.exit().remove();

	//add data
	bars
	.selectAll("g")
	.data(ndata)
	    .enter().append("g")//draw a group
	    .attr("transform", function(d) { return "translate(" + x0(d.type) + ",0)"; })
	    .selectAll("rect")
	    .data(function(d) {
	    	return keys.map(function(key) { return {key: key, per: d[key]}; }); 
	    })
	    .enter().append("rect")//draw individual bars
	    .attr("class","bar")
	    .attr("x", function(d) { return x1(d.key); })
	    .attr("width", x1.bandwidth())
	    .attr("y", function(d) { return y(d.per); })
	    .attr("height", function(d) { return height - y(d.per); })
	    .attr("fill", function(d) { return z(d.key); })
	    .on("mouseover",function(d){
	    	tooltipbars.transition()
	    	.duration(200)
	    	.style("opacity",.9);
	    	tooltipbars.html("<b>Rank:</b><p>"+d.key+"</p><b>Percentage:</b><p>"+String(d.per).slice(0,4)+"%</p>")
	    	.style("left",(d3.event.pageX+20)+"px")
	    	.style("top",(d3.event.pageY -30)+"px");
	    })
	    .on("mouseout",function(d){
	    	tooltipbars.transition()
	    	.duration(500)
	    	.style("opacity",0);
	    });
	}

	function barLegendAxis(data){
		var legend = g.append("g")
		.attr("font-family", "sans-serif")
		.attr("font-size", 10)
		.attr("text-anchor", "end")
		.selectAll("g")
		.data(keys.slice().reverse())
		.enter().append("g")
		.attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

		legend.append("rect")
		.attr("x", width - 19)
		.attr("width", 19)
		.attr("height", 19)
		.attr("fill", z);

		legend.append("text")
		.attr("x", width - 24)
		.attr("y", 9.5)
		.attr("dy", "0.32em")
		.text(function(d) { return d; });

		g.append("g")
		.attr("class", "axis")
		.attr("transform", "translate(0," + height + ")")
		.call(d3.axisBottom(x0));

		g.append("g")
		.attr("class", "axis")
		.call(d3.axisLeft(y).ticks(null, "s"))
		.append("text")
		.attr("x", 2)
		.attr("y", y(y.ticks().pop()) + 0.5)
		.attr("dy", "0.32em")
		.attr("fill", "#000")
		.attr("font-weight", "bold")
		.attr("text-anchor", "start")
		.text("Percentage")
		.attr("y", -10);

		var parsign = g.append("text")
		.attr("font-family", "sans-serif")
		.attr("font-size", 40)
		.attr("x", 10)
		.attr("y", 20)
		.attr("font-weight",600)
		.attr("opacity",0.1)
		.attr("dy", "0.32em")
		.text("%")
	}

	d3.csv("income14.csv", function(d, i, columns) {
  for (var i = 1, n = columns.length; i < n; ++i) d[columns[i]] = +d[columns[i]];//for each row
  return d;//get the value of each column
}, function(error, data) {
	if (error) throw error;
	datasetBar = data;
	keys = datasetBar.columns.slice(1).slice(0,5);//get the name of each column as a key
	//draw grouped bars
	drawBars(datasetBar,year);
	barLegendAxis(datasetBar);
});

	var svg2 = d3.select("#scatter"),
	g2 = svg2.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var col = d3.scaleOrdinal()//colors for different columns i.e. for different ranks
.range(["#ffd56b","#63c8ff", "#ffaff5"]);

var xS = d3.scaleLinear()
.domain([0, 100])
.range([0, width]);

var yS = d3.scaleLinear()
.domain([60000, 140000])
.range([height, 0]);

var xAxisS = d3.axisBottom()
.ticks(10)
.tickSizeInner(-height)
.scale(xS);

var xlabel = svg2.append("g")
.attr("class", "axis")
.attr("transform", "translate(0," + height + ")")
.call(xAxisS)
.append("text")
.attr("x", width)
.attr("y", -10)
.attr("fill", "#000")
.attr("text-anchor", "end")
.attr("font-weight", "bold")
.text("Householder Employed");

var yAxisS = d3.axisLeft()
.tickSizeInner(-width)
.scale(yS);

svg2.append("g")
.attr("class", "axis")
.call(yAxisS)
.append("text")
.attr("x", 2)
.attr("y", y(y.ticks().pop()) + 0.5)
.attr("dy", "0.32em")
.attr("fill", "#000")
.attr("text-anchor", "start")
.text("Average Household Income")
.attr("y", -10);


var xVar;
var xVarLabel;
function drawVis(data, xVariable, yVariable, year) { //draw the circles initially and on each interaction with a control
	var ndata = data.filter(function(d) {
		return d["year"] == year;
	});

	var xVariableLabel;
	switch(xVariable) {
		case 'HE':
		xVariableLabel = 'Householder Employed';
		break;
		case 'BE':
		xVariableLabel = 'Both Partners Employed';
		break;
		case 'HB':
		xVariableLabel = "Householder has at least a Bachelor's Degree";
		break;
		case 'BB':
		xVariableLabel = "Both Partners with at least a Bachelor's Degree";
		break;
		default:
		xVariableLabel = 'Householder Employed';
	}

	xlabel
	.text(xVariableLabel);

	circles = svg2.selectAll("circle");

	xVar = xVariable.toString();
	xVarLabel = xVariableLabel.toString();

	circles
	.data(ndata)
	.attr("cx", function(d, i) { return xS(d[xVariable]);  })
	.attr("cy", function(d, i) { return yS(d[yVariable]);  })
	.style("fill", function(d) { return col(d.type); });

	circles.data(ndata).exit().remove();

	circles.data(ndata).enter().append("circle")
	.attr("cx", function(d, i) { return xS(d[xVariable]);  })
	.attr("cy", function(d, i) { return yS(d[yVariable]);  })
	.attr("r", 5)
	.style("fill", function(d) { return col(d.type); })
	.style("opacity", 0.8)
	.on("mouseover",function(d){
		tooltip.transition()
		.duration(200)
		.style("opacity",.9);
		tooltip.html("<b>"+xVarLabel+":</b><p>"+d[xVar]+"%</p><b>Household Income:</b><p>$"+d[yVariable]+"</p>")
		.style("left",(d3.event.pageX+20)+"px")
		.style("top",(d3.event.pageY -30)+"px");
	})
	.on("mouseout",function(d){
		tooltip.transition()
		.duration(500)
		.style("opacity",0);
	});
}

function scatterLegend(data){
	var ndata = data.filter(function(d) {
		return d["year"] == "2014";//only draw legend once
	});

	var legend = svg2.append("g")
	.attr("font-family", "sans-serif")
	.attr("font-size", 10)
	.attr("text-anchor", "end")
	.selectAll("g")
	.data(ndata)
	.enter().append("g")
	.attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

	legend.append("rect")
	.attr("x", width - 19)
	.attr("width", 19)
	.attr("height", 19)
	.attr("fill", function(d,i){return col(d.type);})
	.attr("opacity",0.8);

	legend.append("text")
	.attr("x", width - 24)
	.attr("y", 9.5)
	.attr("dy", "0.32em")
	.text(function(d) { return d.type; });

	var dollarsign = svg2.append("text")
		.attr("font-family", "sans-serif")
		.attr("font-size", 40)
		.attr("x", 10)
		.attr("y", 20)
		.attr("font-weight",600)
		.attr("opacity",0.1)
		.attr("dy", "0.32em")
		.text("$")


	var persign = svg2.append("text")
		.attr("font-family", "sans-serif")
		.attr("font-size", 40)
		.attr("x", width-35)
		.attr("y", height-30)
		.attr("font-weight",600)
		.attr("opacity",0.1)
		.attr("dy", "0.32em")
		.text("%")
}





d3.csv("ee14.csv", function(error, eedata) {
//read in the data
if (error) return console.warn(error);
datasetScatter = eedata;

//all the data is now loaded, so draw the initial vis
drawVis(datasetScatter, xVariable, yVariable, year);
scatterLegend(datasetScatter);

});


function filterType(mtype) {
	xVariable = mtype;
	// circles.remove(); if circels DOM are removed, the CSS transition animation is inactive
	drawVis(datasetScatter, xVariable, yVariable, year); 
}

function filterYear(myear) {
	year = myear;
	// circles.remove(); if circels DOM are removed, the CSS transition animation is inactive
	drawVis(datasetScatter, xVariable, yVariable, year);
	bars.remove();//clear old chart
	drawBars(datasetBar, year)
}

document.getElementById("selecttype").onchange =
function() {
	filterType(document.querySelector('input[name="type"]:checked').value);
}

document.getElementById("selectyear").onchange =
function() {
	filterYear(document.querySelector('input[name="year"]:checked').value);
}
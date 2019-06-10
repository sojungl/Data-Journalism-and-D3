// Set up our chart
var svgWidth = 800;
var svgHeight = 600;

var margin = { 
    top: 60, 
    bottom: 120,
    right: 60,
    left: 60 
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;


// Create an SVG wrapper, append an svg that will hold our chart and shift the latter by left and top margins
var svg = d3.select(".chart")
    .append("svg")
    .attr("height", svgHeight)
    .attr("width", svgWidth)
 

// Append an svg group
var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

//Read CSV data
d3.csv("../../data.csv").then(function(data) {

    // Parsing data as numbers
    data.forEach(function(cendata) {
        cendata.poverty = +cendata.poverty;
        cendata.healthcare = +cendata.healthcare;
    });

    // Create scales
    var xLinearScale = d3.scaleLinear()
        .domain([d3.min(data, d => d.poverty), d3.max(data, d => d.poverty)])
        .range([0, width]);
        
    var yLinearScale = d3.scaleLinear()
        .domain([d3.min(data, d => d.healthcare), d3.max(data, d => d.healthcare)])
        .range([height, 0]);
    
    // Creating axes 
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // Append x,y axes
    chartGroup.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);
    
    chartGroup.append("g")
        .call(leftAxis);


    //Create Circles
    var circlesGroup = chartGroup.selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d.poverty))
    .attr("cy", d => yLinearScale(d.healthcare))
    .attr("r", "12")
    .attr("fill", "blue")
    .attr("opacity", ".5");

    
    // Adding state abbreviation to circles
    chartGroup.selectAll('data.abbr')
        .data(data)
        .enter()
        .append('text')
        .text(d => d.abbr)
        .attr('class', 'stateText')
        .attr('x', d => xLinearScale(d.poverty))
        .attr('y', d => yLinearScale(d.healthcare - 0.25));
    

    //Initialize tooltip
     var toolTip = d3.tip()
         .attr("class", "tooltip")
         // Define position
         .offset([80, -60])
         // The html() method allows us to mix JavaScript with HTML in the callback function
         .html(function (d) {
             
             return (`<b><i>${d.state}</i></b><br>Poverty: ${d.poverty} %<br>Healthcare: ${d.healthcare} years`);
            });

    //Create tooltip in chartGroup
    chartGroup.call(toolTip); 

    //Creating mouseover & mouseout events to display and hide the tooltip
    // ==============================
    circlesGroup.on("mouseover", function (cendata) {
        toolTip.show(cendata, this);    
    })
        // mouseout event
        .on("mouseout", function (cendata, index) {
            toolTip.hide(cendata);   
        });
    
    //Create axes labels
    chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .attr("class", "axisText")
        .text("Lack of Healthcare %");

    chartGroup.append("text")
        .attr("transform", `translate(${width / 2}, ${height + margin.top})`)
        .attr("class", "axisText")
        .text("Poverty %");
  });

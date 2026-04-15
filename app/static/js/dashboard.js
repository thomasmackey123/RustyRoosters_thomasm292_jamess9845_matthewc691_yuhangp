document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("container");

    const width = 1000;
    const height = 600;
    const marginTop = 20;
    const marginRight = 20;
    const marginBottom = 50;
    const marginLeft = 80;
    // Create the SVG container.
    const svg = d3.create("svg")
        .attr("width", width)
        .attr("height", height);

    d3.csv("/static/dataset/user_nutritional_data.csv").then(d => {
        //console.log(d);

        d.forEach(e => {
            e.Age = +e.Age;
            e.Calories = +e.Calories;
            e.Gender = +e.Gender;
        });

        const x = d3.scaleLinear()
                .domain(d3.extent(d, e => e.Age))
                .range([marginLeft, width - marginRight]);

        const y = d3.scaleLinear()
            .domain(d3.extent(d, e => e.Calories))
            .range([height - marginBottom, marginTop]);

        // Add the x-axis.
        svg.append("g")
            .attr("transform", `translate(0,${height - marginBottom})`)
            .call(d3.axisBottom(x));

        // Add the y-axis.
        svg.append("g")
            .attr("transform", `translate(${marginLeft},0)`)
            .call(d3.axisLeft(y));

        // Add X axis label:
        svg.append("text")
            .attr("text-anchor", "middle")
            .attr("x", width/2 + marginLeft/2)
            .attr("y", height - 5)
            .style("font-size", "14px")
            .text("Age");

        // Y axis label:
        svg.append("text")
            .attr("text-anchor", "middle")
            .attr("transform", "rotate(-90)")
            .attr("y", 20)
            .attr("x", - height/2)
            .style("font-size", "14px")
            .text("Calorie Intake In A Day")

        // create a tooltip
        const Tooltip = d3.select("#container")
            .append("div")
            .style("opacity", 0)
            .attr("class", "tooltip")
            .style("position", "absolute")
            .style("background-color", "white")
            .style("border", "1px solid black")
            .style("border-radius", "5px")
            .style("padding", "6px")
            .style("pointer-events", "none");

        // Three function that change the tooltip when user hover / move / leave a cell
        var mouseover = function(event, e) {
            Tooltip
            .style("opacity", 1)
            d3.select(this)
            .style("stroke", "black")
            .style("opacity", 1)
        }
        var mousemove = function(event, e) {
            Tooltip
            .html(`Age: ${e.Age}<br>Calories: ${e.Calories}<br>${e.Gender === 0 ? "Gender: Male" : "Gender: Female"}`)
            .style("left", (event.pageX + 10) + "px")
            .style("top", (event.pageY + 10) + "px");
        }
        var mouseleave = function(event, e) {
            Tooltip
            .style("opacity", 0)
            d3.select(this)
            .style("stroke", "none")
            .style("opacity", 0.8)
        }

        // Add dots
        svg.append('g')
            .selectAll("dot")
            .data(d)
            .enter()
            .append("circle")
            .attr("cx", e => x(e.Age))
            .attr("cy", e => y(e.Calories))
            .attr("r", 4)
            .style("fill", e => e.Gender === 0 ? "blue" : "red")
            .on("mouseover", mouseover)
            .on("mousemove", mousemove)
            .on("mouseleave", mouseleave);

        // Append the SVG element.
        container.append(svg.node());
    });
})
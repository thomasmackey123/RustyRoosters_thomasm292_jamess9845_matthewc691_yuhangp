document.addEventListener("DOMContentLoaded", () => {

    const container = document.getElementById("container");

    // get the sql data
    const user_data = JSON.parse(
        document.getElementById("info").textContent
    );
    const avg_data = JSON.parse(
        document.getElementById("avg").textContent
    );
    let total_calories = JSON.parse(
      document.getElementById("calories").textContent
    );
    total_calories = Math.round(total_calories/100.0) * 100

    // const calorie_group = [
    //   {calorie: 1000, protein: 45, carbs: 128, fat: 37},
    //   {calorie: 1100, protein: 50, carbs: 140, fat: 40},
    //   {calorie: 1200, protein: 54, carbs: 153, fat: 44},
    //   {calorie: 1300, protein: 59, carbs: 166, fat: 48},
    //   {calorie: 1400, protein: 63, carbs: 179, fat: 51},
    //   {calorie: 1500, protein: 68, carbs: 191, fat: 55},
    //   {calorie: 1600, protein: 72, carbs: 204, fat: 59},
    //   {calorie: 1700, protein: 77, carbs: 217, fat: 62},
    //   {calorie: 1800, protein: 81, carbs: 230, fat: 66},
    //   {calorie: 1900, protein: 86, carbs: 242, fat: 70},
    //   {calorie: 2000, protein: 90, carbs: 255, fat: 73},
    //   {calorie: 2100, protein: 95, carbs: 268, fat: 77},
    //   {calorie: 2200, protein: 99, carbs: 281, fat: 81},
    //   {calorie: 2300, protein: 104, carbs: 293, fat: 84},
    //   {calorie: 2400, protein: 108, carbs: 306, fat: 88},
    //   {calorie: 2500, protein: 113, carbs: 319, fat: 92}
    // ];

    let rec = {};
    rec['1000'] = {"protein": 45, "carbs": 128, "fat": 37};
    rec['1100'] = {"protein": 50, "carbs": 140, "fat": 40};
    rec['1200'] = {"protein": 54, "carbs": 153, "fat": 44};
    rec['1300'] = {"protein": 59, "carbs": 166, "fat": 48};
    rec['1400'] = {"protein": 63, "carbs": 179, "fat": 51};
    rec['1500'] = {"protein": 68, "carbs": 191, "fat": 55};
    rec['1600'] = {"protein": 72, "carbs": 204, "fat": 59};
    rec['1700'] = {"protein": 77, "carbs": 217, "fat": 62};
    rec['1800'] = {"protein": 81, "carbs": 230, "fat": 66};
    rec['1900'] = {"protein": 86, "carbs": 242, "fat": 70};
    rec['2000'] = {"protein": 90, "carbs": 255, "fat": 73};
    rec['2100'] = {"protein": 95, "carbs": 268, "fat": 77};
    rec['2200'] = {"protein": 99, "carbs": 281, "fat": 81};
    rec['2300'] = {"protein": 104, "carbs": 293, "fat": 84};
    rec['2400'] = {"protein": 108, "carbs": 306, "fat": 88};
    rec['2500'] = {"protein": 113, "carbs": 319, "fat": 92};

    const recs = rec[total_calories] || rec["2000"];


    // put data for bar graph
    const data = [
        { nutrient: "Protein", user: user_data.protein, avg: avg_data.protein, rec: recs.protein },
        { nutrient: "Carbs", user: user_data.carbs, avg: avg_data.carbs, rec: recs.carbs },
        { nutrient: "Fat", user: user_data.fat, avg: avg_data.fat, rec: recs.fat }
    ];

    const width = 700;
    const height = 450;
    const margin = 60;

    const svg = d3.create("svg")
        .attr("width", width)
        .attr("height", height);

    const x0 = d3.scaleBand()
        .domain(data.map(d => d.nutrient))
        .range([margin, width - margin])
        .padding(0.3);

    // subgraphs for user and avg data
    const x1 = d3.scaleBand()
        .domain(["user", "avg", "rec"])
        .range([0, x0.bandwidth()])
        .padding(0.1);

    const y = d3.scaleLinear()
        .domain([0, d3.max(data, d => Math.max(d.user, d.avg, d.rec))])
        .nice()
        .range([height - margin, margin]);

    // axes
    svg.append("g")
        .attr("transform", `translate(0,${height - margin})`)
        .call(d3.axisBottom(x0));

    svg.append("g")
        .attr("transform", `translate(${margin},0)`)
        .call(d3.axisLeft(y));

    // create a tooltip
    const tooltip = d3.select("#container")
        .append("div")
        .style("opacity", 0)
        .attr("class", "tooltip")
        .style("position", "absolute")
        .style("background-color", "white")
        .style("border", "1px solid black")
        .style("border-radius", "5px")
        .style("padding", "6px")
        .style("pointer-events", "none");
    
    // // Three function that change the tooltip when user hover / move / leave a cell
    // var mouseover = function(event, e) {
    //     Tooltip
    //     .style("opacity", 1)
    //     d3.select(this)
    //     .style("stroke", "black")
    //     .style("opacity", 1)
    // }
    // var mousemove = function(event, e) {
    //     Tooltip
    //     .html(`Age: ${e.Age}<br>Calories: ${e.Calories}<br>${e.Gender === 0 ? "Gender: Male" : "Gender: Female"}`)
    //     .style("left", (event.pageX + 10) + "px")
    //     .style("top", (event.pageY + 10) + "px");
    // }
    // var mouseleave = function(event, e) {
    //     Tooltip
    //     .style("opacity", 0)
    //     d3.select(this)
    //     .style("stroke", "none")
    //     .style("opacity", 0.8)
    // }

    // bars
    svg.append("g")
        .selectAll("g")
        .data(data)
        .enter()
        .append("g")
        .attr("transform", d => `translate(${x0(d.nutrient)},0)`)
        .selectAll("rect")
        .data(d => [
            { key: "user", value: d.user, nutrient: d.nutrient },
            { key: "avg", value: d.avg, nutrient: d.nutrient },
            { key: "rec", value: d.rec, nutrient: d.nutrient }
        ])
        .enter()
        .append("rect")
        .attr("x", d => x1(d.key))
        .attr("y", d => y(d.value))
        .attr("width", x1.bandwidth())
        .attr("height", d => height - margin - y(d.value))
        .attr("fill", d => {
            if (d.key === "user") return "steelblue";
            if (d.key === "avg") return "gray";
            return "green"; // recommended bar
        })
        .on("mouseover", function(event, d) {
            tooltip.style("opacity", 1);
            d3.select(this).style("stroke", "black");
        })
        .on("mousemove", function(event, d) {
            tooltip
                .html(`
                    <strong>${d.nutrient}</strong><br>
                    Type: ${d.key}<br>
                    Value: ${Math.round(d.value)}g
                `)
                .style("left", (event.pageX + 10) + "px")
                .style("top", (event.pageY + 10) + "px");
        })
        .on("mouseleave", function() {
            tooltip.style("opacity", 0);
            d3.select(this).style("stroke", "none");
        });

    // legend
    const legend = svg.append("g")
        .attr("transform", `translate(${width - 130}, 20)`);

    legend.append("rect")
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", 10)
        .attr("height", 10)
        .attr("fill", "steelblue");

    legend.append("text")
        .attr("x", 15)
        .attr("y", 10)
        .text("You");

    legend.append("rect")
        .attr("x", 0)
        .attr("y", 20)
        .attr("width", 10)
        .attr("height", 10)
        .attr("fill", "gray");

    legend.append("text")
        .attr("x", 15)
        .attr("y", 30)
        .text("Average");

    legend.append("rect")
        .attr("x", 0)
        .attr("y", 40)
        .attr("width", 10)
        .attr("height", 10)
        .attr("fill", "green");

    legend.append("text")
        .attr("x", 15)
        .attr("y", 50)
        .text("Recommended");

    container.append(svg.node());
});

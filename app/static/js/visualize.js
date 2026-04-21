document.addEventListener("DOMContentLoaded", () => {

    const container = document.getElementById("container");

    // get the sql data
    const user_data = JSON.parse(
        document.getElementById("info").textContent
    );
    const avg_data = JSON.parse(
        document.getElementById("avg").textContent
    );

    // put data for bar graph
    const data = [
        { nutrient: "Protein", user: user_data.protein, avg: avg_data.protein },
        { nutrient: "Carbs", user: user_data.carbs, avg: avg_data.carbs },
        { nutrient: "Fat", user: user_data.fat, avg: avg_data.fat }
    ];

    const width = 500;
    const height = 300;
    const margin = 40;

    const svg = d3.create("svg")
        .attr("width", width)
        .attr("height", height);

    const x0 = d3.scaleBand()
        .domain(data.map(d => d.nutrient))
        .range([margin, width - margin])
        .padding(0.3);

    // subgraphs for user and avg data
    const x1 = d3.scaleBand()
        .domain(["user", "avg"])
        .range([0, x0.bandwidth()])
        .padding(0.1);

    const y = d3.scaleLinear()
        .domain([0, d3.max(data, d => Math.max(d.user, d.avg))])
        .nice()
        .range([height - margin, margin]);

    // axes
    svg.append("g")
        .attr("transform", `translate(0,${height - margin})`)
        .call(d3.axisBottom(x0));

    svg.append("g")
        .attr("transform", `translate(${margin},0)`)
        .call(d3.axisLeft(y));

    // bars
    svg.append("g")
        .selectAll("g")
        .data(data)
        .enter()
        .append("g")
        .attr("transform", d => `translate(${x0(d.nutrient)},0)`)
        .selectAll("rect")
        .data(d => [
            { key: "user", value: d.user },
            { key: "avg", value: d.avg }
        ])
        .enter()
        .append("rect")
        .attr("x", d => x1(d.key))
        .attr("y", d => y(d.value))
        .attr("width", x1.bandwidth())
        .attr("height", d => height - margin - y(d.value))
        .attr("fill", d => d.key === "user" ? "blue" : "gray");

    // legend
    const legend = svg.append("g")
        .attr("transform", `translate(${width - 120}, 20)`);

    legend.append("rect")
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", 10)
        .attr("height", 10)
        .attr("fill", "blue");

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

    container.append(svg.node());
});
import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const DrawLineChart = ({ data }) => {
  // format the data
  const dataDateArray = Object.getOwnPropertyNames(data.cases);
  const casesNumberArray = Object.values(data.cases);
  const deathNumberArray = Object.values(data.deaths);
  const dataFormatted = [];
  for (let i = 0; i < Object.keys(data.cases).length; i++) {
    dataFormatted.push({
      date: dataDateArray[i],
      cases: casesNumberArray[i],
      deaths: deathNumberArray[i]
    })
  }
  
  // set ref for d3 to get the DOM
  const linechartRef = useRef();

  useEffect(() => {
    // resetting to blank map
    d3.select('.linechart-svg').remove();

    // setting the dimension of the chart
    const margin = { top: 20, right: 70, bottom: 50, left: 70 };
    const graphWidth = 900 - margin.left - margin.right;
    const graphHeight = 500 - margin.top - margin.bottom;

    // setting up svg element, making size responsive 
    const svg = d3.select(linechartRef.current)
      .append('svg')
      .attr('class', 'linechart-svg')
      .attr('preserveAspectRatio', 'xMinYMid meet')
      .attr('viewBox', `0 0 ${graphWidth + margin.left + margin.right} ${graphHeight + margin.top + margin.bottom}`);
    const graph = svg.append('g')
      .attr('width', graphWidth)
      .attr('height', graphHeight)
      .attr('transform', `translate(${margin.left}, ${margin.top})`);

    // set x & y scales
    const scaleX = d3.scaleTime()
      .domain(d3.extent(dataFormatted, d => new Date(d.date)))
      .range([0, graphWidth]);
    const scaleY = d3.scaleLinear()
      .domain(d3.extent(dataFormatted, d => d.cases))
      .range([graphHeight, 0]);
    const scaleY2 = d3.scaleLinear()
      .domain(d3.extent(dataFormatted, d => d.deaths))
      .range([graphHeight, 0]);

    // create axes
    const xAxis = d3.axisBottom(scaleX)
      .ticks(10);
    const yAxis = d3.axisLeft(scaleY)
      .ticks(10);
    const yAxis2 = d3.axisRight(scaleY2)
      .ticks(5);
    // axes groups
    const xAxisGroup = graph.append('g')
      .attr('class', 'x-axis')
      .attr('transform', `translate(0, ${graphHeight})`)
    const yAxisGroup = graph.append('g')
      .attr('class', 'y-axis')
    const yAxisGroup2 = graph.append('g')
      .attr('class', 'y-axis2')
      .attr('transform', `translate(${graphWidth}, 0)`)
    // call axes
    xAxisGroup.call(xAxis);
    yAxisGroup.call(yAxis);
    yAxisGroup2.call(yAxis2);

    // d3 line path generator
    const line = d3.line()
      .x(d => scaleX(new Date(d.date)))
      .y(d => scaleY(d.cases));

      // line path element
    const path = graph.append('path')
    path.data([dataFormatted])
      .attr('fill', 'none')
      .attr('stroke', 'blue')
      .attr('stroke-width', 3)
      .attr('d', line)

    // d3 line path generator
    const line2 = d3.line()
    .x(d => scaleX(new Date(d.date)))
    .y(d => scaleY2(d.deaths));
      
    // line path element
    const path2 = graph.append('path')
    path2.data([dataFormatted])
      .attr('fill', 'none')
      .attr('stroke', 'red')
      .attr('stroke-width', 3)
      .attr('d', line2)

    // hover effect
    const bisect = d3.bisector(d => new Date(d.date)).right;
    graph.append('rect')
      .attr('width', graphWidth)
      .attr('height', graphHeight)
      .attr('fill', 'none')
      .attr('pointer-events', 'all')
      .on('touchmove mousemove', (event) => {
        const x = d3.pointer(event)[0]
        const hoveredDate = scaleX.invert(x)
        const i = bisect(dataFormatted, hoveredDate);
        graph.selectAll('circle').remove();
        graph
          .append('circle')
          .attr('r', 5)
          .attr('cy', scaleY(dataFormatted[i].cases))
          .attr('cx', scaleX(new Date(dataFormatted[i].date)))
          .attr('fill', 'blue')
        graph
          .append('circle')
          .attr('r', 5)
          .attr('cy', scaleY2(dataFormatted[i].deaths))
          .attr('cx', scaleX(new Date(dataFormatted[i].date)))
          .attr('fill', 'red')
        graph.selectAll('line').remove();
        graph
          .append('line')
          .attr('stroke', '#aaa')
          .attr('stroke-width', 2)
          .attr('stroke-dasharray', 4)
          .attr('x1', scaleX(new Date(dataFormatted[i].date)))
          .attr('x2', scaleX(new Date(dataFormatted[i].date)))
          .attr('y1', graphHeight)
          .attr('y2', 0);
        graph
          .append('line')
          .attr('stroke', 'blue')
          .attr('stroke-width', 2)
          .attr('stroke-dasharray', 4)
          .attr('x1', 0)
          .attr('x2', scaleX(new Date(dataFormatted[i].date)))
          .attr('y1', scaleY(dataFormatted[i].cases))
          .attr('y2', scaleY(dataFormatted[i].cases));
        graph
          .append('line')
          .attr('stroke', 'red')
          .attr('stroke-width', 2)
          .attr('stroke-dasharray', 4)
          .attr('x1', scaleX(new Date(dataFormatted[i].date)))
          .attr('x2', graphWidth)
          .attr('y1', scaleY2(dataFormatted[i].deaths))
          .attr('y2', scaleY2(dataFormatted[i].deaths));
      })

  }, [])

  return (
    <div className='linechart' ref={linechartRef}></div>
  )
}

export default DrawLineChart;
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
  console.log(dataFormatted)
  
  // set ref for d3 to get the DOM
  const linechartRef = useRef();

  useEffect(() => {
    // resetting to blank map
    d3.select('.linechart-svg').remove();

    // setting the dimension of the chart
    const margin = { top: 20, right: 70, bottom: 30, left: 70 };
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
      .attr('stroke-width', 2)
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
      .attr('stroke-width', 2)
      .attr('d', line2)

    // set lines & circles for hover effect
    const hoverGroup = graph.append('g')
      .attr('class', 'hover-effects');
    // hoverGroup.append('path')
    //   .attr('class', 'hover-line')
    //   .attr('stroke', 'darkgrey')
    //   .attr('stroke-width', 2)
    //   .attr('stroke-dasharray', 4)
    //   .style('opacity', 1);
    const dottedLines = hoverGroup.append('g')
      .attr('class', 'lines')
      .style('opacity', 0);
    const xDottedLine = dottedLines.append('line')
      .attr('stroke', '#aaa')
      .attr('stroke-width', 1)
      .attr('stroke-dasharray', 4);
    const yDottedLine = dottedLines.append('line')
      .attr('stroke', '#aaa')
      .attr('stroke-width', 1)
      .attr('stroke-dasharray', 4);
    // const circles = hoverGroup.append('g')
    //   .attr('class', 'circles')
    //   .style('opacity', 0);
    // const casesCircles = circles.append('circle')
    //   .attr('class', 'cases-circle')
    //   .attr('r', 3)
    //   .attr('stroke', 'blue')
    //   .attr('stroke-width', 1)
    //   .attr('fill', 'none');
    // const deathsCircles = circles.append('circle')
    //   .attr('class', 'deaths-circle')
    //   .attr('r', 3)
    //   .attr('stroke', 'red')
    //   .attr('stroke-width', 1)
    //   .attr('fill', 'none');
    const hoverCircles = hoverGroup.selectAll('.hover-circles')
      .data(dataFormatted)
      .enter()
      .append('g')
      .attr('class', 'hover-circles')
    hoverCircles.append('circle')
      .attr('class', 'cases-circle')
      .attr('r', 5)
      .attr('stroke', 'blue')
      .attr('stroke-width', 1)
      .attr('fill', 'none')
      .style('opacity', 0)
      .attr('cx', d => scaleX(new Date(d.date)))
      .attr('cy', d => scaleY(d.cases))
    hoverCircles.append('circle')
      .attr('class', 'deaths-circle')
      .attr('r', 5)
      .attr('stroke', 'red')
      .attr('stroke-width', 1)
      .attr('fill', 'none')
      .style('opacity', 0)
      .attr('cx', d => scaleX(new Date(d.date)))
      .attr('cy', d => scaleY2(d.deaths))
    
    // hover effect
    // hoverGroup.selectAll('circle')
    //   .on('mouseover', (event, d) => {
    //     d3.select(event.currentTarget)
    //       .style('opacity', 1)
    //     xDottedLine
    //       .attr('x1', scaleX(new Date(d.date)))
    //       .attr('x2', scaleX(new Date(d.date)))
    //       .attr('y1', graphHeight)
    //       .attr('y2', scaleY(d.cases));
    //     yDottedLine
    //       .attr('x1', 0)
    //       .attr('x2', scaleX(new Date(d.date)))
    //       .attr('y1', scaleY(d.cases))
    //       .attr('y2', scaleY(d.cases));
    //     dottedLines.style('opacity', 1);
    //   })
    //   .on('mouseleave', (event, d) => {
    //     d3.select(event.currentTarget)
    //       .style('opacity', 0)
    //     dottedLines.style('opacity', 0)
    //   })
    hoverGroup.selectAll('.cases-circle')
    .on('mouseover', (event, d) => {
      d3.select(event.currentTarget)
        .style('opacity', 1)
      xDottedLine
        .attr('x1', scaleX(new Date(d.date)))
        .attr('x2', scaleX(new Date(d.date)))
        .attr('y1', graphHeight)
        .attr('y2', scaleY(d.cases));
      yDottedLine
        .attr('x1', 0)
        .attr('x2', scaleX(new Date(d.date)))
        .attr('y1', scaleY(d.cases))
        .attr('y2', scaleY(d.cases));
      dottedLines.style('opacity', 1);
    })
    .on('mouseleave', (event, d) => {
      d3.select(event.currentTarget)
        .style('opacity', 0)
      dottedLines.style('opacity', 0)
    })
    hoverGroup.selectAll('.deaths-circle')
    .on('mouseover', (event, d) => {
      d3.select(event.currentTarget)
        .style('opacity', 1)
      xDottedLine
        .attr('x1', scaleX(new Date(d.date)))
        .attr('x2', scaleX(new Date(d.date)))
        .attr('y1', graphHeight)
        .attr('y2', scaleY2(d.deaths));
      yDottedLine
        .attr('x1', graphWidth)
        .attr('x2', scaleX(new Date(d.date)))
        .attr('y1', scaleY2(d.deaths))
        .attr('y2', scaleY2(d.deaths));
      dottedLines.style('opacity', 1);
    })
    .on('mouseleave', (event, d) => {
      d3.select(event.currentTarget)
        .style('opacity', 0)
      dottedLines.style('opacity', 0)
    })


  }, [])

  return (
    <div className='linechart' ref={linechartRef}></div>
  )
}

export default DrawLineChart;
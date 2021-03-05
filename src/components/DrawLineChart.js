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

  // set color of the line
  const color = {
    cases: '#6895e0',
    deaths: '#fb6779'
  }
  
  // set ref for d3 to get the DOM
  const linechartRef = useRef();

  useEffect(() => {
    // resetting to blank map
    d3.select('.linechart-svg').remove();

    // setting the dimension of the chart
    const margin = { top: 80, right: 60, bottom: 40, left: 60 };
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
      .domain([0, d3.max(dataFormatted, d => d.cases)])
      .range([graphHeight, 0]);
    const scaleY2 = d3.scaleLinear()
      .domain([0, d3.max(dataFormatted, d => d.deaths)])
      .range([graphHeight, 0]);

    // create axes
    const xAxis = d3.axisBottom(scaleX)
      .ticks(10)
      .tickFormat(d3.timeFormat("%b %y"));
      const yAxis = d3.axisLeft(scaleY)
      .ticks(10)
      .tickFormat(d3.format('.2~s'));
      const yAxis2 = d3.axisRight(scaleY2)
      .ticks(5)
      .tickFormat(d3.format('.2~s'));
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
    // axis labels
    graph.append('text')
      .attr('class', 'axis-label')
      .attr('text-anchor', 'end')
      .attr('fill', color.cases)
      .attr('x', -5)
      .attr('y', -5)
      .text('Cases')
    graph.append('text')
      .attr('class', 'axis-label')
      .attr('text-anchor', 'start')
      .attr('fill', color.deaths)
      .attr('x', graphWidth + 5)
      .attr('y', -5)
      .text('Deaths')

    // chart title
    graph.append('text')
      .attr('class', 'line-title')
      .attr('text-anchor', 'middle')
      .attr('x', graphWidth / 2)
      .attr('y', -45)
      .text('Cumulative Global Cases / Deaths')
    graph.append('text')
      .attr('class', 'ask-hover')
      .attr('fill', '#02e0e0')
      .attr('text-anchor', 'middle')
      .attr('x', graphWidth / 2)
      .attr('y', -10)
      .style('opacity', 1)
      .text('- hover to check figures -')

    // path animation
    function tweenDash() {
      const l = this.getTotalLength(),
        i = d3.interpolateString(`0,${l}`, `${l},${l}`);
      return function(t) { return i(t) };
    }
    
    // deaths path
    // d3 line path generator
    const line2 = d3.line()
      .x(d => scaleX(new Date(d.date)))
      .y(d => scaleY2(d.deaths));
    // line path element
    const path2 = graph.append('path')
    path2.data([dataFormatted])
      .attr('fill', 'none')
      .attr('stroke', color.deaths)
      .attr('stroke-width', 3)
      .attr('d', line2)
      .transition()
        .duration(3500)
        .attrTween("stroke-dasharray", tweenDash)

    // cases path
    // d3 line path generator
    const line = d3.line()
      .x(d => scaleX(new Date(d.date)))
      .y(d => scaleY(d.cases));
    // line path element
    const path = graph.append('path')
    path.data([dataFormatted])
      .attr('fill', 'none')
      .attr('stroke', color.cases)
      .attr('stroke-width', 3)
      .attr('d', line)
      .transition()
        .duration(3500)
        .attrTween("stroke-dasharray", tweenDash)

    // create hover lines
    const lineDate = graph.append('line')
      .attr('stroke', 'darkgrey')
      .attr('stroke-width', 2)
      .attr('stroke-dasharray', 4)
    const lineCase = graph.append('line')
      .attr('stroke', color.cases)
      .attr('stroke-width', 2)
      .attr('stroke-dasharray', 4)
    const lineDeath =graph.append('line')
      .attr('stroke', color.deaths)
      .attr('stroke-width', 2)
      .attr('stroke-dasharray', 4)
    // create hover circles
    const circleCase = graph.append('circle')
      .attr('r', 5)
      .attr('fill', color.cases)
    const circleDeath = graph.append('circle')
      .attr('r', 5)
      .attr('fill', color.deaths)
    // create tooltips
    const tooltipDate = graph.append('text')
      .attr('class', 'tooltip-date')
      .attr('text-anchor', 'middle')
      .attr('fill', 'darkgrey')
    const tooltipCase = graph.append('text')
      .attr('class', 'tooltip-case')
      .attr('fill', color.cases)
    const tooltipDeath = graph.append('text')
      .attr('class', 'tooltip-death')
      .attr('text-anchor', 'end')
      .attr('fill', color.deaths)

    // hover effect
    const bisect = d3.bisector(d => new Date(d.date)).right;
    graph.append('rect')
      .attr('width', graphWidth - 1)
      .attr('height', graphHeight)
      .attr('fill', 'none')
      .attr('pointer-events', 'all')
      .on('touchmove mousemove', (event) => {
        graph.select('.ask-hover')
          .style('opacity', 0)
        const x = d3.pointer(event)[0]
        const hoveredDate = scaleX.invert(x)
        const i = bisect(dataFormatted, hoveredDate);
        lineDate
          .attr('x1', scaleX(new Date(dataFormatted[i].date)))
          .attr('x2', scaleX(new Date(dataFormatted[i].date)))
          .attr('y1', graphHeight)
          .attr('y2', 0);
        lineCase
          .attr('x1', 0)
          .attr('x2', scaleX(new Date(dataFormatted[i].date)))
          .attr('y1', scaleY(dataFormatted[i].cases))
          .attr('y2', scaleY(dataFormatted[i].cases));
        lineDeath
          .attr('x1', scaleX(new Date(dataFormatted[i].date)))
          .attr('x2', graphWidth)
          .attr('y1', scaleY2(dataFormatted[i].deaths))
          .attr('y2', scaleY2(dataFormatted[i].deaths));
        circleCase
          .attr('cy', scaleY(dataFormatted[i].cases))
          .attr('cx', scaleX(new Date(dataFormatted[i].date)))
        circleDeath
          .attr('cy', scaleY2(dataFormatted[i].deaths))
          .attr('cx', scaleX(new Date(dataFormatted[i].date)))
        // define date format
        tooltipDate
          .attr('transform', `translate(${scaleX(new Date(dataFormatted[i].date))}, -18)`)
          .text(d3.timeFormat('%d %b %y')(new Date(dataFormatted[i].date)))
        // define number format
        const formatComma = d3.format(',')
        tooltipCase
          .attr('transform', `translate(5, ${scaleY(dataFormatted[i].cases) - 5})`)
          .text(formatComma(dataFormatted[i].cases))
        tooltipDeath
          .attr('transform', `translate(${graphWidth -5}, ${scaleY2(dataFormatted[i].deaths) - 5})`)
          .text(formatComma(dataFormatted[i].deaths))
      })

  }, [])

  return (
    <div className='linechart' ref={linechartRef}></div>
  )
}

export default DrawLineChart;
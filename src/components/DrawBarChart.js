import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { tip as d3tip } from 'd3-v6-tip';

const DrawBarChart = ({ data, type }) => {
  // format the data into arrays
  const dataDateArray = Object.keys(data.cases);
  const casesNumberArray = Object.values(data.cases);
  const deathNumberArray = Object.values(data.deaths);
  const dataFormatted = [];
  for (let i = 0; i < dataDateArray.length; i++) {
    dataFormatted.push({
      date: dataDateArray[i],
      cases: casesNumberArray[i] - casesNumberArray[i-1],
      deaths: deathNumberArray[i] - deathNumberArray[i-1]
    })
  }

  // set color of the line
  const color = {
    cases: '#6895e0',
    deaths: '#fb6779'
  }
  // set axis labels
  const label = {
    cases: 'Cases',
    deaths: 'Deaths'
  }
  // set tick format
  const tick = {
    cases: '~s',
    deaths: '~s'
  }

  // set ref for d3 to get the DOM
  const barchartRef = useRef(null);
  // draw the bar chart on first render & everytime chart type changes
  useEffect(() => {
    // resetting to blank map
    d3.select('.barchart-svg').remove();

    // setting the dimension of the chart
    const margin = { top: 80, right: 60, bottom: 40, left: 60 };
    const graphWidth = 900 - margin.left - margin.right;
    const graphHeight = 500 - margin.top - margin.bottom;

    // setting up svg element, making size responsive
    const svg = d3.select(barchartRef.current)
      .append('svg')
      .attr('class', 'barchart-svg')
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
      .domain([0, d3.max(dataFormatted, d => d[type])])
      .range([graphHeight, 0]);

    // create axes
    const xAxis = d3.axisBottom(scaleX)
      .ticks(20)
      .tickFormat(d3.timeFormat("%b %y"));
    const yAxis = d3.axisLeft(scaleY)
      .ticks(10)
      .tickFormat(d3.format(tick[type]));
    // axes groups
    const xAxisGroup = graph.append('g')
      .attr('class', 'x-axis')
      .attr('transform', `translate(0, ${graphHeight})`)
    const yAxisGroup = graph.append('g')
      .attr('class', 'y-axis')
    // call axes
    xAxisGroup.call(xAxis);
    yAxisGroup.call(yAxis);
    // axis labels
    graph.append('text')
      .attr('class', 'axis-label')
      .attr('text-anchor', 'end')
      .attr('fill', color[type])
      .attr('x', -5)
      .attr('y', -5)
      .text(label[type])

    // chart grid
    graph.append('g')
      .attr('class', 'grid')
      .call(d3.axisLeft(scaleY)
        .tickSize(-graphWidth)
        .tickFormat(''))

    // chart title
    graph.append('text')
      .attr('class', 'bar-title')
      .attr('text-anchor', 'middle')
      .attr('x', graphWidth / 2)
      .attr('y', -45)
      .text('Daily Global ' + label[type])
    graph.append('text')
      .attr('class', 'ask-hover')
      .attr('fill', '#02e0e0')
      .attr('text-anchor', 'middle')
      .attr('x', graphWidth / 2)
      .attr('y', -10)
      .style('opacity', 1)
      .text('- hover to check figures -')
    
    // set bar width
    const barWidth = graphWidth / dataFormatted.length
    // cases bar
    const casesBar = graph.selectAll('.bar')
      .data(dataFormatted)
    casesBar.enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('width', barWidth)
      .attr('height', 0)
      .attr('fill', color[type])
      .attr('x', (d, i) => i * barWidth)
      .attr('y', graphHeight)
      .transition().duration(1000)
        .attr('height', d => graphHeight - scaleY(d[type]))
        .attr('y', d => scaleY(d[type]))

    // set tooltip
    const tip = d3tip()
      .attr('class', 'd3-tip card')
      .offset([-15, 0])
      .style('opacity', 0)
      .html((event, d) => {
        const figure = d[type];
        let content = `<div class='tip-date'>${d3.timeFormat('%d %b %y, %a')(new Date(d.date))}</div>`;
        content += `<div class='tip-figure'>${d3.format(',')(figure)}</div>`;
        return content;
      })
    graph.call(tip);

    // hover effect
    graph.selectAll('.bar')
      .on('mouseover', (event, d) => {
        graph.select('.ask-hover')
          .style('opacity', 0)
        d3.select(event.currentTarget)
          .attr('fill', 'yellow')
        tip.show(event, d);
      })
      .on('mouseout', (event, d) => {
        d3.select(event.currentTarget)
          .attr('fill', color[type])
        tip.hide();
      })
  }, [type])

  return (
    <div className='barchart' ref={barchartRef}></div>
  )
}

export default DrawBarChart;
import * as d3 from 'd3';
import { tip as d3tip } from 'd3-v6-tip';
import { selectAll } from 'd3';
import { geoPatterson } from 'd3-geo-projection';

const drawBubbles = (displayType, countryResults) => {
  // define color for different display type
  let color;
  switch (displayType) {
    case 'cases':
      color = '#636363';
      break;
    case 'active':
      color = '#eb4034';
      break;
    case 'casesPerOneMillion':
      color = '#34c9eb';
      break;
    case 'todayCases':
      color = '#137B80';
      break;
    case 'todayDeaths':
      color = '#97cdd1';
      break;
  }
  //resetting to blank map
  selectAll('circle').remove();
  selectAll('text').remove();
  
  // select the map-group class from WorldMap
  const graph = d3.select('.map-group');
  // set projection
  const projection = geoPatterson();

  // define the circle scale
  const sizeScale = d3.scaleSqrt()
    .domain([0, d3.max(countryResults, d => d[`${displayType}`])])
    .range([0, 30]);
  // select circles from the graph & pass covid data
  const circles = graph.selectAll('circle')
    .data(countryResults);
  // append circle to the group & set 'd' attribute
  circles.enter()
      .append('circle')
      .attr('class', 'country-circle')
      .attr('transform', d => `translate(${projection([d.countryInfo.long, d.countryInfo.lat])})`)
      .attr('r', d => sizeScale(d[`${displayType}`]))
      .attr('fill', color)
      .attr('fill-opacity', 0.5)
      .append('title')
      .text(d => d[`${displayType}`]);

  const text = graph.selectAll('text')
    .data(countryResults);
  text.enter()
    .append('text')
    .attr('class', 'tooltip-text')
    .attr('transform', d => `translate(${projection([d.countryInfo.long, d.countryInfo.lat])})`)
    .attr('text-anchor', 'middle')
    .html(d => d.country + '&#10;' + d[`${displayType}`])
    // .html(
    //   '<a href= "http://google.com">'
    // )
    .style('opacity', 0)

    // add mouse hover events
    graph.selectAll('.tooltip-text')
    .on('mouseover', (event) => {
      d3.select(event.currentTarget)
        .transition().duration(300)
        .style('opacity', 1)
    })
    .on('mouseout', (event) => {
      d3.select(event.currentTarget)
        .transition().duration(300)
        .style('opacity', 0)
    });

}
export default drawBubbles; 
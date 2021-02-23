import * as d3 from 'd3';
import { geoPatterson } from 'd3-geo-projection';

const drawBubbles = (countryResults) => {
  
  // select the map-group class from WorldMap
  const graph = d3.select('.map-group');
  // set projection
  const projection = geoPatterson()
    .center([0, 30]);
  // define the circle scale
  const sizeScale = d3.scaleSqrt()
    .domain([0, d3.max(countryResults, d => d.cases)])
    .range([0, 40]);
  // select circles from the graph & pass covid data
  const circles = graph.selectAll('circle')
    .data(countryResults);
  // append circle to the group & set 'd' attribute
  circles.enter()
      .append('circle')
      .attr('class', 'country-circle')
      .attr('transform', d => `translate(${projection([d.countryInfo.long, d.countryInfo.lat])})`)
      .attr('r', d => sizeScale(d.cases))
      .attr('fill', '#a6e8ed')
      .attr('fill-opacity', 0.5)
      .attr('stroke', '#97cdd1')
      .attr('strole-width', 0.5)
}

export default drawBubbles;
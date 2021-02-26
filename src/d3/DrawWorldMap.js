import * as d3 from 'd3';
import { schemeDark2, selectAll } from 'd3';
import { geoPatterson } from 'd3-geo-projection';
import { feature } from 'topojson';

const drawWorldMap = (topoJSONData, countryResults) => {
  // resetting to blank map
  selectAll('path').remove();

  // setting up svg element, making size responsive
  const dimension = { width: 960, height: 420 };
  // append an svg element to the DOM
  const svg = d3.select('#base-worldmap')
    .append('div')
    .append('svg')
    .attr('class', 'map-svg')
    .attr('preserveAspectRatio', 'xMinYMid meet')
    .attr('viewBox', `0 0 ${dimension.width} ${dimension.height}`);

  // create a new projection function
  const projection = geoPatterson();
  // create a GeoPath function from the projection
  const path = d3.geoPath()
    .projection(projection);

  // create a group to manage map elements
  const graph = svg.append('g')
    .attr('class', 'map-group');
  
  // draw the sphere
  graph.append('path')
    .attr('class', 'map-sphere')
    .attr('d', path({type: 'Sphere'}))
    .attr('fill', '#fff');

  // color scale
  const colorScale = d3.scaleThreshold()
    .domain([100, 1000, 10000, 100000, 1000000])
    // .domain([0, d3.max(countryResults, d => d.casesPerOneMillion)])
    .range(d3.schemeBlues[7]);

  // convert topojson to geojson
  const countries = feature(topoJSONData, topoJSONData.objects.countries);
  // get the features property from geojson object
  const countryData = countries.features;
  console.log(countryData)

  // country cases
  const countryCases = {}
  countryResults.forEach(d => countryCases[d.countryInfo._id] = d.cases)
  console.log(countryCases)

  // select paths from the graph & pass country data
  const paths = graph.selectAll('path')
    .data(countryData);

  // append path to the group & set 'd' attribute
  paths.enter()
    .append('path')
    .attr('class', 'map-country')
    .attr('d', path)
    .attr('stroke', '#fff')
    .attr('stroke-width', 0.5)
    // .attr('fill', '#D9D9DB')
    // .attr('fill', 'none')
    .attr('fill', d => colorScale(countryCases[d.id]))
    .append('title')
    .text(d => d.properties.name);

  // zoom the map
  const zoom = d3.zoom()
    .scaleExtent([1, 5])
    .on('zoom', (event) => {
      graph.attr('transform', event.transform)
    })
  svg.call(zoom);
  // zoom button
  d3.select('#zoom-in')
    .on('click', () => {
      zoom.scaleBy(svg.transition().duration(500), 1.5);
    });
  d3.select('#zoom-out')
    .on('click', () => {
      zoom.scaleBy(svg.transition().duration(500), 0.5);
    });
  d3.select('#reset-map')
    .on('click', () => {
      svg.transition().duration(750)
        .call(
          zoom.transform,
          d3.zoomIdentity,
          d3.zoomTransform(svg.node()).invert([dimension.width / 2, dimension.height / 2])
        )
    });

  // add mouse hover events
  graph.selectAll('.map-country')
    .on('mouseover', (event) => {
      d3.selectAll('.map-country')
        .transition().duration(200)
        .style('opacity', 0.3)
      d3.select(event.currentTarget)
        .transition().duration(200)
        .style('opacity', 1)
        .style('stroke', 'black')
    })
    .on('mouseout', (event) => {
      d3.selectAll('.map-country')
        .transition().duration(200)
        .style('opacity', 1)
      d3.select(event.currentTarget)
        .transition().duration(200)
        .style('stroke', 'transparent')
    });

}

export default drawWorldMap;
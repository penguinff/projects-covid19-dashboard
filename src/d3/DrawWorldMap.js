import * as d3 from 'd3';
import { geoPatterson } from 'd3-geo-projection';
import { feature } from 'topojson';

const DrawWorldMap = () => {
  // setting up svg element, making size responsive
  const dimension = { width: 960, height: 500 };
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

  // zoom the map
  const zoom = d3.zoom()
    .scaleExtent([1, 5])
    .on('zoom', (event) => {
      graph.selectAll('path')
        .attr('transform', event.transform)
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

  // fetching topojson & country name, then use the fetched data to draw map
  Promise.all([
    d3.json('https://unpkg.com/world-atlas@1.1.4/world/50m.json'),
    d3.tsv('https://unpkg.com/world-atlas@1.1.4/world/50m.tsv')
  ]).then(([topoJSONData, tsvData]) => {

    // convert topojson to geojson
    const countries = feature(topoJSONData, topoJSONData.objects.countries);
    // get the features property from geojson object
    const countryData = countries.features;
    // get country name from fetched tsv data
    const countryName = {};
    tsvData.forEach(item => countryName[item.iso_n3] = item.name);

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
      .attr('fill', '#D9D9DB')
      .append('title')
      .text(d => countryName[d.id]);

    // add mouse hover events
    graph.selectAll('.map-country')
      .on('mouseover', (event) => {
        d3.select(event.currentTarget)
          .transition().duration(300)
          .attr('stroke', '#fff')
          .attr('fill', '#4287f5')
      })
      .on('mouseout', (event) => {
        d3.select(event.currentTarget)
          .transition().duration(300)
          .attr('stroke', '#fff')
          .attr('fill', '#D9D9DB')
      });
  })
}

export default DrawWorldMap;
import * as d3 from 'd3';
import { feature } from 'topojson';
import countryTopo from './50m.json';

// d3.tsv('https://unpkg.com/world-atlas@1.1.4/world/50m.tsv').then(tsvData => {
//   DrawWorldMap(tsvData);
//   console.log(tsvData);
// })

// // fetching topojson and country name
// Promise.all([
//   d3.json('https://unpkg.com/world-atlas@1.1.4/world/50m.json'),
//   d3.tsv('https://unpkg.com/world-atlas@1.1.4/world/50m.tsv')
// ]).then(([topoJSONData, tsvData]) => {
//   // DrawWorldMap(topoJSONData, tsvData);
//   console.log(topoJSONData);
//   console.log(tsvData);
//   const countryName = {};
//   tsvData.forEach(item => countryName[item.iso_n3] = item.name);
//   console.log(countryName);
//   DrawWorldMap(countryName);
// })

const DrawWorldMap = () => {
  // setting up svg element, making size responsive
  const dimension = { width: 960, height: 500 }
  // append an svg element to the DOM
  const svg = d3.select('#base-worldmap')
    .append('svg')
    .attr('class', 'worldmapSvg')
    .attr('width', dimension.width)
    .attr('height', dimension.height)
    .attr('viewbox', `0 0 ${dimension.width} ${dimension.height}`)
    .attr('preserveAspectRatio', 'xMinYMid meet');

  // convert topojson to geojson
  const countries = feature(countryTopo, countryTopo.objects.countries);
  // get the features property from geojson object
  const data = countries.features;

  // create a new projection function
  const projection = d3.geoNaturalEarth1();

  // create a GeoPath function from the projection
  const path = d3.geoPath()
    .projection(projection);

  // append a group to svg & pass the data to the group
  const graph = svg.append('g');
    
  const paths = graph.selectAll('path')
    .data(data);
  // // append path to the group & set 'd' attribute
  // graph.enter()
  //   .append('path')
  //   .attr('d', path)
  //   .attr('stroke', '#e9f2f1')
  //   .attr('fill', '#7fdbd1');

  // fetching topojson and country name
  Promise.all([
    d3.json('https://unpkg.com/world-atlas@1.1.4/world/50m.json'),
    d3.tsv('https://unpkg.com/world-atlas@1.1.4/world/50m.tsv')
  ]).then(([topoJSONData, tsvData]) => {
    // DrawWorldMap(topoJSONData, tsvData);
    // console.log(topoJSONData);
    // console.log(tsvData);
    const countryName = {};
    tsvData.forEach(item => countryName[item.iso_n3] = item.name);
    // console.log(countryName);
    // append path to the group & set 'd' attribute
    paths.enter()
      .append('path')
      .attr('d', path)
      .attr('stroke', '#e9f2f1')
      .attr('fill', '#7fdbd1')
      .append('title')
      .text(d => countryName[d.id]);

    // add events
    graph.selectAll('path')
      .on('mouseover', (event, d) => {
        d3.select(event.currentTarget)
          .transition().duration(300)
          .attr('fill', '#4287f5')
      })
      .on('mouseout', (event, d) => {
        d3.select(event.currentTarget)
          .transition().duration(300)
          .attr('fill', '#7fdbd1')
      });


  })
}

export default DrawWorldMap;
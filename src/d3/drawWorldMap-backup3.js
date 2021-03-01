import * as d3 from 'd3';
import { selectAll } from 'd3';
import { geoPatterson } from 'd3-geo-projection';
import { feature } from 'topojson';
import { tip as d3tip } from 'd3-v6-tip';

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
  
  // create a group to manage tooltip
  const tipBox = svg.append('g')
    .attr('class', 'tooltip')
  tipBox.append('rect')
    .attr('class', 'tooltip-rect')
    .attr('x', 30)
    .attr('y', 250)
    .attr('height', 60)
    .attr('width', 215)
    .attr("rx", 10)
    .attr("ry", 10)
    .attr('fill', 'white')
    .attr('stroke', 'darkgrey')
    .attr('stroke-width', 1.5)
    .style('opacity', 0.8)
  tipBox.append('text')
    .attr('class', 'tooltip-text1')
    .attr('transform', 'translate(40,275)')
    .attr('fill', 'black')
    .text('Country COVID-19 Status')
  tipBox.append('text')
    .attr('class', 'tooltip-text2')
    .attr('transform', 'translate(40,298)')
    .attr('fill', '#db0063')
    .text('- Hover over a country -')
  tipBox.append('text')
    .attr('class', 'tooltip-text3')
    .attr('transform', 'translate(40,320)')
    .attr('fill', 'grey')
  tipBox.append('text')
    .attr('class', 'tooltip-text4')
    .attr('transform', 'translate(40,340)')
    .attr('fill', 'grey')

  // color scale
  const colorScale = d3.scaleThreshold()
    .domain([100, 1000, 10000, 100000, 1000000, 10000000, 20000000, 30000000])
    // .domain([0, d3.max(countryResults, d => d.casesPerOneMillion)])
    // .range(d3.schemeBlues[8]);
    .range(d3.schemeBlues[8]);

  // convert topojson to geojson
  const countries = feature(topoJSONData, topoJSONData.objects.countries);
  // get the features property from geojson object
  let countryData = countries.features;
  // change countryData array's id from string to number to match the id type in countryCases
  countryData.forEach(item => item.id = +item.id);

  // country names
  const countryNames = {}
  countryResults.forEach(d => countryNames[d.countryInfo._id] = d.country);
  // country cases
  const countryCases = {}
  countryResults.forEach(d => countryCases[d.countryInfo._id] = d.cases);
  // updated time
  const updatedTime = new Date(countryResults[1].updated).toLocaleString()
  // fotmatting the number
  const formatComma = d3.format(',')
  // country cases formatted
  const countryCasesFormatted = {}
  countryResults.forEach(d => countryCasesFormatted[d.countryInfo._id] = formatComma(d.cases));
  // country deaths formatted
  const countryDeathsFormatted = {}
  countryResults.forEach(d => countryDeathsFormatted[d.countryInfo._id] = formatComma(d.deaths));

  // create a group to manage udpated time
  svg.append('text')
  .attr('class', 'updated-time') 
  .attr('transform', 'translate(750,408)')
  .attr('fill', 'grey')
  .text(`Last Updated at: ${updatedTime}`)

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
    .attr('fill', d => colorScale(countryCases[(d.id)]))

  // fix the missing COVID-19 data for some countries
  countryData.forEach(d => {
    if(!countryNames[(d.id)]) {
      countryNames[(d.id)] = d.properties.name;
    }
    if(!countryCases[(d.id)]) {
      countryCasesFormatted[(d.id)] = 'No Info';
      countryDeathsFormatted[(d.id)] = 'No Info';
    }
  })

  // initialize tooltip
  const tip = d3tip()
    .attr('class', 'd3-tip')
    .offset([100,100])
    .html((event, d) => {
      let content = `<div class='tooltip-name'>${countryNames[(d.id)]}</div>`;
      content += `<div class='tooltip-case'>Cases: ${countryCases[(d.id)]}</div>`;
      return content;
    })
  // invoke the tip
  graph.call(tip);

  // create a group to manage zoom button
  const zoomButtons = svg.append('g')
    .attr('class', '.zoomButtons')
  zoomButtons.append('path')
    .attr('class', 'zoom-icon')
    .attr('transform', 'translate(33, 33)')
    .attr('fill', 'black')
    .attr('d', 'M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z')
  zoomButtons.append('path')
    .attr('class', 'zoom-icon')
    .attr('transform', 'translate(33, 68)')
    .attr('fill', 'black')
    .attr('d', 'M19 13H5v-2h14v2z')
  zoomButtons.append('path')
    .attr('class', 'zoom-icon')
    .attr('transform', 'translate(33, 103)')
    .attr('fill', 'black')
    .attr('d', 'M19 8l-4 4h3c0 3.31-2.69 6-6 6-1.01 0-1.97-.25-2.8-.7l-1.46 1.46C8.97 19.54 10.43 20 12 20c4.42 0 8-3.58 8-8h3l-4-4zM6 12c0-3.31 2.69-6 6-6 1.01 0 1.97.25 2.8.7l1.46-1.46C15.03 4.46 13.57 4 12 4c-4.42 0-8 3.58-8 8H1l4 4 4-4H6z')
  zoomButtons.append('rect')
    .attr('class', 'map-zoom-in')
    .attr('x', 30)
    .attr('y', 30)
    .attr('height', 30)
    .attr('width', 30)
    .attr("rx", 3)
    .attr("ry", 3)
    .attr('fill', 'white')
    .attr('stroke', 'black')
    .attr('stroke-width', 2)
    .style('opacity', 0.4)
  zoomButtons.append('rect')
    .attr('class', 'map-zoom-out')
    .attr('x', 30)
    .attr('y', 65)
    .attr('height', 30)
    .attr('width', 30)
    .attr("rx", 3)
    .attr("ry", 3)
    .attr('fill', 'white')
    .attr('stroke', 'black')
    .attr('stroke-width', 2)
    .style('opacity', 0.4)
  zoomButtons.append('rect')
    .attr('class', 'map-zoom-reset')
    .attr('x', 30)
    .attr('y', 100)
    .attr('height', 30)
    .attr('width', 30)
    .attr("rx", 3)
    .attr("ry", 3)
    .attr('fill', 'white')
    .attr('stroke', 'black')
    .attr('stroke-width', 2)
    .style('opacity', 0.4)
  
  // zoom the map
  const zoom = d3.zoom()
    .scaleExtent([1, 5])
    .on('zoom', (event) => {
      graph.attr('transform', event.transform)
    })
  svg.call(zoom);
  // zoom button
  d3.select('.map-zoom-in')
    .on('click', () => {
      zoom.scaleBy(svg.transition().duration(500), 1.5);
    });
  d3.select('.map-zoom-out')
    .on('click', () => {
      zoom.scaleBy(svg.transition().duration(500), 0.5);
    });
  d3.select('.map-zoom-reset')
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
    .on('mouseover', function(event, d) {
      d3.selectAll('.map-country')
        .transition().duration(200)
        .attr('stroke', 'white')
        .style('opacity', 0.3)
      d3.select(event.currentTarget)
        .transition().duration(200)
        .attr('stroke', 'black')
        .attr('stroke-width', 1)
        .style('opacity', 1)
      d3.select('.tooltip-rect')
        .attr('height', 100)
      d3.select('.tooltip-text2')
        .text(countryNames[(d.id)])
      d3.select('.tooltip-text3')
        .text(`- Cases: ${countryCasesFormatted[(d.id)]}`)
      d3.select('.tooltip-text4')
        .text(`- Deaths: ${countryDeathsFormatted[(d.id)]}`)
    })
    .on('mouseout', (event, d) => {
      d3.selectAll('.map-country')
        .transition().duration(200)
        .attr('stroke', 'white')
        .attr('stroke-width', 0.5)
        .style('opacity', 1)
      d3.select('.tooltip-rect')
        .attr('height', 60)
      d3.select('.tooltip-text2')
        .text('- Hover over a country -')
      d3.select('.tooltip-text3')
        .text('')
      d3.select('.tooltip-text4')
        .text('')
    });

}

export default drawWorldMap;
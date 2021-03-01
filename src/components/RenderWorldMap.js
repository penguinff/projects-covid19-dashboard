import { useEffect } from 'react';
import drawWorldMap from '../d3/drawWorldMap';

const RenderWorldMap = ({topoJSONData, countryResults, mapType}) => {
  useEffect(() => {
    drawWorldMap(topoJSONData, countryResults, mapType)
  }, [mapType])

  return (
    <div id='base-worldmap'></div>
  )
}

export default RenderWorldMap;
import { useEffect } from 'react';
import drawWorldMap from '../d3/drawWorldMap';

const RenderWorldMap = ({topoJSONData, countryResults}) => {
  useEffect(() => {
    drawWorldMap(topoJSONData, countryResults)
  }, [])

  return (
    <div id='base-worldmap'></div>
  )
}

export default RenderWorldMap;
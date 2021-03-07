const InfoCard = ({ country, figure, flag }) => {
  return (
    <div className='info-card'>
      <div className='info-card-figure'>{figure.toLocaleString()}</div> 
      <div className='info-card-flag'>
        <img src={flag} className='info-card-flag-img' />
      </div>
      <div className='info-card-country'>{country}</div>
    </div>
  )
}

export default InfoCard;
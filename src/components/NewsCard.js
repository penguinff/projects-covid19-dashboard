const NewsCard = ({ newsArticle }) => {

  let options = { year: 'numeric', month: 'short', day: 'numeric' };

  return (
    <div className="news-card card">
      <div className="card-image">
        <img src={newsArticle.urlToImage} />
        <a href={newsArticle.url} target='_blank' className="btn-floating halfway-fab waves-effect waves-light amber"><i className="material-icons">arrow_forward</i></a>
      </div>
      <div className="card-content">
        <p className='news-title'>{newsArticle.title}</p>
        <p className='news-description'>{newsArticle.description}</p>      
        <p className='s-text grey-text'>{newsArticle.source.name}</p>
        <p className='s-text grey-text'>{new Date(newsArticle.publishedAt).toLocaleTimeString(undefined,options)}</p>
        </div>
    </div>
  )
}

export default NewsCard;
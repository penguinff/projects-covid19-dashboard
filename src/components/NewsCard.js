const NewsCard = ({ newsArticle }) => {

  return (
    <div className='news-card card'>
      <h6>{newsArticle.title}</h6>
      <p>{newsArticle.description}</p>
      <p>{newsArticle.publishedAt}</p>
      <p>{newsArticle.source.name}</p>
      <a href={newsArticle.url} target='_blank'>Click</a>
    
    </div>
  )
}

export default NewsCard;
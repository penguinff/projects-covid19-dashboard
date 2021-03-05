import { useState, useEffect } from 'react';
import NewsCard from './NewsCard';

const NewsCards = () => {
  
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth()+1;
  const day = today.getDay()
  const todayDate = `${year}-${month}-${day}`;
  const APIKey = '80fbb6e4de8a4ea3b8df438b8f35afd8'
  const newsAPI = `http://newsapi.org/v2/everything?q=covid-19&from=${todayDate}&sortBy=publishedAt&sources=bbc-news&apiKey=${APIKey}`;
  
  const [newsData, setNewsData] = useState(null)

  useEffect(() => {
    fetch(newsAPI)
      .then(res => res.json())
      .then(data => setNewsData(data))
  }, []);

  if (!newsData) {
    return <pre>Loading news...</pre>
  }

  return (
    <div className='section news-cards'>
      {newsData.articles.map(item => <NewsCard key={item.url} newsArticle={item}/>)}
    </div>
  )
}

export default NewsCards;
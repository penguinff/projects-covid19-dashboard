import { useState, useEffect } from 'react';
import NewsCard from './NewsCard';
import Spinner from './Spinner';

const NewsCards = () => {
  
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth()+1;
  const day = today.getDay()
  const todayDate = `${year}-${month}-${day}`;
  const APIKey = '80fbb6e4de8a4ea3b8df438b8f35afd8'
  const newsAPI = `http://newsapi.org/v2/top-headlines?q=coronavirus&language=en&from=${todayDate}&sortBy=publishedAt&apiKey=${APIKey}`;
  // http://newsapi.org/v2/everything?q=covid-19&from=2021-3-6&sortBy=publishedAt&sources=bbc-news&apiKey=80fbb6e4de8a4ea3b8df438b8f35afd8
  
  const [newsData, setNewsData] = useState(null)

  useEffect(() => {
    fetch(newsAPI)
      .then(res => res.json())
      .then(data => setNewsData(data))
  }, []);

  if (!newsData) {
    return <Spinner />;
  }

  return (
    <div className='section news-cards'>
      <div className='news-card-summary'>COVID-19 Related News</div>
      {newsData.articles.map(item => <NewsCard key={item.url} newsArticle={item}/>)}
    </div>
  )
}

export default NewsCards;
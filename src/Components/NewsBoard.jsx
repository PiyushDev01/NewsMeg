import { useEffect, useState } from "react"
import NewsItem from "./NewsItem";


const NewsBoard = ({category}) => {

    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    useEffect(() => {
        const fetchNews = async () => {
            try {
                setLoading(true);
                setError(null);
                
                const apiKey = import.meta.env.VITE_API_KEY;
                if (!apiKey) {
                    throw new Error('API key is missing');
                }
                
                const url = `https://newsapi.org/v2/top-headlines?country=us&pageSize=50&category=${category}&apiKey=${apiKey}`;
                const response = await fetch(url, {
                    headers: {
                        'User-Agent': 'NewsMag/1.0'
                    }
                });
                
                if (!response.ok) {
                    if (response.status === 426) {
                        throw new Error('NewsAPI requires an upgrade for production use. Please upgrade your API plan or use localhost for development.');
                    } else if (response.status === 401) {
                        throw new Error('Invalid API key. Please check your VITE_API_KEY environment variable.');
                    } else if (response.status === 429) {
                        throw new Error('API rate limit exceeded. Please try again later.');
                    } else {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                }
                
                const data = await response.json();
                
                if (data.status === 'error') {
                    throw new Error(data.message || 'API returned an error');
                }
                
                setArticles(data.articles || []);
            } catch (err) {
                console.error('Error fetching news:', err);
                setError(err.message);
                setArticles([]);
            } finally {
                setLoading(false);
            }
        };
        
        fetchNews();
    }, [category]);
    
    if (loading) {
        return (
            <div className="text-center">
                <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }
    
    if (error) {
        return (
            <div className="alert alert-danger text-center" role="alert">
                <h4>Error loading news</h4>
                <p>{error}</p>
                <p>Please check your API key and try again.</p>
            </div>
        );
    }

    return (
        <div>
            <h2 className="text-center">Latest <span className="badge bg-danger">News</span></h2>
            
            {articles && articles.length > 0 ? (
                articles.map((news, index) => {
                    return <NewsItem 
                        key={index} 
                        title={news.title} 
                        description={news.description} 
                        src={news.urlToImage} 
                        url={news.url}
                    />
                })
            ) : (
                <div className="text-center">
                    <p>No news articles available at the moment.</p>
                </div>
            )}
        </div>
    );
}

export default NewsBoard

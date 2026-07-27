import { Link, useParams, useNavigate } from '@/lib/router-compat';
import Icon from '../components/Icon';
import { getArticleById } from '../data/news';
import './News.css';
import './NewsArticle.css';

export default function NewsArticle() {
  const { articleId } = useParams();
  const navigate = useNavigate();
  const article = getArticleById(articleId);

  if (!article) {
    return (
      <div className="screen news-screen">
        <button className="article-back" onClick={() => navigate('/news')}>
          <Icon name="arrow-left" size={18} stroke={2.2} /> Back
        </button>
        <p style={{ marginTop: 24 }}>Article not found.</p>
      </div>
    );
  }

  const isUp = article.move > 0;
  const isDown = article.move < 0;
  const moveLabel = article.move === 0
    ? '0.00%'
    : `${article.move > 0 ? '+' : ''}${article.move.toFixed(2)}%`;

  return (
    <div className="screen news-screen article-screen">
      <Link to="/news" className="article-back">
        <Icon name="arrow-left" size={18} stroke={2.2} /> News
      </Link>

      <div className="article-meta">
        <span className="news-card-source">{article.source}</span>
        <span className="news-card-dot" aria-hidden="true" />
        <span className="news-card-time">{article.time}</span>
      </div>

      <h1 className="article-title">{article.title}</h1>

      <div className="article-tagrow">
        <span className="news-card-tag">{article.tag}</span>
        <span
          className={
            'news-card-move' +
            (isUp ? ' news-card-move--up' : '') +
            (isDown ? ' news-card-move--down' : '')
          }
        >
          {isUp && <Icon name="arrow-up-right" size={14} stroke={2.2} />}
          {isDown && <Icon name="arrow-down-right" size={14} stroke={2.2} />}
          {moveLabel}
        </span>
      </div>

      <p className="article-lead">{article.summary}</p>

      <div className="article-body">
        {article.body.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>

      <div className="article-disclaimer">
        Simulated content for educational purposes — not financial advice.
      </div>
    </div>
  );
}
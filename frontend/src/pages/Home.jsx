import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="page">
      <div className="card home-hero">
        <h1 className="page-title">College Smart Lost & Found</h1>

        <p className="page-subtitle">
          Find what you lost. Return what you found.
        </p>

        <p>
          A smart platform that helps students report lost items,
          report found items, discover possible matches, and connect securely.
        </p>

        <div className="home-actions">
          <Link to="/report-lost" className="action-card">
            <div className="action-icon">🔍</div>
            <h2>Report Lost</h2>
            <p>Tell us about an item you have lost.</p>
          </Link>

          <Link to="/report-found" className="action-card">
            <div className="action-icon">📦</div>
            <h2>Report Found</h2>
            <p>Help someone recover their lost item.</p>
          </Link>

          <Link to="/matches" className="action-card">
            <div className="action-icon">🤝</div>
            <h2>Find Matches</h2>
            <p>Check possible matches for your item.</p>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Home;
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Matches() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:5000/api/matches")
      .then((response) => response.json())
      .then((data) => {
        setMatches(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching matches:", error);
        setLoading(false);
      });
  }, []);

  return (
    <div className="page">
      <div className="card">
        <h1 className="page-title">Possible Matches</h1>

        <p className="page-subtitle">
          Items that may match your lost or found report.
        </p>

        {loading && <p>Loading matches...</p>}

        {!loading && matches.length === 0 && (
          <p>No possible matches found yet.</p>
        )}

        {matches.map((match) => (
          <div className="match-card" key={match._id}>
            <div className="match-image">
              🔍
            </div>

            <div className="match-details">
              <h2>
                {match.lostItem?.itemName || "Unknown Item"}
              </h2>

              <p>
                Brand: {match.lostItem?.brand || "Not specified"}
              </p>

              <p>
                Lost at: {match.lostItem?.lostLocation || "Not specified"}
              </p>

              <p>
                Found at: {match.foundItem?.foundLocation || "Not specified"}
              </p>

              <p>
                Match Score: {match.matchScore}%
              </p>

              <p className="match-status">
                {match.status}
              </p>

              <button
                className="primary-btn"
                onClick={() =>
                  navigate(`/verification?matchId=${match._id}`)
                }
              >
                View Match
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Matches;
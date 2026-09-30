import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

function Verification() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const matchId = searchParams.get("matchId");

  const [match, setMatch] = useState(null);
  const [details, setDetails] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!matchId) {
      setLoading(false);
      return;
    }

    fetch("http://localhost:5000/api/matches")
      .then((response) => response.json())
      .then((data) => {
        const selectedMatch = data.find(
          (item) => item._id === matchId
        );

        setMatch(selectedMatch);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching match:", error);
        setLoading(false);
      });
  }, [matchId]);

  const handleConfirm = async () => {
    if (!details.trim()) {
      alert("Please describe a unique identifying detail.");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/matches/${matchId}/verify`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            verifiedBy: "6abbe4bdecc2bf48533b90f9"
          })
        }
      );

      const data = await response.json();

      if (response.ok) {
        setMessage("Ownership verified successfully!");
        console.log("Verified match:", data);
      } else {
        alert(data.message || "Verification failed");
      }
    } catch (error) {
      console.error(error);
      alert("Server connection error");
    }
  };

  const handleReject = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/matches/${matchId}/reject`,
        {
          method: "PUT"
        }
      );

      const data = await response.json();

      if (response.ok) {
        setMessage("Match rejected.");
        console.log("Rejected match:", data);
      } else {
        alert(data.message || "Could not reject match");
      }
    } catch (error) {
      console.error(error);
      alert("Server connection error");
    }
  };

  if (loading) {
    return (
      <div className="page">
        <div className="card">
          <h1 className="page-title">Loading Match...</h1>
        </div>
      </div>
    );
  }

  if (!match) {
    return (
      <div className="page">
        <div className="card">
          <h1 className="page-title">Match Not Found</h1>
          <p className="page-subtitle">
            The selected match could not be found.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="card">
        <h1 className="page-title">Verify Item Ownership</h1>

        <p className="page-subtitle">
          Confirm that the matched item belongs to you.
        </p>

        <div className="verification-item">
          <div className="verification-icon">🔍</div>

          <div>
            <h2>{match.lostItem?.itemName}</h2>

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
          </div>
        </div>

        <div className="form-group">
          <label>Describe a unique identifying detail</label>

          <textarea
            rows="4"
            placeholder="Mention a detail that only the owner would know..."
            value={details}
            onChange={(event) => setDetails(event.target.value)}
          ></textarea>
        </div>

        <div className="verification-actions">
          <button
            className="primary-btn"
            onClick={handleConfirm}
          >
            Confirm Ownership
          </button>

          <button
            className="secondary-btn"
            onClick={handleReject}
          >
            Not My Item
          </button>
        </div>

        {message && (
          <p className="success-message">
            {message}
          </p>
        )}

        {message === "Ownership verified successfully!" && (
          <button
            className="primary-btn"
           onClick={() => navigate(`/chat?matchId=${matchId}`)}
          >
            Continue to Chat
          </button>
        )}
      </div>
    </div>
  );
}

export default Verification;
import { useEffect, useState } from "react";

function MyReports() {
  const [lostItems, setLostItems] = useState([]);
  const [foundItems, setFoundItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
      setLoading(false);
      return;
    }

    const currentUserId = user.id;

    const fetchReports = async () => {
      try {
        const [lostResponse, foundResponse] = await Promise.all([
          fetch("http://localhost:5000/api/lost-items"),
          fetch("http://localhost:5000/api/found-items")
        ]);

        const lostData = await lostResponse.json();
        const foundData = await foundResponse.json();

        const myLostItems = lostData.filter(
          (item) =>
            item.reportedBy?._id === currentUserId ||
            item.reportedBy === currentUserId
        );

        const myFoundItems = foundData.filter(
          (item) =>
            item.reportedBy?._id === currentUserId ||
            item.reportedBy === currentUserId
        );

        setLostItems(myLostItems);
        setFoundItems(myFoundItems);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching reports:", error);
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  const formatDate = (date) => {
    if (!date) return "Not specified";

    return new Date(date).toLocaleDateString();
  };

  const getStatusText = (status) => {
    if (status === "searching") return "Searching";
    if (status === "matched") return "Possible Match";
    if (status === "returned") return "Returned";
    if (status === "closed") return "Closed";
    if (status === "available") return "Available";

    return status;
  };

  return (
    <div className="page">
      <div className="card">
        <h1 className="page-title">My Reports</h1>

        <p className="page-subtitle">
          Track the lost and found items you have reported.
        </p>

        {loading && <p>Loading your reports...</p>}

        {!loading &&
          lostItems.length === 0 &&
          foundItems.length === 0 && (
            <p>You have not reported any items yet.</p>
          )}

        {!loading && lostItems.length > 0 && (
          <>
            <h2>My Lost Items</h2>

            {lostItems.map((item) => (
              <div className="report-card" key={item._id}>
                <div className="report-icon">🔍</div>

                <div className="report-details">
                  <h2>{item.itemName}</h2>

                  <p>Type: Lost Item</p>

                  <p>
                    Location: {item.lostLocation}
                  </p>

                  <p>
                    Date: {formatDate(item.lostDate)}
                  </p>

                  <span className="status-badge">
                    {getStatusText(item.status)}
                  </span>
                </div>
              </div>
            ))}
          </>
        )}

        {!loading && foundItems.length > 0 && (
          <>
            <h2>My Found Items</h2>

            {foundItems.map((item) => (
              <div className="report-card" key={item._id}>
                <div className="report-icon">📦</div>

                <div className="report-details">
                  <h2>{item.itemName}</h2>

                  <p>Type: Found Item</p>

                  <p>
                    Location: {item.foundLocation}
                  </p>

                  <p>
                    Date: {formatDate(item.foundDate)}
                  </p>

                  <span className="status-badge">
                    {getStatusText(item.status)}
                  </span>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}

export default MyReports;
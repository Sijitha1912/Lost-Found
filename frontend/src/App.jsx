import { BrowserRouter, Routes, Route, Link, useNavigate } from "react-router-dom";
import "./App.css";

import Home from "./pages/Home";
import ReportLost from "./pages/ReportLost";
import ReportFound from "./pages/ReportFound";
import Matches from "./pages/Matches";
import Verification from "./pages/Verification";
import Chat from "./pages/Chat";
import MyReports from "./pages/MyReports";
import SignIn from "./SignIn";
import SignUp from "./SignUp";

function Navigation() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const handleSignOut = () => {
    localStorage.removeItem("user");
    alert("Signed out successfully!");
    navigate("/signin");
  };

  return (
    <nav className="navbar">
      <div className="logo">🎒 Lost & Found</div>

      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/report-lost">Report Lost</Link>
        <Link to="/report-found">Report Found</Link>
        <Link to="/matches">Matches</Link>
        <Link to="/chat">Chat</Link>
        <Link to="/my-reports">My Reports</Link>

        {user ? (
          <button
            className="nav-signout-btn"
            onClick={handleSignOut}
          >
            Sign Out
          </button>
        ) : (
          <Link to="/signin">Sign In</Link>
        )}
      </div>
    </nav>
  );
}

function App() {
  return (
    <BrowserRouter>
      <div className="app">

        <Navigation />

        <Routes>
          <Route path="/" element={<Home />} />

          <Route path="/signin" element={<SignIn />} />

          <Route path="/signup" element={<SignUp />} />

          <Route path="/report-lost" element={<ReportLost />} />

          <Route path="/report-found" element={<ReportFound />} />

          <Route path="/matches" element={<Matches />} />

          <Route path="/verification" element={<Verification />} />

          <Route path="/chat" element={<Chat />} />

          <Route path="/my-reports" element={<MyReports />} />
        </Routes>

      </div>
    </BrowserRouter>
  );
}

export default App;
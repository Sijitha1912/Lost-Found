import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleSignIn = async (e) => {
    e.preventDefault();

    console.log("Sign In button clicked");

    try {
      const response = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email,
          password
        })
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("user", JSON.stringify(data.user));

        alert("Sign in successful!");
        navigate("/");
      } else {
        alert(data.message || "Invalid email or password");
      }
    } catch (error) {
      console.error(error);
      alert("Server connection error");
    }
  };

  return (
    <div className="signin-page">
      <div className="signin-card">

        <div className="signin-icon">🎒</div>

        <h1>College Lost & Found</h1>

        <p className="signin-welcome">
          Welcome back! Sign in to manage your lost and found items.
        </p>

        <form onSubmit={handleSignIn}>

          <div className="signin-field">
            <label>College Email</label>

            <input
              type="email"
              placeholder="yourname@kiot.ac.in"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="signin-field">
            <label>Password</label>

            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            className="signin-button"
            type="submit"
          >
            Sign In
          </button>

        </form>

        <div className="signin-divider">
          <span>New to Lost & Found?</span>
        </div>

        <Link to="/signup" className="signup-link">
          Create Student Account
        </Link>

        <p className="college-note">
          🔒 For KIOT students only
        </p>

      </div>
    </div>
  );
}

export default SignIn;
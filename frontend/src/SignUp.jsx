import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();

    if (!email.toLowerCase().endsWith("@kiot.ac.in")) {
      alert("Please use your KIOT college email address.");
      return;
    }

    if (password.length < 6) {
      alert("Password must contain at least 6 characters.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name,
          email,
          password,
          role: "student"
        })
      });

      const data = await response.json();

      if (response.ok) {
        alert("Account created successfully! Please sign in.");
        navigate("/signin");
      } else {
        alert(data.message || "Could not create account");
      }
    } catch (error) {
      console.error(error);
      alert("Server connection error");
    }
  };

  return (
    <div className="signin-page">
      <div className="signin-card">

        <div className="signin-icon">🎓</div>

        <h1>Create Account</h1>

        <p className="signin-welcome">
          Create your KIOT student account to use Lost & Found.
        </p>

        <form onSubmit={handleSignUp}>

          <div className="signin-field">
            <label>Student Name</label>

            <input
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="signin-field">
            <label>KIOT Email</label>

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
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button className="signin-button" type="submit">
            Create Account
          </button>

        </form>

        <div className="signin-divider">
          <span>Already registered?</span>
        </div>

        <Link to="/signin" className="signup-link">
          Back to Sign In
        </Link>

        <p className="college-note">
          🔒 KIOT students only
        </p>

      </div>
    </div>
  );
}

export default SignUp;
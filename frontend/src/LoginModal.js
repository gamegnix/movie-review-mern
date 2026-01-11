import React, { useState } from "react";
import axios from "axios";
import "./App.css";

const API_URL = "http://localhost:5000/api";

function LoginModal({ onClose, onLoginSuccess }) {
  const [isSignup, setIsSignup] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  const handleLogin = async (e) => {
    e?.preventDefault();
    
    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }

    try {
      setLoading(true);
      setError("");
      const res = await axios.post(`${API_URL}/auth/login`, {
        email,
        password,
      });

      if (res.data.token && res.data.user) {
        localStorage.setItem("user", JSON.stringify(res.data.user));
        localStorage.setItem("token", res.data.token);
        onLoginSuccess();
        onClose();
      } else {
        setError("Invalid response from server");
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Invalid email or password";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e?.preventDefault();
    
    if (!name || !email || !password) {
      setError("Please fill in all fields");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccess("");
      const res = await axios.post(`${API_URL}/auth/register`, {
        name,
        email,
        password,
      });

      if (res.data.token && res.data.user) {
        setSuccess("Account created successfully! You are now logged in.");
        localStorage.setItem("user", JSON.stringify(res.data.user));
        localStorage.setItem("token", res.data.token);
        setTimeout(() => {
          onLoginSuccess();
          onClose();
        }, 1000);
      } else {
        setSuccess("Account created successfully! Please login.");
        setTimeout(() => {
          setIsSignup(false);
          setEmail("");
          setPassword("");
        }, 1500);
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Failed to create account";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      if (isSignup) {
        handleSignup();
      } else {
        handleLogin();
      }
    }
  };

  const switchMode = () => {
    setIsSignup(!isSignup);
    setError("");
    setSuccess("");
    setEmail("");
    setPassword("");
    setName("");
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <h2>{isSignup ? "Sign Up" : "Login"}</h2>

        {error && <p className="error">{error}</p>}
        {success && <p className="success">{success}</p>}

        <form onSubmit={isSignup ? handleSignup : handleLogin}>
          {isSignup && (
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={loading}
              required
            />
          )}

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={loading}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={loading}
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? (isSignup ? "Creating account..." : "Logging in...") : (isSignup ? "Sign Up" : "Login")}
          </button>
        </form>

        <div className="modal-switch">
          <p>
            {isSignup ? "Already have an account? " : "Don't have an account? "}
            <button type="button" className="switch-button" onClick={switchMode} disabled={loading}>
              {isSignup ? "Login" : "Sign Up"}
            </button>
          </p>
        </div>
        
        <button className="close-btn" onClick={onClose} disabled={loading}>
          Cancel
        </button>
      </div>
    </div>
  );
}

export default LoginModal;

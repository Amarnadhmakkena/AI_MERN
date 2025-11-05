import React, { useState } from "react";
import axios from "axios";

export default function JobPortal() {

  // ✅ Put your backend URL here (TEMP)
  const API = "https://ai-mern-kl3y.vercel.app/";

  const [view, setView] = useState("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [matchedJobs, setMatchedJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const signup = async () => {
    setErrorMessage("");
    try {
      const res = await axios.post(`${API}/auth/signup`, { username, password });
      alert("Signup successful! Please login.");
      setView("login");
    } catch (err) {
      setErrorMessage("Username already exists.");
    }
  };

  const login = async () => {
    setErrorMessage("");
    try {
      const res = await axios.post(`${API}/auth/login`, { username, password });
      localStorage.setItem("token", res.data.token);
      setToken(res.data.token);
      setView("scanner");
    } catch (err) {
      setErrorMessage("Invalid username or password.");
    }
  };

  const uploadResume = async (e) => {
    const file = e.target.files[0];
    const form = new FormData();
    form.append("resume", file);

    setLoading(true);
    setErrorMessage("");

    try {
      const res = await axios.post(`${API}/resume/upload`, form, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setMatchedJobs(res.data.matchedJobs);
    } catch (err) {
      setErrorMessage("Resume upload failed.");
    }
    setLoading(false);
  };

  return (
    <div className="container">
      {view === "login" && (
        <>
          <h1>Job Portal</h1>
          <input placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <button onClick={login} disabled={loading}>{loading ? "Logging in..." : "Login"}</button>
          {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
          <p className="toggle" onClick={() => setView("signup")}>Don't have an account? Sign Up</p>
        </>
      )}

      {view === "signup" && (
        <>
          <h1>Create Account</h1>
          <input placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <button onClick={signup} disabled={loading}>{loading ? "Signing up..." : "Sign Up"}</button>
          {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
          <p className="toggle" onClick={() => setView("login")}>Already have an account? Login</p>
        </>
      )}

      {view === "scanner" && (
        <>
          <h2>Upload Resume</h2>
          <input type="file" onChange={uploadResume} />
          {loading && <p>Scanning your resume...</p>}
          <h2>Matched Jobs</h2>
          <ul className="jobs-list">
            {matchedJobs.map((job, index) => (
              <li key={index}>{job.title}</li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

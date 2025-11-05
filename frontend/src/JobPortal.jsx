import React, { useState, useEffect } from "react";

export default function JobPortal() {

  // ✅ Load users from localStorage OR use default first account
  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem("users");
    return saved ? JSON.parse(saved) : [{ username: "user", password: "123" }];
  });

  const [view, setView] = useState("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [matchedJobs, setMatchedJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // ✅ Save users list whenever it changes
  useEffect(() => {
    localStorage.setItem("users", JSON.stringify(users));
  }, [users]);

  const signup = () => {
    setErrorMessage("");

    if (users.find((u) => u.username === username)) {
      setErrorMessage("Username already exists.");
      return;
    }

    const newUser = { username, password };
    setUsers([...users, newUser]);
    alert("Signup successful! Please login.");
    setView("login");
  };

  const login = () => {
    setErrorMessage("");
    const user = users.find((u) => u.username === username && u.password === password);

    if (!user) {
      setErrorMessage("Invalid username or password.");
      return;
    }

    const fakeToken = "local-auth-token";
    localStorage.setItem("token", fakeToken);
    setToken(fakeToken);
    setView("scanner");
  };

  const uploadResume = (e) => {
    setLoading(true);
    setErrorMessage("");

    setTimeout(() => {
      // ✅ Static Job Matching Example
      setMatchedJobs([
        { title: "Software Engineer" },
        { title: "Frontend Developer" },
        { title: "Backend Developer" }
      ]);
      setLoading(false);
    }, 800);
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

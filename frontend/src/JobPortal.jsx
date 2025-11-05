
import React, { useState } from 'react'
import axios from 'axios'

export default function JobPortal() {
  const [view, setView] = useState('login')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [token, setToken] = useState(localStorage.getItem('token') || '')
  const [matchedJobs, setMatchedJobs] = useState([])

  const signup = async () => {
    await axios.post('http://localhost:5000/auth/signup', { username, password })
    alert('Account created! Please login.')
    setView('login')
  }

  const login = async () => {
    const res = await axios.post('http://localhost:5000/auth/login', { username, password })
    localStorage.setItem('token', res.data.token)
    setToken(res.data.token)
    setView('scanner')
  }

  const uploadResume = async (e) => {
    const file = e.target.files[0]
    const form = new FormData()
    form.append('resume', file)
    const res = await axios.post('http://localhost:5000/resume/upload', form, {
      headers: { Authorization: `Bearer ${token}` }
    })
    setMatchedJobs(res.data.matchedJobs)
  }

  return (
    <div className="container">
      {view === 'login' && (
        <>
          <h1>Job Portal</h1>
          <input placeholder="Username" onChange={e=>setUsername(e.target.value)} />
          <input type="password" placeholder="Password" onChange={e=>setPassword(e.target.value)} />
          <button onClick={login}>Login</button>
          <p className="toggle" onClick={()=>setView('signup')}>Don't have an account? Sign Up</p>
        </>
      )}

      {view === 'signup' && (
        <>
          <h1>Create Account</h1>
          <input placeholder="Username" onChange={e=>setUsername(e.target.value)} />
          <input type="password" placeholder="Password" onChange={e=>setPassword(e.target.value)} />
          <button onClick={signup}>Sign Up</button>
          <p className="toggle" onClick={()=>setView('login')}>Already have an account? Login</p>
        </>
      )}

      {view === 'scanner' && (
        <>
          <h2>Upload Resume</h2>
          <input type="file" onChange={uploadResume} />
          <h2>Matched Jobs</h2>
          <ul className="jobs-list">
            {matchedJobs.map((job,i)=>(
              <li key={i}>
                {job.title}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  )
}

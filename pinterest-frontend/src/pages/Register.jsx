import { useState } from "react";

import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";

function Register() {
  const [form, setForm] = useState({ username: "", email: "", fullname: "", password: "" });
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  
  const navigate = useNavigate();

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

async function handleSubmit(e) {
  e.preventDefault();
  setError("");
  setMessage("");
  try {
    const res = await api.post("/register", form);
    setMessage(res.data.message || "Check your email to verify your account");
  } catch (err) {
    setError(err.response?.data?.error || "Something went wrong");
  }
}

  return (
    <div className="page auth-wrap">
      <div className="auth-card">
        <p className="auth-eyebrow">Get started</p>
        <h2>Create your account</h2>
        <p className="auth-sub">Save the ideas you don't want to lose.</p>

         {error && <p className="error-text">{error}</p>}
        {message && <p className="auth-sub" style={{ color: "var(--accent)" }}>{message}</p>}  {/* ← ye naya line */}


        <form onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="email">Email</label>
            <input id="email" className="input" name="email" placeholder="you@example.com" onChange={handleChange} />
          </div>
          <div className="field">
            <label htmlFor="username">Username</label>
            <input id="username" className="input" name="username" placeholder="Pick a username" onChange={handleChange} />
          </div>
          <div className="field">
            <label htmlFor="fullname">Full name</label>
            <input id="fullname" className="input" name="fullname" placeholder="Your name" onChange={handleChange} />
          </div>
          <div className="field">
            <label htmlFor="password">Password</label>
            <input id="password" className="input" name="password" type="password" placeholder="••••••••" onChange={handleChange} />
          </div>
          <button type="submit" className="btn btn-primary btn-block">Create account</button>
        </form>

        <p className="auth-switch">
          Already on Pinboard? <Link to="/login">Log in</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;

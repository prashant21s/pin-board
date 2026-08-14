import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";

function Login() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      await api.post("/login", form);
      navigate("/profile");
    } catch (err) {
      setError(err.response?.data?.error || "Login failed");
    }
  }

  return (
    <div className="page auth-wrap">
      <div className="auth-card">
        <p className="auth-eyebrow">Welcome back</p>
        <h2>Log in</h2>
        <p className="auth-sub">Pick up right where you left off.</p>

        {error && <p className="error-text">{error}</p>}

        <form onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="username">Username</label>
            <input id="username" className="input" name="username" placeholder="Your username" onChange={handleChange} />
          </div>
          <div className="field">
            <label htmlFor="password">Password</label>
            <input id="password" className="input" name="password" type="password" placeholder="••••••••" onChange={handleChange} />
          </div>
          <button type="submit" className="btn btn-primary btn-block">Log in</button>
        </form>

        <p className="auth-switch">
          New here? <Link to="/">Create an account</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;

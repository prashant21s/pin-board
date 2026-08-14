import { Routes, Route, Link } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Feed from "./pages/Feed";
import Profile from "./pages/Profile";
import Verify from "./pages/Verify";

function App() {
  return (
    <div className="app-shell">
      <header className="navbar">
        <div className="navbar-inner">
          <Link to="/feed" className="brand">
            <span className="brand-mark">
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M12 2a1 1 0 011 1v6.382l4.447 2.223a1 1 0 01-.894 1.79L13 11.618V21a1 1 0 01-2 0v-9.382l-3.553 1.777a1 1 0 01-.894-1.79L11 9.382V3a1 1 0 011-1z"
                  fill="#1a0a0f"
                />
              </svg>
            </span>
            Pinboard
          </Link>
          <nav className="nav-links">
            <Link to="/feed">Feed</Link>
            <Link to="/profile">Profile</Link>
            <Link to="/login">Login</Link>
            <Link to="/">Register</Link>
          </nav>
        </div>
      </header>

      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/feed" element={<Feed />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/verify/:token" element={<Verify />} />
      </Routes>
    </div>
  );
}

export default App;

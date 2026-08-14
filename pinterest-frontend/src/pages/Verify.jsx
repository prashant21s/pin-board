
import { useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api/axios";

function Verify() {
  const { token } = useParams();
  const [status, setStatus] = useState("loading"); // loading | success | error
  const [message, setMessage] = useState("");
  const hasVerified = useRef(false);
  useEffect(() => {
    if (hasVerified.current) return;   // ← agar pehle chal chuka hai, dubara mat chala
    hasVerified.current = true;    
    async function verify() {
      try {
        const res = await api.get(`/verify/${token}`);
        setMessage(res.data.message);
        setStatus("success");
      } catch (err) {
        setMessage(err.response?.data?.error || "Verification failed");
        setStatus("error");
      }
    }
    verify();
  }, [token]);

  return (
    <div className="page auth-wrap">
      <div className="auth-card" style={{ textAlign: "center" }}>
        {status === "loading" && (
          <>
            <p className="auth-eyebrow">Please wait</p>
            <h2>Verifying your email…</h2>
          </>
        )}

        {status === "success" && (
          <>
            <p className="auth-eyebrow">All set</p>
            <h2>Email verified!</h2>
            <p className="auth-sub">{message}</p>
            <Link to="/login" className="btn btn-primary btn-block" style={{ marginTop: "16px" }}>
              Go to Login
            </Link>
          </>
        )}

        {status === "error" && (
          <>
            <p className="auth-eyebrow" style={{ color: "#ff8fa8" }}>Something's wrong</p>
            <h2>Verification failed</h2>
            <p className="error-text" style={{ marginTop: "12px" }}>{message}</p>
          </>
        )}
      </div>
    </div>
  );
}

export default Verify;
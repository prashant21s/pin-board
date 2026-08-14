import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

function Profile() {
  const [user, setUser] = useState(null);
  const [caption, setCaption] = useState("");
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function fetchProfile() {
    try {
      const res = await api.get("/profile");
      setUser(res.data.user);
    } catch (err) {
      navigate("/login"); // not logged in toh login pe bhej do
    }
  }

  useEffect(() => {
    fetchProfile();
  }, []);

  async function handleUpload(e) {
    e.preventDefault();
    setError("");
    if (!file) {
      setError("Please select an image");
      return;
    }
    const formData = new FormData();
    formData.append("filecaption", caption);
    formData.append("file", file);

    try {
      await api.post("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      setCaption("");
      setFile(null);
      fetchProfile(); // upload ke baad list refresh karo
    } catch (err) {
      setError(err.response?.data?.error || "Upload failed");
    }
  }

  async function handleDelete(postId) {
    if (!window.confirm("Delete this pin?")) return;
    try {
      await api.delete(`/posts/${postId}`);
      fetchProfile(); // refresh list
    } catch (err) {
      setError("Could not delete post");
    }
  }

  async function handleLogout() {
    await api.get("/logout");
    navigate("/login");
  }

  if (!user) return <p className="state-msg">Loading profile…</p>;

  const initial = user.fullname ? user.fullname.charAt(0).toUpperCase() : "?";

  return (
    <div className="page">
      <div className="profile-header">
        <div className="avatar">{initial}</div>
        <div className="profile-info">
          <h2>{user.fullname}</h2>
          <p>@{user.username}</p>
        </div>
        <button className="btn btn-ghost" onClick={handleLogout}>Logout</button>
      </div>

      <div className="upload-card">
        <h3>Upload a new pin</h3>
        {error && <p className="error-text">{error}</p>}
        <form onSubmit={handleUpload}>
          <div className="upload-row">
            <div className="field">
              <input
                className="input"
                type="text"
                placeholder="Write a caption"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
              />
            </div>
            <input
              className="file-input"
              type="file"
              onChange={(e) => setFile(e.target.files[0])}
            />
            <button type="submit" className="btn btn-primary">Upload</button>
          </div>
        </form>
      </div>

      {user.posts.length === 0 ? (
        <div className="state-msg">
          <strong>No pins yet</strong>
          Whatever you upload above will show up here.
        </div>
      ) : (
        <div className="masonry">
          {user.posts.map((post) => (
            <div key={post._id} className="pin-card">
              <div className="pin-media">
                <img
                  src={post.image}
                  alt={post.imageText}
                />
                <button className="pin-delete" onClick={() => handleDelete(post._id)}>
                  Delete
                </button>
              </div>
              <div className="pin-body">
                {post.imageText && <p className="pin-caption">{post.imageText}</p>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Profile;

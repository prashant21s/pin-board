import { useState, useEffect } from "react";
import api from "../api/axios";

function Feed() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function fetchPosts() {
    try {
      const res = await api.get("/feed");
      setPosts(res.data.posts);
    } catch (err) {
      setError("Could not load feed");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchPosts();
  }, []);

  async function handleLike(postId) {
    try {
      await api.post(`/posts/${postId}/like`);
      fetchPosts(); // refresh to show updated like count
    } catch (err) {
      alert("Please login to like posts");
    }
  }

  return (
    <div className="page">
      <div className="section-head">
        <p className="auth-eyebrow">Discover</p>
        <h1>Your feed</h1>
      </div>

      {loading && <p className="state-msg">Loading pins…</p>}
      {!loading && error && <p className="state-msg">{error}</p>}
      {!loading && !error && posts.length === 0 && (
        <div className="state-msg">
          <strong>No pins yet</strong>
          Upload something from your profile to get the feed started.
        </div>
      )}

      {!loading && !error && posts.length > 0 && (
        <div className="masonry">
          {posts.map((post) => (
            <div key={post._id} className="pin-card">
              <div className="pin-media">
                <img
                  src={post.image}
                  alt={post.imageText}
                />
                <span className="pin-tack">
                  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2a1 1 0 011 1v6.382l4.447 2.223a1 1 0 01-.894 1.79L13 11.618V21a1 1 0 01-2 0v-9.382l-3.553 1.777a1 1 0 01-.894-1.79L11 9.382V3a1 1 0 011-1z" />
                  </svg>
                </span>
              </div>
              <div className="pin-body">
                {post.imageText && <p className="pin-caption">{post.imageText}</p>}
                <div className="pin-meta">
                  <span className="pin-author">@{post.user?.username}</span>
                  <button className="like-btn" onClick={() => handleLike(post._id)}>
                    ❤ {post.likes.length}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Feed;

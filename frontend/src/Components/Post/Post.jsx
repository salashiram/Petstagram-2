import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Post.css";

const Post = ({ user_id, username, imageSrc, caption, initialLikes }) => {
  const [likes, setLikes] = useState(
    Number.isInteger(initialLikes) ? initialLikes : 0
  );
  const [showHeart, setShowHeart] = useState(false);

  const handleLike = () => {
    setLikes((prevLikes) => prevLikes + 1);
    setShowHeart(true);
    setTimeout(() => {
      setShowHeart(false);
    }, 700);
  };

  return (
    <div className="post">
      <div className="user-info">
        <img src="https://via.placeholder.com/50" alt="Avatar" />
        <Link to={`/UserProfile2/${user_id}`} className="username">
          {username}
        </Link>
        {/* <a href="/UserProfile2" className="username">
          {username}
        </a> */}
        {/* <span className="username">{username}</span> */}
      </div>
      <div className="img-container" onClick={handleLike}>
        <img className="post-img" src={imageSrc} alt="Imagen de mascota" />
        {showHeart && (
          <div className={`heart-overlay ${showHeart ? "show-heart" : ""}`}>
            ❤️
          </div>
        )}
      </div>
      <div className="post-info">
        <span>❤️ {likes}</span>
        <span className="caption">{caption}</span>
      </div>
    </div>
  );
};

export default Post;

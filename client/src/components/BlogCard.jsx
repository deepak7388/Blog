import React from "react";
import "../styles/BlogCard.css"; // Import the CSS file for styling
import { format } from "date-fns";
import { Link } from "react-router-dom";
const BlogCard = ({
  _id,
  cover,
  title,
  createdAt,
  author,
  summary,
  description,
}) => {
  const truncateSummary = (text, maxWords) => {
    const words = text.split(" ");
    if (words.length > maxWords) {
      return words.slice(0, maxWords).join(" ") + "...";
    }
    return text;
  };

  const truncatedSummary = truncateSummary(summary, 50);

  return (
    <div className="blog-card">
      <Link to={`/blog/${_id}`}>
        <div className="image">
          <img src={"http://localhost:4000/" + cover} alt="Blog" />
        </div>
      </Link>
      <div className="content">
        <Link to={`/blog/${_id}`}>
          <h2 className="heading">{title}</h2>
        </Link>
        <div className="meta">
          <p className="author">By {author.username}</p>
          <p className="date">
            {format(new Date(createdAt), "dd-MM-yyyy, hh:mm a")}
          </p>
        </div>
        <p className="summary">{truncatedSummary}</p>
      </div>
    </div>
  );
};

export default BlogCard;

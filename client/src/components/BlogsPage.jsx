import React, { useEffect, useState } from "react";
import BlogCard from "./BlogCard";

const BlogsPage = () => {
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    fetch("http://localhost:4000/blog/getBlogs").then((response) => {
      console.log("PostResp: ", posts);
      response.json().then((posts) => {
        console.log("Posts: ", posts);
        setPosts(posts);
      });
    });
  }, []);

  //sample data
  // const blogData = {
  //     image: "https://plus.unsplash.com/premium_photo-1668196793119-f8fa2ee0d90a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1642&q=80",
  //     heading: 'Blog Title',
  //     date: 'June 30, 2023',
  //     author: 'John Doe',
  //     summary: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla condimentum quam nec turpis tristique, id iaculis mi commodo.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla condimentum quam nec turpis tristique, id iaculis mi commodo.Lorem ipsum dolor sit amet, consectetur adipiscing elit.'
  //   };
  return (
    <div>
      {posts.length > 0 &&
        posts.map((post) => (
          //<BlogCard {...post}/>
          <BlogCard key={post._id} {...post} />
        ))}
    </div>
  );
};

export default BlogsPage;

import React, { useEffect, useContext, useState } from "react";
import "../styles/Header.css"; // Import the CSS file for styling
import { Link, Navigate } from "react-router-dom";
import { UserContext } from "../UserContext";

const Header = () => {
  const { userInfo, setUserInfo } = useContext(UserContext);
  const [redirect, setRedirect] = useState(false);
  useEffect(() => {
    fetch("https://blog-backend-s667.onrender.com/user/profile", {
      credentials: "include",
    }).then((response) => {
      if (response.status === 401) {
        console.log("status 401");
        return <Navigate to={"/"} />;
      }
      response.json().then((uinfo) => {
        if (!userInfo) setUserInfo(uinfo);
        console.log("ui: ", uinfo);
      });
    });
    console.log("uinfoheader", userInfo);
  }, [userInfo]);

  function logout() {
    fetch("https://blog-backend-s667.onrender.com/logout", {
      credentials: "include",
      method: "POST",
    });
    setUserInfo(null);
  }
  console.log("user:", userInfo, userInfo == null);
  return (
    <header className="header">
      <Link to="/" className="logo">
        BlogGhar
      </Link>
      <div className="nav">
        {userInfo && (
          <>
            <Link to="/create" className="nav-link">
              Create new post
            </Link>
            <Link onClick={logout} className="nav-link">
              Logout ({userInfo.username})
            </Link>
          </>
        )}
        {!userInfo && (
          <>
            <Link to="/login" className="nav-link">
              Login
            </Link>
            <Link to="/register" className="nav-link">
              Register
            </Link>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;

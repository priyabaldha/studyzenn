import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  const [showSearch, setShowSearch] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  if (!token || !user) return null; //hide 

  return (
    <>
      {/* ================ Start Header Area ================= */}
      <header className="default-header">
        <nav className="navbar navbar-expand-lg navbar-light">
          <div className="container">
            <Link className="navbar-brand" to="/">
              <img src="/img/logo.png" alt="Logo" />
            </Link>

            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarSupportedContent"
              aria-controls="navbarSupportedContent"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="lnr lnr-menu"></span>
            </button>

            <div
              className="collapse navbar-collapse justify-content-end align-items-center"
              id="navbarSupportedContent"
            >
              <ul className="navbar-nav">
                

                {/* Welcome + Logout */}
                <li className="nav-item d-flex align-items-center ms-3">
                  👋 Welcome,&nbsp;<strong>{user.name}</strong>&nbsp;[{user.role}]
                </li>

                <li className="nav-item ms-2">
                  <button
                    onClick={handleLogout}
                    className="btn btn-outline-light btn-sm"
                  >
                    Logout
                  </button>
                </li>

                {/* Search Button */}
                <li>
                  <button
                    className="search"
                    onClick={() => setShowSearch(true)}
                  >
                    <span className="lnr lnr-magnifier" id="search"></span>
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </nav>

        {/* Search Input Box (Temporary) */}
        {showSearch && (
          <div className="search-input" id="search-input-box">
            <div className="container">
              <form
                className="d-flex justify-content-between"
                onSubmit={(e) => e.preventDefault()}
              >
                <input
                  type="text"
                  className="form-control"
                  id="search-input"
                  placeholder="Search Here"
                />
                <button type="submit" className="btn"></button>
                <span
                  className="lnr lnr-cross"
                  id="close-search"
                  title="Close Search"
                  onClick={() => setShowSearch(false)}
                ></span>
              </form>
            </div>
          </div>
        )}
      </header>
      {/* ================ End Header Area ================= */}
    </>
  );
};

export default Header;
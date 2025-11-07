import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import feather from "feather-icons";

const AdminHeader = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    feather.replace();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  // 🔍 Highlight search matches
  useEffect(() => {
    const oldMarks = document.querySelectorAll(".highlight-search");
    oldMarks.forEach((mark) => {
      const parent = mark.parentNode;
      if (parent) {
        parent.replaceChild(document.createTextNode(mark.textContent), mark);
        parent.normalize();
      }
    });

    if (!searchTerm.trim()) return;

    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
    const regex = new RegExp(searchTerm, "gi");

    let node;
    while ((node = walker.nextNode())) {
      const text = node.textContent;
      if (regex.test(text)) {
        const newHTML = text.replace(
          regex,
          (match) =>
            `<span class="highlight-search" style="background:yellow;font-weight:bold">${match}</span>`
        );
        const temp = document.createElement("span");
        temp.innerHTML = newHTML;
        if (node.parentNode) node.parentNode.replaceChild(temp, node);
      }
    }
  }, [searchTerm]);

  const handleSearchChange = (e) => setSearchTerm(e.target.value);
  const handleSearchSubmit = (e) => e.preventDefault();

  return (
    <nav
      className="navbar navbar-expand-lg main-navbar sticky"
      style={{ background: "#fff", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}
    >
      <div className="navbar-brand d-flex align-items-center"></div>

      <div className="form-inline mr-auto ml-3">
        <ul className="navbar-nav mr-3">
          <li>
            <button
              className="nav-link nav-link-lg btn btn-link"
              onClick={() => console.log("Toggle sidebar")}
              style={{ color: "#34395e" }}
            >
              <i data-feather="align-justify" />
            </button>
          </li>
          <li>
            <button
              className="nav-link nav-link-lg btn btn-link"
              onClick={() => console.log("Fullscreen toggle")}
              style={{ color: "#34395e" }}
            >
              <i data-feather="maximize" />
            </button>
          </li>
          <li>
            <form className="form-inline mr-auto" onSubmit={handleSearchSubmit}>
              <div className="search-element" style={{ display: "flex" }}>
                <input
                  className="form-control"
                  type="search"
                  placeholder="Search"
                  aria-label="Search"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  style={{ width: "200px", border: "1px solid #ddd" }}
                />
                <button className="btn" type="submit" style={{ color: "#34395e" }}>
                  <i className="fas fa-search" />
                </button>
              </div>
            </form>
          </li>
        </ul>
      </div>

      <ul className="navbar-nav navbar-right align-items-center">
        {/* 📩 Message Icon — Now opens Notice Board */}
        <li className="nav-item mr-3">
          <button
            onClick={() => navigate("/messages")}
            className="nav-link nav-link-lg btn btn-link"
            style={{ color: "#34395e", position: "relative" }}
          >
            <i data-feather="mail" />
            <span
              className="badge headerBadge1"
              style={{
                background: "#6777ef",
                color: "#fff",
                borderRadius: "50%",
                fontSize: "12px",
                padding: "2px 6px",
                position: "absolute",
                top: "0",
                right: "0",
              }}
            >
              2
            </span>
          </button>
        </li>

        {/* <li className="nav-item mr-3">
          <button className="nav-link nav-link-lg btn btn-link" style={{ color: "#34395e" }}>
            <i data-feather="bell" />
          </button>
        </li> */}

        <li className="nav-item dropdown">
          <button className="btn btn-link d-flex align-items-center" style={{ color: "#34395e" }}>
            <span className="ml-2 d-sm-none d-lg-inline-block">Welcome, Admin</span>
          </button>
        </li>

        <li className="nav-item ml-3">
          <button onClick={handleLogout} className="btn btn-danger ml-2">
            <i className="fas fa-sign-out-alt mr-1"></i> Logout
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default AdminHeader;

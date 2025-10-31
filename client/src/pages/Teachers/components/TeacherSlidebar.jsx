// components/TeacherSlidebar.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import TeacherHeader from "./TeacherHeader";

const TeacherSlidebar = () => {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const toggleSidebar = () => setCollapsed(!collapsed);

  const SidebarDropdown = ({ iconName, label, children, menuKey }) => {
    const [isOpen, setIsOpen] = useState(false);
    const toggleDropdown = (e) => {
      e.preventDefault();
      setIsOpen(!isOpen);
    };

    return (
      <li className={`dropdown ${isOpen ? "active" : ""}`} key={menuKey}>
        <a
          href="#"
          className="menu-toggle nav-link has-dropdown"
          onClick={toggleDropdown}
          style={{ display: "flex", alignItems: "center", gap: "10px" }}
        >
          <i data-feather={iconName} style={{ minWidth: "20px" }}></i>
          {!collapsed && <span>{label}</span>}
        </a>
        <ul
          className="dropdown-menu"
          style={{ display: isOpen ? "block" : "none" }}
        >
          {children}
        </ul>
      </li>
    );
  };

  const NavItem = ({ to, iconName, label, isActive }) => (
    <li className={`dropdown ${isActive ? "active" : ""}`}>
      <Link
        to={to}
        className="nav-link"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          transition: "background 0.3s",
        }}
      >
        <i data-feather={iconName} style={{ minWidth: "20px" }}></i>
        {!collapsed && <span>{label}</span>}
      </Link>
    </li>
  );

  return (
    <>
      <TeacherHeader />

      <div
        className="main-sidebar sidebar-style-2"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          height: "100vh",
          overflowY: "auto",
          zIndex: 1030,
          width: collapsed ? "80px" : "250px",
          transition: "width 0.3s ease",
          background: "#fff",
          borderRight: "1px solid #ddd",
        }}
      >
        <aside id="sidebar-wrapper" style={{ height: "100%" }}>
          {/* Logo + Collapse Button */}
          <div
            className="sidebar-brand"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "15px",
              borderBottom: "1px solid #ddd",
            }}
          >
            <div
              onClick={() => navigate("/dashboard/teacher")}
              style={{
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
              }}
            >
              <img
                alt="logo"
                src="/assets/img/logo.png"
                className="header-logo"
                style={{
                  width: "35px",
                  height: "35px",
                  marginRight: collapsed ? "0" : "10px",
                  transition: "margin 0.3s ease",
                }}
              />
              {!collapsed && (
                <span
                  className="logo-name"
                  style={{
                    fontWeight: "bold",
                    fontSize: "18px",
                    letterSpacing: "1px",
                  }}
                >
                  TEACHER
                </span>
              )}
            </div>

            {/* Collapse Button */}
            <button
              onClick={toggleSidebar}
              style={{
                background: "transparent",
                border: "none",
                color: "#333",
                fontSize: "18px",
                cursor: "pointer",
                marginLeft: "10px",
              }}
              title={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
            >
              {collapsed ? "»" : "«"}
            </button>
          </div>

          {/* Navigation */}
          <ul className="sidebar-menu" style={{ padding: "10px" }}>
            <li className="menu-header" style={{ fontWeight: "bold", color: "#666" }}>
              Main
            </li>

            <NavItem
              to="/dashboard/teacher"
              iconName="home"
              label="Dashboard"
              isActive={true}
            />
            <NavItem to="/teacher/profile" iconName="user" label="Profile" />
            <NavItem to="/teacher/students" iconName="users" label="Students" />
            <NavItem
              to="/teacher/upload-assignment"
              iconName="upload"
              label="Upload Assignment"
            />
            <NavItem
              to="/teacher/attendance"
              iconName="check-square"
              label="Attendance"
            />
            <NavItem to="/messages" iconName="message-circle" label="Messages" />
            <NavItem
              to="/teacher/schedule-exam"
              iconName="calendar"
              label="Schedule Exam"
            />
            <NavItem
              to="/teacher/result-entry"
              iconName="file-text"
              label="Result Entry"
            />
          </ul>
        </aside>
      </div>
    </>
  );
};

export default TeacherSlidebar;

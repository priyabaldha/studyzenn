import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import TeacherHeader from "./TeacherHeader";

const TeacherSidebar = () => {
  const navigate = useNavigate();

  // Dropdown Component
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
        >
          <i data-feather={iconName}></i>
          <span>{label}</span>
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

  // Single Link Item
  const NavItem = ({ to, iconName, label, isActive }) => (
    <li className={`dropdown ${isActive ? "active" : ""}`}>
      <Link to={to} className="nav-link">
        <i data-feather={iconName}></i>
        <span>{label}</span>
      </Link>
    </li>
  );

  // Submenu Link Item
  const SubMenuItem = ({ to, label }) => (
    <li>
      <Link className="nav-link" to={to}>
        {label}
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
          width: "250px",
        }}
      >
        <aside id="sidebar-wrapper" style={{ height: "100%" }}>
          <div className="sidebar-brand">
            <a href="#" onClick={() => navigate("/dashboard/teacher")}>
              <img
                alt="logo"
                src="/assets/img/logo.png"
                className="header-logo"
              />
              <span className="logo-name">Teacher</span>
            </a>
          </div>

          <ul className="sidebar-menu">
            <li className="menu-header">Main</li>

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

export default TeacherSidebar;

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AdminNavbar from "./AdminHeader";

const AdminSidebar = () => {
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
      <AdminNavbar />

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
            <a href="#" onClick={() => navigate("/teacher")}>
              <img
                alt="logo"
                src="/assets/img/logo.png"
                className="header-logo"
              />
              <span className="logo-name"> Admin</span>
            </a>
          </div>

          <ul className="sidebar-menu">
            <li className="menu-header">Main</li>

            {/* Dashboard */}
            <NavItem
              to="/teacher"
              iconName="home"
              label="Dashboard"
              isActive={true}
            />

            {/* Users */}
            <NavItem to="/admin/users" iconName="layers" label="Users" />

            {/* Students */}
            <NavItem to="/students" iconName="users" label="Students" />

            {/* Teachers */}
            <NavItem to="/teachers" iconName="users" label="Teachers" />

            {/* Schedule */}
            <NavItem
              to="/admin/schedule-exam"
              iconName="calendar"
              label="Schedule"
            />

            {/* Subjects */}
            <NavItem to="/admin/subjects" iconName="layers" label="Subjects" />

            {/* Attendance */}
            <NavItem
              to="/admin/attendance/report"
              iconName="check-square"
              label="Attendance"
            />

            {/* Assignments */}
            <NavItem
              to="/admin/assignmnets/status"
              iconName="edit-3"
              label="Assignments"
            />

            {/* Notice */}
            <NavItem to="/messages" iconName="bell" label="Notice" />
          </ul>
        </aside>
      </div>
    </>
  );
};

export default AdminSidebar;

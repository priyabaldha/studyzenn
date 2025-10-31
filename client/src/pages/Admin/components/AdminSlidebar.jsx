// components/AdminSidebar.jsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import AdminNavbar from "./AdminHeader";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  CalendarDays,
  FileText,
  Bell,
  CheckSquare,
  Edit3,
} from "lucide-react";

const AdminSidebar = () => {
  const navigate = useNavigate();

  // Reusable Link Component
  const NavItem = ({ to, icon: Icon, label, isActive }) => (
    <li
      className={`dropdown ${isActive ? "active" : ""}`}
      style={{ listStyle: "none" }}
    >
      <Link
        to={to}
        className="nav-link"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          padding: "12px 18px",
          textDecoration: "none",
          color: isActive ? "#007bff" : "#333",
          fontWeight: isActive ? "600" : "400",
          transition: "background 0.3s ease, color 0.3s ease",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.background = "#f2f2f2")}
        onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
      >
        <Icon size={18} />
        <span>{label}</span>
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
          backgroundColor: "#fff",
          borderRight: "1px solid #ddd",
        }}
      >
        <aside id="sidebar-wrapper" style={{ height: "100%" }}>
          {/* ---- LOGO AREA ---- */}
          <div
            className="sidebar-brand"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-start",
              padding: "15px",
              borderBottom: "1px solid #ddd",
              cursor: "pointer",
            }}
            onClick={() => navigate("/dashboard/admin")}
          >
            <img
              alt="logo"
              src="/assets/img/logo.png"
              className="header-logo"
              style={{
                width: "35px",
                height: "35px",
                marginRight: "10px",
              }}
            />
            <span
              className="logo-name"
              style={{
                fontWeight: "bold",
                fontSize: "18px",
                letterSpacing: "1px",
                color: "#000",
              }}
            >
              ADMIN
            </span>
          </div>

          {/* ---- MENU ---- */}
          <ul className="sidebar-menu" style={{ padding: 0, marginTop: "10px" }}>
            <li
              className="menu-header"
              style={{
                padding: "10px 18px",
                color: "#666",
                fontWeight: "bold",
                textTransform: "uppercase",
                fontSize: "13px",
              }}
            >
              Main
            </li>

            {/* Dashboard */}
            <NavItem
              to="/dashboard/admin"
              icon={LayoutDashboard}
              label="Dashboard"
              isActive={true}
            />

            {/* Users */}
            <NavItem to="/admin/users" icon={Users} label="Users" />

            {/* Students */}
            <NavItem to="/students" icon={Users} label="Students" />

            {/* Teachers */}
            <NavItem to="/teachers" icon={Users} label="Teachers" />

            {/* Schedule */}
            <NavItem
              to="/admin/schedule-exam"
              icon={CalendarDays}
              label="Schedule Exam"
            />

            {/* Subjects */}
            <NavItem to="/admin/subjects" icon={BookOpen} label="Subjects" />

            {/* Attendance */}
            <NavItem
              to="/admin/attendance/report"
              icon={CheckSquare}
              label="Attendance"
            />

            {/* Assignments */}
            <NavItem
              to="/admin/assignment/status"
              icon={Edit3}
              label="Assignments"
            />

            {/* Notice */}
            <NavItem to="/admin/notice" icon={Bell} label="Notice Board" />
          </ul>
        </aside>
      </div>
    </>
  );
};

export default AdminSidebar;

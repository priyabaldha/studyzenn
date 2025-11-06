// components/TeacherSlidebar.jsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import TeacherHeader from "./TeacherHeader";
import {
  Home,
  User,
  Users,
  Upload,
  CheckSquare,
  MessageCircle,
  CalendarDays,
  FileText,
} from "lucide-react";

const TeacherSlidebar = () => {
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
          color: isActive ? "#4e54c8" : "#333",
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

  // Menu items
  const menuItems = [
    { to: "/dashboard/teacher", icon: Home, label: "Dashboard", isActive: true },
    { to: "/teacher/profile", icon: User, label: "Profile" },
    { to: "/teacher/students", icon: Users, label: "Students" },
    { to: "/teacher/upload-assignment", icon: Upload, label: "Upload Assignment" },
    { to: "/teacher/attendance", icon: CheckSquare, label: "Attendance" },
    { to: "/teacher/schedule-exam", icon: CalendarDays, label: "Schedule Exam" },
    { to: "/teacher/result-entry", icon: FileText, label: "Result Entry" },
  ];
  
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
          background: "#fff",
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
            onClick={() => navigate("/dashboard/teacher")}
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
                color: "#4e54c8",
              }}
            >
              TEACHER
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

            {menuItems.map((item, index) => (
              <NavItem key={index} {...item} />
            ))}
          </ul>
        </aside>
      </div>
    </>
  );
};

export default TeacherSlidebar;

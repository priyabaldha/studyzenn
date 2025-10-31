import React, { useState } from "react";
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
  Layers,
} from "lucide-react";

const AdminSidebar = () => {
  const navigate = useNavigate();

  // Single Link Item
  const NavItem = ({ to, icon: Icon, label, isActive }) => (
    <li className={`dropdown ${isActive ? "active" : ""}`}>
      <Link
        to={to}
        className="nav-link"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          padding: "10px 15px",
          textDecoration: "none",
        }}
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
          <div
            className="sidebar-brand"
            style={{
              padding: "15px",
              textAlign: "center",
              borderBottom: "1px solid #ddd",
            }}
          >
            <a href="#" onClick={() => navigate("/teacher")}>
              <img
                alt="logo"
                src="/assets/img/logo.png"
                className="header-logo"
                style={{ height: "40px", marginBottom: "5px" }}
              />
              <div style={{ fontWeight: "bold", fontSize: "18px" }}>Admin</div>
            </a>
          </div>

          <ul className="sidebar-menu" style={{ listStyle: "none", padding: 0 }}>
            <li className="menu-header" style={{ padding: "10px 15px", color: "#666" }}>
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
            <NavItem to="/admin/schedule-exam" icon={CalendarDays} label="Schedule" />

            {/* Subjects */}
            <NavItem to="/admin/subjects" icon={BookOpen} label="Subjects" />

            {/* Attendance */}
            <NavItem to="/admin/attendance/report" icon={CheckSquare} label="Attendance" />

            {/* Assignments */}
            <NavItem to="/admin/assignment/status" icon={Edit3} label="Assignments" />

            {/* Notice */}
            <NavItem to="/messages" icon={Bell} label="Notice" />
          </ul>
        </aside>
      </div>
    </>
  );
};

export default AdminSidebar;

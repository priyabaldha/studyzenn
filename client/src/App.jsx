// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Signup from "./pages/Auth/Signup";
import Login from "./pages/Auth/Login";
import Header from "./components/Header";
import PrivateRoute from "./components/PrivateRoute";

import AdminDashboard from "./pages/Dashboard/AdminDashboard";
import TeacherDashboard from "./pages/Dashboard/TeacherDashboard";
import StudentDashboard from "./pages/Dashboard/StudentDashboard";

import StudentsList from "./pages/Students/StudentsList";
import StudentForm from "./pages/Students/StudentForm";

import TeachersList from "./pages/Teachers/TeachersList";
import TeacherForm from "./pages/Teachers/TeacherForm";
import TeacherViewStudents from "./pages/Teachers/TeacherViewStudents";

import AdminUsers from "./pages/Admin/AdminUsers";
import StudentProfile from "./pages/Students/StudentProfile";

const App = () => {
  return (
    <Router>
      <Header />

      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Admin Routes */}
        <Route
          path="/dashboard/admin"
          element={
            <PrivateRoute allowedRoles={["admin"]}>
              <AdminDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/students"
          element={
            <PrivateRoute allowedRoles={["admin"]}>
              <StudentForm />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/teachers/add"
          element={
            <PrivateRoute allowedRoles={["admin"]}>
              <TeacherForm />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <PrivateRoute allowedRoles={["admin"]}>
              <AdminUsers />
            </PrivateRoute>
          }
        />

        {/* Teacher Routes */}
        <Route
          path="/dashboard/teacher"
          element={
            <PrivateRoute allowedRoles={["teacher"]}>
              <TeacherDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/teacher/students"
          element={
            <PrivateRoute allowedRoles={["teacher"]}>
              <TeacherViewStudents />
            </PrivateRoute>
          }
        />
        <Route
          path="/teachers"
          element={
            <PrivateRoute allowedRoles={["teacher", "admin"]}>
              <TeachersList />
            </PrivateRoute>
          }
        />

        {/* Student Routes */}
        <Route
          path="/dashboard/student"
          element={
            <PrivateRoute allowedRoles={["student"]}>
              <StudentDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/students"
          element={
            <PrivateRoute allowedRoles={["admin", "teacher"]}>
              <StudentsList />
            </PrivateRoute>
          }
        />
        <Route
          path="/student/profile"
          element={
            <PrivateRoute allowedRoles={["student"]}>
              <StudentProfile />
            </PrivateRoute>
          }
        />

        {/* Fallback */}
        <Route path="/unauthorized" element={<h2>🚫 Unauthorized Access</h2>} />
        <Route path="*" element={<h2>404 - Page not found</h2>} />
      </Routes>
    </Router>
  );
};

export default App;

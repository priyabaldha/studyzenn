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
import TeacherProfile from "./pages/Teachers/TeacherProfile";
import TeacherAssignmentUpload from "./pages/Teachers/TeacherAssignmentUpload";
import StudentAssignments from "./pages/Students/StudentAssignments";
import StudentAssignmentView from "./pages/Students/StudentAssignmentView";
import SubmissionReview from "./pages/Teachers/TeacherSubmissionReview";
import TeacherAttendance from "./pages/Teachers/TeacherAttendance";
import StudentAttendance from "./pages/Students/StudentAttendance";
import AdminAttendanceReport from "./pages/Admin/AdminAttendanceReport";
import AdminAssignmentStatus from "./pages/Admin/AdminAssignmentStatus";
import UserMessageDashboard from "./pages/Dashboard/UserMessageDashboard";
import AdminSubjectManager from "./pages/Admin/AdminSubjectManager";
import ExamScheduler from "./pages/Admin/ExamScheduler";
import StudentExamSchedule from "./pages/Students/StudentExamSchedule";
import ResultEntry from "./pages/Teachers/ResultEntry";
import StudentResults from "./pages/Students/StudentResults";

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
          path="/admin/students/add"
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

        <Route
          path="/teacher/profile"
          element={
            <PrivateRoute allowedRoles={["teacher"]}>
              <TeacherProfile />
            </PrivateRoute>
          }
        />
        <Route path="/teacher/upload-assignment" element={<TeacherAssignmentUpload />} />
        <Route path="/student/assignments" element={<StudentAssignments />} />
        <Route path="/student/assignments/:id" element={<StudentAssignmentView />} />

        <Route
          path="/teacher/assignments/:id/review" // 🆕 NEW ROUTE
          element={
            <PrivateRoute allowedRoles={["teacher"]}>
              <SubmissionReview />
            </PrivateRoute>
          }
        />

        <Route
          path="/teacher/attendance" // You can define your own path here
          element={
            <PrivateRoute allowedRoles={["teacher"]}>
              <TeacherAttendance />
            </PrivateRoute>
          }
        />

        <Route
          path="/student/attendance"
          element={
            <PrivateRoute allowedRoles={["student"]}>
              <StudentAttendance />
            </PrivateRoute>
          }
        />

        <Route
          path="/admin/attendance/report"
          element={
            <PrivateRoute allowedRoles={["admin"]}>
              <AdminAttendanceReport />
            </PrivateRoute>
          }
        />

        <Route
          path="/admin/assignment/status"
          element={
            <PrivateRoute allowedRoles={["admin"]}>
              <AdminAssignmentStatus />
            </PrivateRoute>
          }
        />

        <Route
          path="/messages"
          element={
            <PrivateRoute allowedRoles={["admin", "teacher", "student"]}>
              <UserMessageDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/subjects"
          element={
            <PrivateRoute allowedRoles={["admin"]}>
              <AdminSubjectManager />
            </PrivateRoute>
          }
        />

        <Route
          path="/admin/schedule-exam"
          element={
            <PrivateRoute allowedRoles={["admin"]}>
              <ExamScheduler />
            </PrivateRoute>
          }
        />

        <Route
          path="/teacher/schedule-exam"
          element={
            <PrivateRoute allowedRoles={["teacher"]}>
              <ExamScheduler />
            </PrivateRoute>
          }
        />

        <Route
          path="/student/exam-schedule"
          element={
            <PrivateRoute allowedRoles={["student"]}>
              <StudentExamSchedule />
            </PrivateRoute>
          }
        />

        <Route
          path="/teacher/result-entry"
          element={
            <PrivateRoute allowedRoles={["teacher"]}>
              <ResultEntry />
            </PrivateRoute>
          }
        />\

        <Route
          path="/student/results"
          element={
            <PrivateRoute allowedRoles={["student"]}>
              <StudentResults />
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

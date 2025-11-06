// src/pages/Dashboard/TeacherDashboard.jsx
import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { hasRole } from "../../utils/roleCheck";
import TeacherSlidebar from "../Teachers/components/TeacherSlidebar";
import Chart from "chart.js/auto";

const POLL_INTERVAL_MS = 30000;

const TeacherDashboard = () => {
  if (!hasRole(["teacher"])) return <h3>Access Denied</h3>;

  const [stats, setStats] = useState({
    totalStudents: 0,
    totalAssignments: 0,
    totalAttendance: 0,
  });

  const [data, setData] = useState({
    students: [],
    assignments: [],
    attendance: [],
  });

  const token = localStorage.getItem("token");

  // Chart refs
  const chart1Ref = useRef(null);
  const chart2Ref = useRef(null);
  const chart3Ref = useRef(null);
  const chartInstances = useRef({});

  // Fetch teacher-specific data
  const fetchTeacherData = async () => {
    try {
      const [studentsRes, assignmentsRes, attendanceRes] = await Promise.all([
        axios.get("http://localhost:5000/api/students", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get("http://localhost:5000/api/assignments", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios
          .get("http://localhost:5000/api/attendance/all", {
            headers: { Authorization: `Bearer ${token}` },
          })
          .catch(() => ({ data: [] })),
      ]);

      const students = studentsRes.data || [];
      const assignments = assignmentsRes.data || [];
      const attendance = attendanceRes.data || [];

      setStats({
        totalStudents: students.length,
        totalAssignments: assignments.length,
        totalAttendance: attendance.length,
      });
      setData({ students, assignments, attendance });
    } catch (err) {
      console.error("Teacher Dashboard fetch error:", err);
    }
  };

  // Build chart data
  const buildChartData = () => {
    // Chart 1: Students by Semester
    const semMap = {};
    data.students.forEach((s) => {
      const sem = s.semester || "Unknown";
      semMap[sem] = (semMap[sem] || 0) + 1;
    });
    const chart1Labels = Object.keys(semMap);
    const chart1Data = chart1Labels.map((k) => semMap[k]);

    // Chart 2: Assignments Uploaded by Month
    const monthMap = {};
    data.assignments.forEach((a) => {
      const d = new Date(a.createdAt || a.uploadDate || Date.now());
      const label = d.toLocaleString("default", { month: "short", year: "numeric" });
      monthMap[label] = (monthMap[label] || 0) + 1;
    });
    const chart2Labels = Object.keys(monthMap);
    const chart2Data = chart2Labels.map((k) => monthMap[k]);

    // Chart 3: Attendance Overview
    let present = 0;
    data.attendance.forEach((r) => {
      const st = (r.status || "").toLowerCase();
      if (st === "present" || st === "late") present++;
    });
    const total = data.attendance.length;
    const presentPct = total ? Math.round((present / total) * 100) : 0;
    const absentPct = total ? 100 - presentPct : 0;

    return {
      chart1: { labels: chart1Labels, data: chart1Data },
      chart2: { labels: chart2Labels, data: chart2Data },
      chart3: { labels: ["Present", "Absent"], data: [presentPct, absentPct] },
    };
  };

  // Render charts
  const renderCharts = () => {
    const { chart1, chart2, chart3 } = buildChartData();

    Object.values(chartInstances.current).forEach((chart) => chart?.destroy());
    chartInstances.current = {};

    // === Chart 1: Line (Students) ===
    if (chart1Ref.current) {
      const ctx = chart1Ref.current.getContext("2d");
      const gradient = ctx.createLinearGradient(0, 0, 0, 300);
      gradient.addColorStop(0, "#667eea");
      gradient.addColorStop(1, "#cfabf4ff");

      chartInstances.current.chart1 = new Chart(ctx, {
        type: "line",
        data: {
          labels: chart1.labels,
          datasets: [
            {
              label: "Students by Semester",
              data: chart1.data,
              fill: true,
              borderColor: "#6a11cb",
              backgroundColor: gradient,
              borderWidth: 3,
              tension: 0.4,
              pointBackgroundColor: "#fff",
              pointRadius: 5,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          animation: { duration: 1200, easing: "easeOutQuart" },
          plugins: {
            legend: { display: false },
            title: {
              display: true,
              text: "Students by Semester",
              color: "#2d2f48",
              font: { size: 15, weight: "bold" },
            },
          },
          scales: {
            x: { grid: { display: false } },
            y: { beginAtZero: true },
          },
        },
      });
    }

    // === Chart 2: Bar (Assignments) ===
    if (chart2Ref.current) {
      const ctx = chart2Ref.current.getContext("2d");
      chartInstances.current.chart2 = new Chart(ctx, {
        type: "bar",
        data: {
          labels: chart2.labels,
          datasets: [
            {
              label: "Assignments Uploaded",
              data: chart2.data,
              backgroundColor: ["#5a67d8", "#7f9cf5", "#b794f4", "#9f7aea"],
              borderRadius: 10,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          animation: { duration: 1000, easing: "easeInOutCubic" },
          plugins: {
            legend: { display: false },
            title: {
              display: true,
              text: "Assignments Uploaded per Month",
              color: "#2d2f48",
              font: { size: 15, weight: "bold" },
            },
          },
          scales: {
            x: { grid: { display: false } },
            y: { beginAtZero: true },
          },
        },
      });
    }

    // === Chart 3: Doughnut (Attendance) ===
    if (chart3Ref.current) {
      const ctx = chart3Ref.current.getContext("2d");
      chartInstances.current.chart3 = new Chart(ctx, {
        type: "doughnut",
        data: {
          labels: chart3.labels,
          datasets: [
            {
              label: "Attendance %",
              data: chart3.data,
              backgroundColor: ["#5ee7df", "#b490ca"],
              hoverOffset: 10,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          cutout: "70%",
          plugins: {
            legend: { position: "bottom" },
            title: {
              display: true,
              text: "Attendance Overview",
              color: "#2d2f48",
              font: { size: 15, weight: "bold" },
            },
          },
        },
      });
    }
  };

  useEffect(() => {
    fetchTeacherData();
    const interval = setInterval(fetchTeacherData, POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [token]);

  useEffect(() => {
    renderCharts();
    return () => Object.values(chartInstances.current).forEach((chart) => chart?.destroy());
  }, [data]);

  return (
    <>
      <TeacherSlidebar />
      <div className="main-content teacher-dashboard">
        <section className="section">
          <div className="section-body">
            <h2
              style={{
                textAlign: "center",
                color: "#4c51bf",
                fontWeight: "700",
                fontSize: "1.8rem",
                marginBottom: "2rem",
                textShadow: "0 2px 4px rgba(0,0,0,0.1)",
              }}
            >
              Teacher Dashboard Overview
            </h2>

            {/* Stat Cards */}
            <div className="row">
              {[
                {
                  title: "Total Students",
                  value: stats.totalStudents,
                  color: "linear-gradient(135deg, #667eea, #a06ed2ff)",
                },
                {
                  title: "Assignments",
                  value: stats.totalAssignments,
                  color: "linear-gradient(135deg, #58ecbdff, #507ca8ff)",
                },
                {
                  title: "Attendance Records",
                  value: stats.totalAttendance,
                  color: "linear-gradient(135deg, #5ee7df, #b490ca)",
                },
              ].map((card, idx) => (
                <div key={idx} className="col-xl-4 col-lg-6 col-md-6 col-sm-6 mb-4">
                  <div
                    className="card dashboard-card"
                    style={{
                      background: card.color,
                      color: "white",
                      borderRadius: "15px",
                      boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                      transition: "transform 0.3s ease, box-shadow 0.3s ease",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-8px)")}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0px)")}
                  >
                    <div className="card-body text-center p-4">
                      <h5 className="font-16 mb-2">{card.title}</h5>
                      <h2 className="font-22 mb-2" style={{ fontWeight: "700" }}>
                        {card.value}
                      </h2>
                      <p style={{ opacity: 0.9 }}>Updated live</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Charts */}
            <div className="row">
              <div className="col-lg-4 col-md-12 mb-4">
                <div className="card chart-card">
                  <div className="card-body" style={{ height: 300 }}>
                    <canvas ref={chart1Ref}></canvas>
                  </div>
                </div>
              </div>
              <div className="col-lg-4 col-md-12 mb-4">
                <div className="card chart-card">
                  <div className="card-body" style={{ height: 300 }}>
                    <canvas ref={chart2Ref}></canvas>
                  </div>
                </div>
              </div>
              <div className="col-lg-4 col-md-12 mb-4">
                <div className="card chart-card">
                  <div className="card-body" style={{ height: 300 }}>
                    <canvas ref={chart3Ref}></canvas>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default TeacherDashboard;

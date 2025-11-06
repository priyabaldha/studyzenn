// src/pages/Dashboard/AdminDashboard.jsx
import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { hasRole } from "../../utils/roleCheck";
import AdminSlidebar from "../Admin/components/AdminSlidebar";
import Chart from "chart.js/auto";

const POLL_INTERVAL_MS = 30000;

const AdminDashboard = () => {
  if (!hasRole(["admin"])) return <h3>Access Denied</h3>;

  const [counts, setCounts] = useState({
    students: 0,
    teachers: 0,
    assignments: 0,
    attendance: 0,
  });

  const [rawData, setRawData] = useState({
    students: [],
    teachers: [],
    assignments: [],
    attendance: [],
  });

  const token = localStorage.getItem("token");

  const chart1Ref = useRef(null);
  const chart2Ref = useRef(null);
  const chart3Ref = useRef(null);
  const chartInstancesRef = useRef({});

  const fetchDashboardData = async () => {
    try {
      const [studentsRes, teachersRes, assignmentsRes, attendanceRes] =
        await Promise.all([
          axios.get("http://localhost:5000/api/students", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:5000/api/teachers", {
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
      const teachers = teachersRes.data || [];
      const assignments = assignmentsRes.data || [];
      const attendance = attendanceRes.data || [];

      setCounts({
        students: students.length,
        teachers: teachers.length,
        assignments: assignments.length,
        attendance: attendance.length,
      });

      setRawData({ students, teachers, assignments, attendance });
    } catch (err) {
      console.error("Dashboard fetch error:", err);
    }
  };

  const buildChartDatasets = (data) => {
    const semMap = {};
    data.students.forEach((s) => {
      const sem = s.semester || "Unknown";
      semMap[sem] = (semMap[sem] || 0) + 1;
    });
    const chart1Labels = Object.keys(semMap);
    const chart1Data = chart1Labels.map((k) => semMap[k]);

    const monthMap = {};
    data.assignments.forEach((a) => {
      const d = new Date(a.uploadDate || a.createdAt || Date.now());
      const label = d.toLocaleString("default", { month: "short", year: "numeric" });
      monthMap[label] = (monthMap[label] || 0) + 1;
    });
    const chart2Labels = Object.keys(monthMap);
    const chart2Data = chart2Labels.map((k) => monthMap[k]);

    let present = 0;
    let total = 0;
    data.attendance.forEach((rec) => {
      total += 1;
      const st = (rec.status || "").toLowerCase();
      if (st === "present" || st === "late") present += 1;
    });
    const presentPct = total > 0 ? Math.round((present / total) * 100) : 0;
    const absentPct = total > 0 ? 100 - presentPct : 0;

    return {
      chart1: { labels: chart1Labels, data: chart1Data },
      chart2: { labels: chart2Labels, data: chart2Data },
      chart3: { labels: ["Present", "Absent"], data: [presentPct, absentPct] },
    };
  };

  const renderCharts = () => {
    const { chart1, chart2, chart3 } = buildChartDatasets(rawData);

    Object.values(chartInstancesRef.current).forEach((chart) => chart?.destroy());
    chartInstancesRef.current = {};

    // === Chart 1: Gradient Line ===
    if (chart1Ref.current) {
      const ctx = chart1Ref.current.getContext("2d");
      const gradient = ctx.createLinearGradient(0, 0, 0, 300);
      gradient.addColorStop(0, "#667eea");
      gradient.addColorStop(1, "#764ba2");

      chartInstancesRef.current.chart1 = new Chart(ctx, {
        type: "line",
        data: {
          labels: chart1.labels,
          datasets: [
            {
              label: "Students by Semester",
              data: chart1.data,
              fill: true,
              borderColor: "#8e98f3ff",
              backgroundColor: gradient,
              tension: 0.4,
              borderWidth: 3,
              pointBackgroundColor: "#fff",
              pointRadius: 5,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          animation: { duration: 1000, easing: "easeOutQuart" },
          plugins: {
            legend: { display: false },
            title: {
              display: true,
              text: "Students by Semester",
              color: "#2d2f48",
              font: { size: 15, weight: "bold" },
            },
          },
          scales: { x: { grid: { display: false } }, y: { beginAtZero: true } },
        },
      });
    }
x
    // === Chart 2: Bar ===
    if (chart2Ref.current) {
      const ctx = chart2Ref.current.getContext("2d");
      chartInstancesRef.current.chart2 = new Chart(ctx, {
        type: "bar",
        data: {
          labels: chart2.labels,
          datasets: [
            {
              label: "Assignments Uploaded",
              data: chart2.data,
              backgroundColor: ["#98a2f8ff", "#7f9cf5", "#b794f4", "#9f7aea"],
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
          scales: { x: { grid: { display: false } }, y: { beginAtZero: true } },
        },
      });
    }

    // === Chart 3: Doughnut ===
    if (chart3Ref.current) {
      const ctx = chart3Ref.current.getContext("2d");
      chartInstancesRef.current.chart3 = new Chart(ctx, {
        type: "doughnut",
        data: {
          labels: chart3.labels,
          datasets: [
            {
              label: "Attendance %",
              data: chart3.data,
              backgroundColor: ["#43cea2", "#f5a6e6"],
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
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [token]);

  useEffect(() => {
    renderCharts();
    return () => Object.values(chartInstancesRef.current).forEach((chart) => chart?.destroy());
  }, [rawData]);

  return (
    <>
      <AdminSlidebar />
      <div className="main-content" style={{ fontFamily: "Poppins, sans-serif" }}>
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
              Admin Dashboard Overview
            </h2>

            {/* Stat Cards */}
            <div className="row">
              {[
                {
                  title: "Total Students",
                  value: counts.students,
                  color: "linear-gradient(135deg, #687fe6ff, #b97af8ff)",
                },
                {
                  title: "Total Teachers",
                  value: counts.teachers,
                  color: "linear-gradient(135deg, #43cea2, #5199e2ff)",
                },
                {
                  title: "Assignments",
                  value: counts.assignments,
                  color: "linear-gradient(135deg, #5ee7df, #b490ca)",
                },
                {
                  title: "Attendance Records",
                  value: counts.attendance,
                  color: "linear-gradient(135deg, #ec7a9cff, #d6c876ff)",
                },
              ].map((card, idx) => (
                <div
                  key={idx}
                  className="col-xl-3 col-lg-6 col-md-6 col-sm-6 mb-4"
                  style={{ padding: "10px" }}
                >
                  <div
                    style={{
                      background: card.color,
                      color: "white",
                      borderRadius: "15px",
                      boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                      transition: "transform 0.3s ease, box-shadow 0.3s ease",
                      textAlign: "center",
                      padding: "25px 10px",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-8px)")}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0px)")}
                  >
                    <h5 style={{ marginBottom: "10px", fontSize: "16px" }}>{card.title}</h5>
                    <h2 style={{ fontWeight: "700", fontSize: "28px", marginBottom: "8px" }}>
                      {card.value}
                    </h2>
                    <p style={{ opacity: 0.9, fontSize: "14px" }}>Updated live</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Charts */}
            <div className="row">
              {[chart1Ref, chart2Ref, chart3Ref].map((ref, idx) => (
                <div key={idx} className="col-lg-4 col-md-12 mb-4" style={{ padding: "10px" }}>
                  <div
                    style={{
                      borderRadius: "16px",
                      background: "#fff",
                      boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
                      padding: "20px",
                      height: "320px",
                      transition: "0.3s ease",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-5px)")}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0px)")}
                  >
                    <canvas ref={ref} style={{ width: "100%", height: "100%" }}></canvas>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default AdminDashboard;

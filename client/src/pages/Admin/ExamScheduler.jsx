import React, { useState, useEffect } from "react";
import axios from "axios";
import AdminHeader from "../Admin/components/AdminHeader";
import AdminSlidebar from "../Admin/components/AdminSlidebar";
import "../../css/AdminExamScheduler.css"; // Import the external CSS

const SEMESTER_OPTIONS = ["1st", "2nd", "3rd", "4th", "5th", "6th"];
const DIVISION_OPTIONS = ["A", "B", "C", "D"];

export default function ExamScheduler() {
  const [form, setForm] = useState({
    subjectId: "",
    title: "",
    semester: SEMESTER_OPTIONS[0],
    division: DIVISION_OPTIONS[0],
    examDate: "",
    maxMarks: 100,
    duration: "3 hours",
  });
  const [subjects, setSubjects] = useState([]);
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchSubjects = async () => {
      if (!form.semester) return;
      try {
        const res = await axios.get(
          `http://localhost:5000/api/subjects?semester=${form.semester}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setSubjects(res.data);
        setForm((prev) => ({
          ...prev,
          subjectId: res.data.length > 0 ? res.data[0]._id : "",
        }));
      } catch (err) {
        console.error("Failed to fetch subjects:", err);
        setSubjects([]);
      }
    };
    fetchSubjects();
  }, [form.semester, token]);

  useEffect(() => {
    fetchExams();
  }, [token]);

  const fetchExams = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/exams", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setExams(res.data);
    } catch (err) {
      console.error("Failed to fetch exams:", err);
    }
  };

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      await axios.post("http://localhost:5000/api/exams", form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage("✅ Exam scheduled successfully!");
      setForm((prev) => ({
        ...prev,
        title: "",
        examDate: "",
        maxMarks: 100,
      }));
      fetchExams();
    } catch (err) {
      setMessage(err.response?.data?.message || "❌ Failed to schedule exam.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <AdminHeader />
      <AdminSlidebar />

      <div className="exam-scheduler-container">
        <div className="exam-scheduler-card">
            <h3 className="exam-scheduler-grid text-center">Exam Schedule Manager</h3>
            
          <div className="exam-scheduler-grid">
            {/* Left: Form */}
            <div className="exam-form">
              <h3>Schedule New Exam</h3>
              <form onSubmit={handleSubmit}>
                <select name="semester" value={form.semester} onChange={handleChange}>
                  {SEMESTER_OPTIONS.map((sem) => (
                    <option key={sem} value={sem}>{sem} Semester</option>
                  ))}
                </select>

                <select name="division" value={form.division} onChange={handleChange}>
                  {DIVISION_OPTIONS.map((div) => (
                    <option key={div} value={div}>Division {div}</option>
                  ))}
                </select>

                <select name="subjectId" value={form.subjectId} onChange={handleChange}>
                  {subjects.length === 0 ? (
                    <option>No Subjects Found</option>
                  ) : (
                    subjects.map((sub) => (
                      <option key={sub._id} value={sub._id}>
                        {sub.name} ({sub.code})
                      </option>
                    ))
                  )}
                </select>

                <input name="title" placeholder="Exam Title" value={form.title} onChange={handleChange} />
                <input name="maxMarks" type="number" placeholder="Max Marks" value={form.maxMarks} onChange={handleChange} />
                <input name="duration" placeholder="Duration (e.g., 3 hours)" value={form.duration} onChange={handleChange} />
                <label>Exam Date</label>
                <input type="date" name="examDate" value={form.examDate} onChange={handleChange} />

                <button type="submit" disabled={!form.subjectId || loading}>
                  {loading ? "Scheduling..." : "➕ Schedule Exam"}
                </button>
              </form>

              {message && <p className={message.includes("✅") ? "success" : "error"}>{message}</p>}
            </div>

            {/* Right: Table */}
            <div className="exam-table">
              <h3>Upcoming Exams ({exams.length})</h3>
              <div className="table-wrapper">
                <table>
                  <thead>
                    <tr>
                      <th>Subject</th>
                      <th>Class</th>
                      <th>Date</th>
                      <th>Max Marks</th>
                    </tr>
                  </thead>
                  <tbody>
                    {exams.map((exam, i) => (
                      <tr key={exam._id}>
                        <td>{exam.subjectId?.name} ({exam.title})</td>
                        <td>{exam.semester}/{exam.division}</td>
                        <td>{new Date(exam.examDate).toLocaleDateString()}</td>
                        <td>{exam.maxMarks}</td>
                      </tr>
                    ))}
                    {exams.length === 0 && (
                      <tr>
                        <td colSpan="4" className="no-exams">No exams scheduled yet.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

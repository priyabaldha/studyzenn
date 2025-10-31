// pages/Teachers/ResultEntry.jsx
import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import TeacherSlidebar from "./components/TeacherSlidebar";
import "../../css/ResultEntry.css"; // ✅ External CSS

export default function ResultEntry() {
  const [exams, setExams] = useState([]);
  const [selectedExamId, setSelectedExamId] = useState("");
  const [examDetails, setExamDetails] = useState(null);
  const [studentResults, setStudentResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const getSubjectName = (exam, examsList) => {
    const currentExam = exam?.subjectId?.name
      ? exam
      : examsList.find((e) => e._id === exam?._id);
    return currentExam?.subjectId?.name || "N/A";
  };

  const fetchStudentsAndResults = useCallback(
    async (examId) => {
      if (!examId) {
        setStudentResults([]);
        setExamDetails(null);
        return;
      }
      setMessage("");
      setLoading(true);
      try {
        const res = await axios.get(
          `http://localhost:5000/api/exams/${examId}/students`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setStudentResults(res.data.students);
        setExamDetails(res.data.exam);
      } catch (err) {
        setMessage("Failed to load students for result entry.");
        setStudentResults([]);
        setExamDetails(null);
      } finally {
        setLoading(false);
      }
    },
    [token]
  );

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/exams", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setExams(res.data);
      } catch (err) {
        setMessage("Error fetching exam list.");
      } finally {
        setLoading(false);
      }
    };
    fetchExams();
  }, [token]);

  useEffect(() => {
    fetchStudentsAndResults(selectedExamId);
  }, [selectedExamId, fetchStudentsAndResults]);

  const handleMarkChange = (studentId, marks) => {
    setStudentResults((prevResults) =>
      prevResults.map((student) =>
        student.studentId === studentId
          ? { ...student, marksObtained: marks }
          : student
      )
    );
  };

  const handleSubmitResults = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    const maxMarks = examDetails?.maxMarks || 0;
    const resultsToSubmit = studentResults
      .filter((s) => s.marksObtained !== null && s.marksObtained !== "")
      .map((s) => ({
        studentId: s.studentId,
        marksObtained: parseInt(s.marksObtained),
      }));

    if (resultsToSubmit.length === 0) {
      setMessage("⚠ Please enter marks for at least one student.");
      setLoading(false);
      return;
    }

    if (maxMarks) {
      const invalidMarks = resultsToSubmit.filter(
        (r) => r.marksObtained > maxMarks || r.marksObtained < 0
      );
      if (invalidMarks.length > 0) {
        setMessage(`⚠ Marks cannot exceed ${maxMarks}.`);
        setLoading(false);
        return;
      }
    }

    try {
      await axios.post(
        "http://localhost:5000/api/results",
        { examId: selectedExamId, results: resultsToSubmit },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage("✅ Results successfully saved!");
      setTimeout(() => {
        fetchStudentsAndResults(selectedExamId);
      }, 500);
    } catch (err) {
      setMessage("❌ Failed to save results.");
      setLoading(false);
    }
  };

  const handlePublishResults = async () => {
    if (!selectedExamId || studentResults.length === 0) {
      setMessage("⚠ Select an exam with results before publishing.");
      return;
    }

    if (!window.confirm("Are you sure you want to publish all results?"))
      return;

    setLoading(true);
    setMessage("");

    try {
      const res = await axios.patch(
        `http://localhost:5000/api/results/publish/${selectedExamId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage(res.data.message);
    } catch (err) {
      setMessage("❌ Failed to publish results.");
    } finally {
      setLoading(false);
    }
  };

  const maxMarks = examDetails?.maxMarks || 0;

  if (loading && exams.length === 0) return <p>Loading exam schedules...</p>;

  return (
    <div>
      <TeacherSlidebar />
      <div className="result-container">
        <h2 className="result-title">Result Entry Panel</h2>

        <div className="exam-selector">
          <label>Select Exam:</label>
          <select
            value={selectedExamId}
            onChange={(e) => setSelectedExamId(e.target.value)}
            disabled={loading}
          >
            <option value="">-- Choose Exam --</option>
            {exams.map((exam) => (
              <option key={exam._id} value={exam._id}>
                {getSubjectName(exam, exams)} ({exam.semester}/
                {exam.division})
              </option>
            ))}
          </select>
        </div>

        {message && <p className="result-message">{message}</p>}

        {examDetails && (
          <div className="exam-details">
            <h3>
              {getSubjectName(examDetails, exams)} - {examDetails.title}
            </h3>
            <p>
              Class:{" "}
              <b>
                {examDetails.semester}/{examDetails.division}
              </b>{" "}
              | Max Marks: <b>{maxMarks}</b>
            </p>
          </div>
        )}

        {studentResults.length > 0 && examDetails && (
          <form onSubmit={handleSubmitResults}>
            <table className="result-table">
              <thead>
                <tr>
                  <th>Roll No</th>
                  <th>Student Name</th>
                  <th>Marks ({maxMarks})</th>
                </tr>
              </thead>
              <tbody>
                {studentResults.map((student) => (
                  <tr key={student.studentId}>
                    <td>{student.rollNo}</td>
                    <td>{student.name}</td>
                    <td>
                      <input
                        type="number"
                        value={student.marksObtained}
                        onChange={(e) =>
                          handleMarkChange(student.studentId, e.target.value)
                        }
                        min="0"
                        max={maxMarks}
                        required
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="result-buttons">
              <button
                type="submit"
                disabled={loading}
                className="btn save-btn"
              >
                {loading ? "Saving..." : "💾 Save Results"}
              </button>
              <button
                type="button"
                onClick={handlePublishResults}
                disabled={loading}
                className="btn publish-btn"
              >
                {loading ? "Publishing..." : "📢 Publish Results"}
              </button>
            </div>
          </form>
        )}

        {selectedExamId && !loading && studentResults.length === 0 && (
          <p className="no-students">No students found for this class.</p>
        )}
      </div>
    </div>
  );
}

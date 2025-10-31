import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminHeader from "./components/AdminHeader";
import AdminSlidebar from "./components/AdminSlidebar";
import "../../css/AdminUsers.css";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/users", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(res.data);
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    };
    fetchUsers();
  }, [token]);

  return (
    <>
      <style>{`
        /* -------- Container Layout -------- */
        .admin-users-container {
          margin-left: 260px;
          padding-top: 110px;
          min-height: 100vh;
          background: #f4f6f9;
          font-family: "Poppins", sans-serif;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding-bottom: 50px;
          transition: all 0.3s ease;
        }

        /* -------- Title Section -------- */
        .admin-users-header {
          width: 100%;
          text-align: center;
          margin-bottom: 40px;
        }

        .admin-users-header h1 {
          font-size: 36px;
          font-weight: 700;
          color: #1b1b1b;
          margin-bottom: 10px;
          text-transform: uppercase;
          letter-spacing: 1px;
          position: relative;
          display: inline-block;
        }

        .admin-users-header h1::after {
          content: "";
          display: block;
          width: 100%;
          height: 4px;
          background: linear-gradient(90deg, #0d0d0dff, #0d0d0eff);
          margin: 8px auto 0;
          border-radius: 10px;
        }

        /* -------- Table Container -------- */
        .admin-users-table-container {
          width: 100%;
          background: #fff;
          border-radius: 16px;
          box-shadow: 0 6px 25px rgba(0, 0, 0, 0.08);
          padding: 25px 35px;
          overflow-x: auto;
          animation: fadeIn 0.7s ease-in-out;
        }

        /* -------- Table Styling -------- */
        .admin-users-table {
          width: 100%;
          border-collapse: collapse;
          text-align: center;
          font-size: 15px;
          border-radius: 10px;
          overflow: hidden;
        }

        .admin-users-table thead tr {
          background: linear-gradient(90deg, #111, #222);
          color: white;
          font-size: 16px;
        }

        .admin-users-table th,
        .admin-users-table td {
          padding: 16px;
          border-bottom: 1px solid #eee;
          transition: all 0.3s ease;
        }

        /* Alternate row color + hover animation */
        .admin-users-table tbody tr:nth-child(even) {
          background-color: #fafafa;
        }

        .admin-users-table tbody tr:hover {
          background-color: #f2f7ff;
          transform: scale(1.01);
        }

        /* -------- Role Colors -------- */
        .role-admin {
          color: #00b341;
          font-weight: 700;
        }
        .role-teacher {
          color: #007bff;
          font-weight: 700;
        }
        .role-student {
          color: #ff3e7f;
          font-weight: 700;
        }

        /* -------- Empty State -------- */
        .no-users {
          text-align: center;
          padding: 25px;
          color: #999;
          font-style: italic;
        }

        /* -------- Animation -------- */
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>

      <AdminHeader />
      <AdminSlidebar />

      <div className="admin-users-container">
        {/* Page Title */}
        <div className="admin-users-header">
          <h2>All Registered Users</h2>
        </div>

        {/* User Table */}
        <div className="admin-users-table-container">
          <table className="admin-users-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
              </tr>
            </thead>
            <tbody>
              {users.length > 0 ? (
                users.map((u, index) => (
                  <tr key={u._id || index}>
                    <td>{index + 1}</td>
                    <td>{u.name}</td>
                    <td>{u.email}</td>
                    <td
                      className={
                        u.role === "admin"
                          ? "role-admin"
                          : u.role === "teacher"
                          ? "role-teacher"
                          : "role-student"
                      }
                    >
                      {u.role}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="no-users">
                    No registered users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default AdminUsers;

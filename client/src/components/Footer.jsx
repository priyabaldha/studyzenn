{/* ================ Start Footer Area ================= */}
<footer className="footer-area section-gap">
  <div className="container">
    <div className="row">
      <div className="col-lg-3 col-md-6 single-footer-widget">
        <h4>Quick Links</h4>
        <ul>
          <li><a href="#">About Us</a></li>
          <li><a href="#">Dashboard</a></li>
          <li><a href="#">Support</a></li>
          <li><a href="#">Contact</a></li>
        </ul>
      </div>

      <div className="col-lg-3 col-md-6 single-footer-widget">
        <h4>Features</h4>
        <ul>
          <li><a href="#">Assignments</a></li>
          <li><a href="#">Grades</a></li>
          <li><a href="#">Attendance</a></li>
          <li><a href="#">Reports</a></li>
        </ul>
      </div>

      <div className="col-lg-3 col-md-6 single-footer-widget">
        <h4>Resources</h4>
        <ul>
          <li><a href="#">Help Center</a></li>
          <li><a href="#">User Guide</a></li>
          <li><a href="#">Teacher Portal</a></li>
          <li><a href="#">Student Guide</a></li>
        </ul>
      </div>

      <div className="col-lg-3 col-md-6 single-footer-widget">
        <h4>Stay Updated</h4>
        <p>Get StudyZen news and updates.</p>
        <form className="d-flex align-items-center">
          <input
            className="form-control me-2"
            type="email"
            placeholder="Your Email"
            required
            style={{ flex: 1, minWidth: "0" }}
          />
          <button className="click-btn btn btn-default text-uppercase" type="submit">
            SUBSCRIBE
          </button>
        </form>
      </div>
    </div>

    <div className="footer-bottom row align-items-center mt-4">
      <p className="footer-text m-0 col-lg-12 text-center">
        © {new Date().getFullYear()} StudyZen | Empowering education with ❤️ by the StudyZen Team.
      </p>
    </div>
  </div>
</footer>
{/* ================ End Footer Area ================= */}
import { Link, NavLink } from "react-router-dom";

function Navbar2() {
  return (
    <>
      <nav className="navbar navbar-expand-lg bg-white navbar-light shadow border-top border-5 border-primary sticky-top p-0">
        <div className="navbar-brand d-flex align-items-center px-4 px-lg-5">
          <NavLink
            to="/"
            className="d-flex align-items-center"
            style={{ height: "auto" }}
          >
            <img
              src="/logo-black.png"
              alt="mekuskitchen Logo"
              style={{
                height: "60px",
                width: "auto",
              }}
            />
          </NavLink>
        </div>
        <div className="collapse navbar-collapse" id="navbarCollapse">
          <div className="navbar-nav ms-auto p-4 p-lg-0">
            <div className="d-flex align-items-center">
              <Link
                to="/login"
                className="btn btn-outline-primary me-2"
                style={{ height: "auto", lineHeight: "normal" }}
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="btn btn-outline-primary me-2"
                style={{ height: "auto", lineHeight: "normal" }}
              >
                Signup
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}

export default Navbar2;

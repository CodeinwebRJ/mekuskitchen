import React from "react";
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
              src="/logo2.png"
              alt="Et World Logo"
              style={{ height: "50px", width: "auto" }}
            />
          </NavLink>
        </div>
        <button
          type="button"
          className="navbar-toggler me-4"
          data-bs-toggle="collapse"
          data-bs-target="#navbarCollapse"
        >
          <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse" id="navbarCollapse">
          <div className="navbar-nav ms-auto p-4 p-lg-0">
            {/* <NavLink to="/" className="nav-item nav-link active">
              Home
            </NavLink>
            <NavLink to="/about" className="nav-item nav-link">
              About
            </NavLink>
            <div className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle"
                href="#"
                id="navbarDropdown"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Services
              </a>
              <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                <li>
                  <NavLink to="/logistic" className="dropdown-item">
                    <i className="fas fa-truck mr-2" /> Logistic
                  </NavLink>
                </li>

                <li>
                  <hr className="dropdown-divider" />
                </li>
              </ul>
            </div>
            <NavLink to="/loan-calculator" className="nav-item nav-link">
              Loan Calculator
            </NavLink> */}

            <div className="d-flex align-items-center">
              <Link
                to="/subuser-login"
                className="btn btn-outline-primary me-2"
                style={{ height: "auto", lineHeight: "normal" }}
              >
                Login As Subuser
              </Link>
              <Link
                to="/"
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

import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../../context/authContext";
//import Avatar from "../../assets/images/avatar.png";
import "../../assets/styles/navbar.css";

const Navbar: React.FC = () => {
  const { isAuthenticated, logout, user } = useAuth();
  //console.log(isAuthenticated, user);
  return (
    <section className="col-12 vh-10">
      <nav className="navbar fixed-top navbar-expand-lg navbar-light bg-white vh-10 border-bottom border-1">
        <div className="container-fluid bg-white">
          <a className="navbar-brand" href="#home">
            <h5>
              <span className="custom-span">Hilton</span>
              <br />
              <strong>Alliance</strong>
            </h5>
          </a>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#menu"
            aria-controls=""
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="menu">
            {isAuthenticated ? (
              <>
                <ul className="navbar-nav mx-auto">
                  <li className="nav-item mx-1">
                    <Link className="nav-link fs-5 active" to="/">
                      Home
                      <span className="visually-hidden">(current)</span>
                    </Link>
                  </li>
                  <li className="nav-item mx-1">
                    <Link className="nav-link fs-5" to="/hotels">
                      Hotels
                    </Link>
                  </li>
                  <li className="nav-item mx-1">
                    <Link className="nav-link fs-5" to="/rooms">
                      Rooms
                    </Link>
                  </li>
                  <li className="nav-item mx-1">
                    <Link className="nav-link fs-5" to="/reservations">
                      Reservations
                    </Link>
                  </li>
                </ul>
                <form className="d-flex">
                  <div className="dropdown">
                    <button
                      id="dropdownMenu"
                      className="btn text-dark"
                      type="button"
                      data-bs-toggle="dropdown"
                      aria-haspopup="true"
                      aria-expanded="false"
                      style={{ background: "none", border: "none" }}
                    >
                      <div className="d-flex align-items-center">
                        <span>
                          <FontAwesomeIcon icon={faUser} size="2x" className="mx-2" />
                        </span>
                        {/* <img
                          src={Avatar}
                          alt="Avatar de usuario"
                          className="user-avatar img-fluid me-2"
                        /> */}
                        <div className="text-start">
                          <span className="user-color fw-bold d-block">
                            Welcome!
                          </span>
                          <h6 className="m-0">{user.username}</h6>
                        </div>
                      </div>
                    </button>
                    <div
                      className="dropdown-menu"
                      aria-labelledby="dropdownMenu"
                    >
                      <li>
                        <Link
                          className="dropdown-item"
                          to="/"
                          onClick={() => logout()}
                        >
                          Logout
                        </Link>
                      </li>
                    </div>
                  </div>
                </form>
              </>
            ) : (
              <>
                <ul className="navbar-nav mx-auto">
                  <li className="nav-item mx-1">
                    <Link className="nav-link fs-5 active" to="/">
                      Home
                      <span className="visually-hidden">(current)</span>
                    </Link>
                  </li>
                  <li className="nav-item mx-1">
                    <Link className="nav-link fs-5" to="/hotels">
                      Hotels
                    </Link>
                  </li>
                  <li className="nav-item mx-1">
                    <Link className="nav-link fs-5" to="/rooms">
                      Rooms
                    </Link>
                  </li>
                  <li className="nav-item mx-1">
                    <Link className="nav-link fs-5" to="/reservations">
                      Reservations
                    </Link>
                  </li>
                </ul>
                <form className="d-flex">
                  <ul className="navbar-nav mx-auto">
                    <li className="nav-item mx-1">
                      <Link
                        className="btn btn-primary col-12 mb-4 mb-lg-0 nav-link fs-5"
                        to="/register"
                      >
                        Signup
                      </Link>
                    </li>
                    <li className="nav-item mx-1">
                      <Link
                        className="btn btn-primary col-12 mb-4 mb-lg-0 nav-link fs-5"
                        to="/login"
                      >
                        Sing In
                      </Link>
                    </li>
                  </ul>
                </form>
              </>
            )}
          </div>
        </div>
      </nav>
    </section>
  );
};

export default Navbar;

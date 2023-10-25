import "../Login/LoginAndRegister.css";

import { Link } from "react-router-dom";

const Register = () => {
  return (
    <section className="auth">
      <div className="formBox register__formBox ">
        <form className="auth__form">
          <h2>Register</h2>
          <div className="inputBox">
            <input type="text" name="name" required />
            <label htmlFor="name">Name: </label>
          </div>
          <div className="inputBox">
            <input type="text" name="email" required />
            <label htmlFor="email">Email:</label>
          </div>
          <div className="inputBox">
            <input type="password" name="password" required />
            <label htmlFor="password">Password:</label>
          </div>
          <div className="inputBox">
            <input type="password" name="password" required />
            <label htmlFor="password">Confirm Password:</label>
          </div>
          <button className="auth__button">Register</button>
          <div className="auth__links">
            <Link to="/" className="link">
              Home
            </Link>
            Already have an account?
            <Link to="/login" className="link">
              Login
            </Link>
          </div>
        </form>
      </div>
    </section>
  );
};

export default Register;
